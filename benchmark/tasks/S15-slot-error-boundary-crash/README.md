# S15 · Slot Error-Boundary Crash (vanishing dock chips)

Static, read-only. A lib-only Web plugin's dock-chip component references another
component's state variable (`busy`) inside a props object; the expression only evaluates
when the phase guard is false, so the bug ships latent — until the first release where a
user actually renders a chip, the ReferenceError fires inside the slot and the framework's
error boundary unmounts the entire entry. The user-visible symptom is "the chips are gone",
pointing at the newest feature diff instead of the pre-existing line.

Derived from a real 2026-09-03 dsh-paste-input v0.1.17 session (dangling `busy` in
AttachmentChips; surfaced by the hover-preview rollout).

- Type: static / read-only report
- Score: 5 aspects × 20 points, fixture-modification gate → 0
- **Oracle**: `harbor run -p benchmark/tasks/S15-slot-error-boundary-crash -a oracle`, expected 1.0.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer
