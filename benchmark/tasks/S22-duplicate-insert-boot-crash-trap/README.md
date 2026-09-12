# S22 · The Duplicate Insert That Crashed the Boot

Static, read-only. A maintainer upgrades dsh to 0.1.5-alpha.2, finds the right-Sidebar
document tab's content read unavailable, and manually inserts the workspace-files host
service into the profile's `cordis.patch.yml` — causing a fatal boot crash
(`duplicate loader entry id: workspace-files`) because the web-app bundle already
provides the same plugin.

Derived from a real 2026-09-09 dsh 0.1.5-alpha.2 upgrade session on Windows (the
maintainer's Claude Code session diagnosed the Cordis insert-duplication rule, removed
the duplicate, and replaced it with a NOTE comment).

- Type: static / read-only report
- Score: 5 criteria × 20 points, sealed fixture hash, separate semantic verifier
- See `instruction.md` for the brief, `solution/report.md` for the reference answer.

- **Verifier**: [LLM-as-judge by default](../../docs/report-judge-pilot.md), task version `3.0.0`.
  A sealed fixture hash enforces read-only work. The separate verifier reads the report,
  judges each criterion with quoted evidence, and deterministically aggregates the score.
  Configure `REPORT_JUDGE_BASE_URL`, `REPORT_JUDGE_MODEL` and `REPORT_JUDGE_API_KEY`
  only for the verifier. Missing reports score 0; evaluator failures leave no reward.