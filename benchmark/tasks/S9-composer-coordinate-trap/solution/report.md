# S9 Composer-coordinate diagnosis (reference answer)

## 1. Why the first paste succeeds and every later one fails

The host input machine maintains **two projections of the same composer document**
(`host-input-contract.ts`):

- the **clipboard projection** — `InputState.draft` and every `Occurrence.offset/length`:
  a chip is expanded to its whole `clipboardText` (here `[attachment: screenshot.png]`, 28 chars);
- the **detect projection** — `EditorProjection.detectText`: a chip is exactly **one U+FFFC
  character**.

Both verbs in `host-input-facade.ts` take spans in **detect coordinates**: `insertReference`
splices the detect text at `span.start/end`, and `consumeToken`'s span guard CASes then
splices the detect text. My plugin computes the insertion point as
`snapshot.draft.length` — a **clipboard-projection** length.

On paste #1 the composer is empty: both projections are length 0, the coordinates coincide,
and the insert applies. After the first chip exists, `draft.length` is 29 while the detect
text is only 1 char long; the insertion point falls **past the end of the detect text**, the
splice cannot apply, `insertReference` returns `false`, and my code translates that into
"The DSH composer changed before the attachment could be inserted". Nothing about the
composer actually changed — the toast is my own misreading of a coordinate rejection.
"First works, later fails" is the signature: the two coordinate systems only diverge once at
least one opaque chip occupies the document.

## 2. Why × shows `unavailable` instead of removing the chip

The removal path has the **same mismatch in the opposite direction**: I pass
`occurrence.offset .. offset+length` — clipboard coordinates (0..28) — into
`consumeToken`'s span guard, which compares against the detect text (1 char). The splice
silently fails; `consumeToken` returns `false`, and my code never inspects it. The next
line deletes the record anyway (`records.delete(occurrence.ref)`), and the dock renders
`record === undefined` as the `unavailable` placeholder — while both the dock chip and the
composer chip (driven by the still-alive occurrence) remain on screen.

## 3. Fix direction (derived from the host excerpts)

Convert clipboard coordinates to detect coordinates **at both call sites** before calling
the verbs. The rule follows from the two chip widths: each chip that precedes the target
position contributes `length − 1` fewer characters in the detect text than in the draft, and
a chip itself spans exactly 1 detect character.

- **Insert**: `detectEnd = draft.length − Σ(earlier occurrence.length − 1)`; pass
  `start = end = detectEnd`.
- **Remove**: locate the occurrence among `snapshot.occurrences` (sorted by offset);
  `detectStart = occurrence.offset − Σ(preceding occurrences' length − 1)`; pass
  `start = detectStart, end = detectStart + 1`.
- Keep the existing `setDraft` slice as a fallback (draft slicing is correct in clipboard
  coordinates because `setDraft` takes the clipboard projection), and **retire the record
  only after the removal verb reports success** (or after the fallback ran), never
  unconditionally.

## 4. Regression test plan

1. **Repeat interaction**: paste attachment A, then paste attachment B in the same session —
   assert `insertReference` accepted both, two composer occurrences exist, and two dock
   chips render (the pre-fix code fails on B by construction).
2. **Removal clears every view**: click × on a dock chip with at least one other chip
   present — assert the composer occurrence count drops by exactly one, the dock chip is
   gone (not `unavailable`), and the record map no longer lists it; the other chip is
   untouched (also covers the coordinate fold with a preceding chip).
3. Edge: removal of the **first** and the **last** chip respectively (both folds), and paste
   after deleting all chips (coordinates coincide again).

## 5. What to check in the host source before calling input-machine verbs

Read the verb's implementation and doc comment in the DSH source before use, and answer:
**which text do the offsets index** (the guard's projection, not the published field's),
**what does one chip weigh in each representation**, and **what happens when the verb
declines** (return value semantics). Any value derived from `InputState.draft` or
`Occurrence.offset/length` must be explicitly converted before entering a span-taking verb;
a unit test that only exercises the first interaction cannot catch the divergence.