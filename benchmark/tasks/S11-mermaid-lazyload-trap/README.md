# S11-mermaid-lazyload-trap · Mermaid lazy-load trap (read-only)

A lib-only plugin adds mermaid to its reading mode via a lazy chunk and hits three real
incidents: (1) default code-splitting produces sibling chunk files whose relative imports 404;
(2) the host route's `startsWith` containment guard returns 403 on Windows (realpathSync
lower-cases the drive letter) while Linux CI passes; (3) Ctrl+scroll under the zoom modal fires
both the modal zoom and the pane's font sizing. The agent derives each mechanism from the
evidence and produces fixes + regression coverage. 题面见 [instruction.md](instruction.md)，
判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate); no dsh (static task).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis aspects, 0-100 normalized to
  `/logs/verifier/reward.txt`.
- **Oracle**: `harbor run -p benchmark/tasks/S11-mermaid-lazyload-trap -a oracle`, expected reward 1.0.

```
environment/fixture/   # evidence pack: host route source, console captures, CI note
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # reference report + solve.sh
```

Fixture provenance: trimmed from the real 2026-09-01 dsh-file-trace mermaid integration
(v0.2.3/v0.2.4); companion skill `skills/plugin-heavy-dep/` (method-level checklist).
