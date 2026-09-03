# S15 report — The silent slot crash

## 1. Exact root cause

The throwing expression is the remove button's `disabled` prop in AttachmentChips:

```js
disabled: (props.input?.phase ?? 'plain') !== 'plain' || busy
```

`busy` is a useState variable of **AttachButton**, a sibling component; inside
AttachmentChips it is an undeclared free identifier. Evaluating it throws
`ReferenceError: busy is not defined`. Three things control when that happens:

- **Short-circuit latency**: `A || busy` only evaluates `busy` when `A` is false. `A` is
  the phase guard, false exactly in the normal typing state ('plain'). So the line throws
  precisely when the button should be enabled — but only when the object literal is
  evaluated at all…
- **…which only happens when a chip renders**: the empty dock returns null before the map
  (`if (occurrences.length === 0) return null`). No pending attachment → the throwing line
  never executes → the bug ships green through v0.2.10.
- **Slot-level error boundary**: the throw happens during the dock slot's render; the
  framework catches it and unmounts the whole slot entry. The symptom is therefore 'the
  chips (and their x buttons) vanished entirely', not 'one broken button', and the error
  surfaces only in the browser console — which users never open. The attach button lives
  in a different slot and is unaffected.

## 2. Correct attribution (not the v0.2.11 diff)

The v0.2.11 feature diff touched the same component, so 'my new hover-preview code crashed
the dock' is the tempting conclusion — but every added line in feature.diff is either a
guarded optional chain or a conditional child; none can throw on its own at render. The
correct bisection:

1. **Rollback/re-add bisect**: revert only the diff → the chip still vanishes when a
   screenshot is pasted → the crash predates the diff. Or:
2. **Minimal render mount**: mount AttachmentChips directly (React test renderer /
   headless) with one occurrence and `input.phase = 'plain'` → the ReferenceError points
   at the exact line and file, independent of the feature code.

The distinguishing evidence: v0.2.10 shipped the same `|| busy` line (see the shipped
excerpt), and v0.2.10 users 'used the x button fine' only because none of them had hit
the chip-present + plain-phase combination after that hardening release — which is
exactly what pasting a screenshot to test hover preview does first. New feature ≠ new
bug; it was the **first exerciser** of a latent one.

## 3. The fix and the cheap hardening

- Remove the dangling reference: `disabled: (props.input?.phase ?? 'plain') !== 'plain'`.
  If a busy-like state is genuinely wanted in the dock, it must be a local useState in
  AttachmentChips (or a prop) — never another component's variable.
- Hardening for slot components (cheap insurance, both applied to the diff's own lines):
  - defensive reads: `(record?.items ?? []).find(...)` — a missing array must not turn
    into a TypeError that unmounts the slot;
  - optional-chained DOM access: `event.target.closest?.('.remove')` — event targets are
    not guaranteed Elements (text nodes).
- Rationale: inside an error boundary, ANY throw costs the whole slot, so slot components
  deserve a lower tolerance for ambient-undefined reads than page-level components.

## 4. The regression that would have caught it

A **render smoke with data present**: mount AttachmentChips (via the dock, or directly
with a fake input carrying one occurrence whose record has items) and assert the chip
element with its remove button actually renders — plus, if the harness exposes it, assert
no error-boundary capture fired. The empty-dock path returns null before the throwing
line, so an empty-state test is structurally unable to catch this class. One occurrence,
phase 'plain', assert the chip and the remove button exist in the rendered output.

## 5. Release-process lesson

`node --check` (syntax-only) passes a free identifier by definition — it is a runtime
binding error. For a lib-only plugin whose UI lives in slots, the minimum viable pre-ship
check is: syntax check **plus at least one data-present render smoke per slot-rendering
component** (headless DOM or React test renderer), because that is the only level at
which free identifiers, bad prop shapes, and throwing expressions actually fire. Cheaper
companion: lint with no-undef, which flags free identifiers statically — it would have
named `busy` at commit time.
