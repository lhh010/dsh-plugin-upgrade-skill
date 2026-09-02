# S12-global-upgrade-ebusy-trap · Global upgrade EBUSY + downgrade trap (read-only)

A user tries to upgrade dsh from alpha.5 to alpha.6 and fails twice: first EBUSY on
koffi.node (the running dsh host process holds an OS file lock on the native addon that a
page refresh cannot release), then after stopping dsh, a combined install command from a
plugin README silently downgrades dsh to rc.2 (unpinned npm install -g resolves to the
`latest` dist-tag, not the current or newest version). 题面见 [instruction.md](instruction.md)，
判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis aspects, 0-100.
- **Oracle**: `harbor run -p benchmark/tasks/S12-global-upgrade-ebusy-trap -a oracle`, expected 1.0.

Fixture provenance: trimmed from a real 2026-09-02 upgrade incident (dsh alpha.4→alpha.5,
author's own session).