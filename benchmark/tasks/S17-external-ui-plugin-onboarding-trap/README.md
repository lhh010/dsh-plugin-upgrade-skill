# S17 · External UI Plugin Onboarding Trap

Static, read-only. A user hand-writes a new external web UI plugin and inserts it into a
running web profile (profile node_modules + `cordis.patch.yml` insert). The first boot
kills EVERY plugin's registration with a browser error naming an innocent first-awaited
entry (the real culprit: one raw-ESM client bundle failing the whole classic-script
combo); the repackaged plugin then fails apply on a cross-entry slot declaration; and the
dev loop itself bites (combo assembled once at boot — every edit needs a full host
restart, and on Windows an improper stop leaves the port bound, EADDRINUSE).

Derived from a real 2026-09-04 incident: hand-writing `@lhh010/dsh-profiles` onto a
source-launched dsh 0.1.3-alpha.1 web profile on Windows (misattributed combo failure →
ModuleLoader repackaging → cross-entry slot declaration → tree-kill restart discipline).

- Type: static / read-only report
- Score: 5 criteria × 20 points, sealed fixture hash, separate semantic verifier
- **Verifier**: [LLM-as-judge by default](../../docs/report-judge-pilot.md), task version `3.0.0`.
  A sealed fixture hash enforces read-only work. The separate verifier reads the report,
  judges each criterion with quoted evidence, and deterministically aggregates the score.
  Configure `REPORT_JUDGE_BASE_URL`, `REPORT_JUDGE_MODEL` and `REPORT_JUDGE_API_KEY`
  only for the verifier. Missing reports score 0; evaluator failures leave no reward.
- **Oracle**: `harbor run -p benchmark/tasks/S17-external-ui-plugin-onboarding-trap -a oracle`, expected 1.0.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer.

in `npm test`). The verifier only reads agent artifacts; it never installs counter-example
or oracle reports into the answer directory and does not require `/solution/`.
