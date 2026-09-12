# S16 · Self-Host Upgrade Trap

Static, read-only. An agent session running INSIDE the dsh host executes the global
`npm install -g @deepseek-ai/dsh@<new>` as a tool call: npm removes/replaces the very
package tree the session's own process runs from, the GUI dies mid-call, and the
interrupted install leaves the package content present but the `dsh`/`dsh.cmd` shims
never regenerated — the CLI itself is gone until an external pinned reinstall repairs it.

Derived from a real 2026-09-03 dsh 0.1.2-alpha.5 → 0.1.2-rc.1 upgrade incident (agent
session killed its own host mid-install; repaired externally).

- Type: static / read-only report
- Score: 5 criteria × 20 points, sealed fixture hash, separate semantic verifier
- **Verifier**: [LLM-as-judge by default](../../docs/report-judge-pilot.md), task version `3.0.0`.
  A sealed fixture hash enforces read-only work. The separate verifier reads the report,
  judges each criterion with quoted evidence, and deterministically aggregates the score.
  Configure `REPORT_JUDGE_BASE_URL`, `REPORT_JUDGE_MODEL` and `REPORT_JUDGE_API_KEY`
  only for the verifier. Missing reports score 0; evaluator failures leave no reward.
- **Oracle**: `harbor run -p benchmark/tasks/S16-self-host-upgrade-trap -a oracle`, expected 1.0.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer
