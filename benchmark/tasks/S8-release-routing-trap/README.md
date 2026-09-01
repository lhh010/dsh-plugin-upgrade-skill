# S8-release-routing-trap · Release routing trap (read-only)

A consumer on an older dsh runtime hits a two-stage install failure on a community plugin:
first the README-pinned tag cannot resolve on the public mirror, then the "fixed" newest tag
installs but the plugin crashes with `useConversation is not a function`. The agent must
diagnose **two distinct root causes** (tag distribution defect vs forward-incompatible version
routing) from the static evidence pack, give the consumer a working install command under the
production-freeze constraint, and the maintainer-side fix. 题面见
[instruction.md](instruction.md)，判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate); no dsh (static task).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis aspects, 0-100 normalized to
  `/logs/verifier/reward.txt`.
- **Oracle**: `harbor run -p benchmark/tasks/S8-release-routing-trap -a oracle`, expected reward 1.0.

```
environment/fixture/   # evidence pack: mirror tags, dsh version, compat table, sync script (crash symptom is quoted in instruction.md)
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # reference report + solve.sh
```

Fixture provenance: trimmed from a real 2026-08-31 incident (six-plugin mirror set; same
findings as profile-dependency-management.md §8/§9, first-hand).
