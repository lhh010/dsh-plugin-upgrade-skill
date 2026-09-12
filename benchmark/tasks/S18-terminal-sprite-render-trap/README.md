# S18 · Terminal Sprite Render Trap

Static, read-only. A terminal pixel sprite (the dsh-TUI whale, 25x40 cells rendered with
half-block glyphs) shows phantom pixels along its right edges (outline, Z symbols,
hearts), ghost pixels surviving frame switches, and a drifted hand-ported frame; flipping
the animation feature default-on then hangs a channel-ui CI job until its timeout.

Derived from the real 2026-09-05 dsh-TUI whale follow-up session (tail-tip pixel drift,
half-block SGR background leak, trailing-trim ghosting, planner timer pinning a probe
host).

- Type: static / read-only report
- Score: 5 criteria × 20 points, sealed fixture hash, separate semantic verifier
- **Verifier**: [LLM-as-judge by default](../../docs/report-judge-pilot.md), task version `3.0.0`.
  A sealed fixture hash enforces read-only work. The separate verifier reads the report,
  judges each criterion with quoted evidence, and deterministically aggregates the score.
  Configure `REPORT_JUDGE_BASE_URL`, `REPORT_JUDGE_MODEL` and `REPORT_JUDGE_API_KEY`
  only for the verifier. Missing reports score 0; evaluator failures leave no reward.
- **Oracle**: `harbor run -p benchmark/tasks/S18-terminal-sprite-render-trap -a oracle`; inspect the semantic decisions.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer.
