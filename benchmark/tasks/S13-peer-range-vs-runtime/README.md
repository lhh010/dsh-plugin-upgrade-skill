# S13-peer-range-vs-runtime · Peer range vs runtime reality (read-only)

A TUI plugin's peerDependencies claim ^0.1.2-alpha.2 (npm installs without warnings, the
range is satisfied by dsh alpha.5), but it crashes at runtime because dsh alpha.4 removed
Session.events and replaced it with on-demand read APIs. The agent must distinguish
semver-range satisfaction from runtime API compatibility. 题面见 [instruction.md](instruction.md)，
判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **Environment**: `node:24-bookworm` + git (fixture baseline-committed for the read-only gate).
- **Verifier**: judge checks the fixture is unchanged + five diagnosis aspects, 0-100.
- **Oracle**: `harbor run -p benchmark/tasks/S13-peer-range-vs-runtime -a oracle`, expected 1.0.

Fixture provenance: trimmed from a real 2026-09-02 incident (dsh-tui beta.4 on dsh alpha.5,
author's own session).