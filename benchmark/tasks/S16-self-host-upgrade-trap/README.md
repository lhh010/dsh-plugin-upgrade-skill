# S16 · Self-Host Upgrade Trap

Static, read-only. An agent session running INSIDE the dsh host executes the global
`npm install -g @deepseek-ai/dsh@<new>` as a tool call: npm removes/replaces the very
package tree the session's own process runs from, the GUI dies mid-call, and the
interrupted install leaves the package content present but the `dsh`/`dsh.cmd` shims
never regenerated — the CLI itself is gone until an external pinned reinstall repairs it.

Derived from a real 2026-09-03 dsh 0.1.2-alpha.5 → 0.1.2-rc.1 upgrade incident (agent
session killed its own host mid-install; repaired externally).

- Type: static / read-only report
- Score: 5 aspects × 20 points, fixture-modification gate → 0
- **Oracle**: `harbor run -p benchmark/tasks/S16-self-host-upgrade-trap -a oracle`, expected 1.0.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer
