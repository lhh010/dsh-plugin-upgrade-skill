# S10-paste-rename-and-version-chip · Paste renaming & version chip (read-only)

Two post-release follow-ups on a community attachment plugin: (A) pasted files need unified
renaming — images `paste_image.<ext>`, other files `paste_file.<ext>`, sequence numbering
`(2)`, `(3)`… derived from the authoritative live-chip set, while drops and the picker keep
real names; (B) the self-update version chip displayed a CDN-stale fetched tag as "latest"
minutes after a push. The agent must design the rename (scheme, scope, conflict source,
extension fallback), name the chip's display rule (compare fetched tag vs running version,
show the newer), and give the regression + lib-only release hygiene. 题面见
[instruction.md](instruction.md)，判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate); no dsh (static task).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis/design aspects, 0-100 normalized to
  `/logs/verifier/reward.txt`.
- **Oracle**: `harbor run -p benchmark/tasks/S10-paste-rename-and-version-chip -a oracle`, expected reward 1.0.

```
environment/fixture/   # evidence pack: attachment-flow excerpt, chip code, user threads, captured HTTP response
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # reference report + solve.sh
```

Fixture provenance: trimmed from the same real 2026-09-01 dsh-paste-input session as S9
(the v0.1.10 unified-renaming feature and the v0.1.11 chip fix).
