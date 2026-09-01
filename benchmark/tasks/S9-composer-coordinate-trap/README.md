# S9-composer-coordinate-trap · Composer coordinate trap (read-only)

A community attachment plugin pastes files into the DSH composer: the first paste succeeds
and every later one errors with `The DSH composer changed before the attachment could be
inserted`, while the dock chip's × leaves the chip behind showing `unavailable`. The agent
must tie both symptoms to ONE underlying contract misread — the plugin feeds
clipboard-projection offsets into host verbs whose span guards compare against the
detect projection (a chip is one U+FFFC there, its full clipboard text in the published
draft) — derive the conversion rule from the host source excerpts, and design the
repeat-interaction + removal regression plan. 题面见 [instruction.md](instruction.md)，
判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate); no dsh (static task).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis aspects, 0-100 normalized to
  `/logs/verifier/reward.txt`.
- **Oracle**: `harbor run -p benchmark/tasks/S9-composer-coordinate-trap -a oracle`, expected reward 1.0.

```
environment/fixture/   # evidence pack: plugin client excerpt, session log, host facade + contract excerpts
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # reference report + solve.sh
```

Fixture provenance: trimmed from a real 2026-09-01 debugging session on the
dsh-paste-input plugin (fixed in its v0.1.10); host excerpts quoted from the DSH
ui-conversation input facade/contract sources.
