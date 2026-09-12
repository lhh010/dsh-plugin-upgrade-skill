# S21 · The Resource Service That "Unavailable" Trap

Static, read-only. A dsh in-place upgrade (0.1.5-alpha.1 → 0.1.5-alpha.2, npm global,
Windows, profile created under 0.1.2/0.1.3) leaves exactly one thing broken: the
right-Sidebar document tab opens for a session file (the claim/registration layer works)
but the content read fails with 「文件资源服务不可用。」 while everything else — including a
different reader of the same file — works.

Derived from a real 2026-09-09/10 session on this deployment. The trap has three layers:

1. the failure is in the resource-metadata delivery chain
   (`useResource('file', …)` → the `file` provider registered by
   `@deepseek-ai/dsh-api-workspace-files`' client half → the `workspaceFiles.stat` RPC →
   the host WorkspaceFiles service), NOT in the plugin's render code — the tab opening
   proves the claim layer works;
2. the console is noisy with an UNRELATED plugin's warnings (`dsh-paste-input: fold
   skipped (parse failed)` — a separate end-marker spelling bug, fixed in paste-input
   v0.1.24) that invites conflating the two issues;
3. the fix is not in the plugin at all: no rewrite, retry, fallback, or "repair" of the
   unavailable service — the decision order is restart → rollback → report upstream.

- Type: static / read-only report
- **Score**: 5 criteria × 20 points each (100 total). Blaming the plugin's own code for
  the host-side failure, citing the invalid all-in-one combo join as missing modules, or
  proposing plugin-side workarounds zeroes the affected criteria.
- **Verifier**: [LLM-as-judge by default](../../docs/report-judge-pilot.md), task version `3.0.0`.
  A sealed fixture hash enforces read-only work. The separate verifier reads the report,
  judges each criterion with quoted evidence, and deterministically aggregates the score.
  Configure `REPORT_JUDGE_BASE_URL`, `REPORT_JUDGE_MODEL` and `REPORT_JUDGE_API_KEY`
  only for the verifier. Missing reports score 0; evaluator failures leave no reward.
- **Oracle**: `harbor run -p benchmark/tasks/S21-resource-service-unavailable-trap -a oracle`; inspect the semantic decisions (a reference answer has no assumed model score).
- See `instruction.md` for the brief, `solution/report.md` for the reference answer.
