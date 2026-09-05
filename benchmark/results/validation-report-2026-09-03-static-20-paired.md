# benchmark report · 18 eligible static task pairs (with/without plugin-upgrade skill) · 2026-09-03/04

> **Status: DRAFT — local run, not an official snapshot.** 20 task records per arm, with
> 18 eligible static task pairs in the corrected summary. One retained attempt per task per
> arm, scored with the official judge.mjs. This revision corrects eligibility and aggregate
> arithmetic; it does not change recorded scores or claim any new model runs.

The local run covered all 16 S-series tasks plus H4/H6/H12/H13, with per-arm report isolation,
official judges, and a post-run file-access audit. H13 is a runtime task whose required host
environment was not reproduced; its 0/0 is excluded as an invalid environment result. S3's
retained arms used different models after an integrity re-run, so that pair is also excluded.
The remaining 18 pairs use the same model within each pair: 17 GLM-5.3 pairs and one
DeepSeek-V4-Flash-Vision-Exp pair (S16, added after it merged as task 52).

## Headline

| Metric | without-skill | with-skill | delta |
| --- | --- | --- | --- |
| Eligible task pairs | 18 | 18 | — |
| Mean of per-task scores | 69.89 | 77.94 | **+8.06** |
| Median of per-task scores | 90 | 100 | **+10** |
| Summed reward (/1800) | 1258 | 1403 | +145 |
| Per-task win / tie / loss (skill vs no-skill) | — | — | **5 / 13 / 0** |
| Perfect tasks in each arm | 9 | 10 | +1 |

Across these 18 pairs, the observed median moves **90 → 100** and the mean moves **+8.06**;
there are 5 wins, 13 ties, and 0 losses. The wins are H6 (+25), H12 (+15), S5 (+25), S7 (+40),
and S2 (+40). **Nine tasks score 100 in both arms**; the score ceiling limits what those ties
can reveal, but does not establish an unmeasured benefit. S16 — authored from this run's
incident — scores 100 in both arms.

The pooled summary is descriptive across two model/task subsets, not a single-model result:

| Model used in both arms | Eligible pairs | Mean without-skill | Mean with-skill | Mean delta | Win / tie / loss |
| --- | --- | --- | --- | --- | --- |
| GLM-5.3 | 17 | 68.12 | 76.65 | +8.53 | 5 / 12 / 0 |
| DeepSeek-V4-Flash-Vision-Exp (S16) | 1 | 100 | 100 | 0 | 0 / 1 / 0 |

One attempt per arm and the evolving task set do not establish a causal or general skill
effect. For comparison with the original report's arithmetic only, all 20 recorded rows sum
to 1318/1483 (means 65.90/74.15), with medians **80/90**, not 80/80. Those all-record figures
include the two excluded pairs and are not the eligible comparison above. Deltas use unrounded
means before rounding to two decimals.

## Per-task results

All 20 recorded rows are retained for provenance. Only rows marked `yes` enter the summary;
the difference in an excluded row is not interpreted as a skill effect.

| Task | without-skill | with-skill | Recorded Δ | Included in summary |
| --- | --- | --- | --- | --- |
| S1-static-scan | 33 | 33 | 0 | yes |
| S2-negative-scan | 60 | 100 | **+40** | yes |
| S3-snapshot-migration | 60 | 80 | +20 | no — model mismatch |
| S4-legacy-client-imports | 100 | 100 | 0 | yes |
| S5-negative-naming | 25 | 50 | **+25** | yes |
| S6-corridor-net-state | 10 | 10 | 0 | yes |
| S7-unpublished-cohort | 10 | 50 | **+40** | yes |
| S8-release-routing-trap | 100 | 100 | 0 | yes |
| S9-composer-coordinate-trap | 100 | 100 | 0 | yes |
| S10-paste-rename-and-version-chip | 100 | 100 | 0 | yes |
| S11-mermaid-lazyload-trap | 100 | 100 | 0 | yes |
| S12-global-upgrade-ebusy-trap | 100 | 100 | 0 | yes |
| S13-peer-range-vs-runtime | 80 | 80 | 0 | yes |
| S14-link-install-lock-trap | 80 | 80 | 0 | yes |
| S15-slot-error-boundary-crash | 100 | 100 | 0 | yes |
| S16-self-host-upgrade-trap | 100 | 100 | 0 | yes |
| H4-tsbuildinfo-trap | 100 | 100 | 0 | yes |
| H6-remote-error-trap | 0 | 25 | **+25** | yes |
| H12-remote-result-boundary-trap | 60 | 75 | **+15** | yes |
| H13-ghost-host-trap | 0 | 0 | 0 | no — invalid environment |

Notes on the bottom rows: **H6/H12** the skill arm cites the exact card (`A2-02`, `R-11`) and
the namespaced code vocabulary; the recorded scores improve from 0 to 25 on H6 and from
60 to 75 on H12.

**H13 is an environment failure, excluded from the summary.** Both arms probed the author's
real local host at 127.0.0.1:3080. The [official task](../tasks/H13-ghost-host-trap/instruction.md)
requires `bash /app/ops/provision.sh` in its disposable environment: start the old host, upgrade
the disk installation while that process stays alive, then probe that host. Its
[judge](../tasks/H13-ghost-host-trap/tests/judge.mjs) returns 0 immediately when
`/app/ops/state.json` is missing and also checks the provisioned PID and a live HTTP reply.
Staging only the fixture and a report does not reproduce this setup; a fixture-only rerun
would still be invalid. Re-run both arms in the official task environment before including H13.

**S3 is a model-mismatched pair, excluded from the summary.** The uncontaminated replacement
no-skill record (60) used DeepSeek-V4-Flash-Vision-Exp; the skill record (80) used GLM-5.3.
Their +20 difference changes both model and skill condition. Re-run both arms with the same
model and fresh isolated contexts before treating S3 as a paired skill comparison.

## Tokens, duration, cost

> **Token and cost figures are ESTIMATES.** They are computed as `chars/4` (a conservative
> English/CJK mixed constant) over model-visible input chars = prompt chars + 2× per-task fixture
> bytes (each arm re-reads the fixture), and output chars = the written report bytes. Real token
> counts include reasoning tokens, tool-call/result framing, and cache behavior that this method
> does not capture. Treat all figures as approximate.

The original estimates below retain their 40-record scope (20 tasks × two arms), including
S3 and H13. They have not been recalculated for the 18 eligible pairs and must not be read
as that subset's resource usage or cost. Per-task resource records are not included here.

| Metric | value |
| --- | --- |
| Scaffold (prompt) chars | ≈438,030 |
| Fixture chars read (2× per task) | ≈124,950 |
| Input chars | ≈562,980 |
| Estimated input tokens | ≈140,745 |
| Output (report) bytes | 432,787 |
| Estimated output tokens | ≈108,197 |
| Summed attempt duration (not wall-clock; reported across 69 subagents) | 77.3 min |

| Arm | duration (original summed estimate) | mean score (all 20 recorded rows, not eligible pairs) |
| --- | --- | --- |
| without-skill | ≈34.5 min | 65.90 |
| with-skill | ≈42.8 min | 74.15 |

**Estimated cost** (dependent on the assumed model unit price — the run used two models; see
Environment):

| Assumed pricing | input | output | est. cost |
| --- | --- | --- | --- |
| GLM-5.3 @ $0.30 / $1.20 per M tokens | $0.042 | $0.130 | **≈$0.17** |
| DeepSeek V4-Flash-Vision-Exp @ $0.27 / $1.10 per M tokens | $0.038 | $0.119 | **≈$0.16** |

## Integrity audit (post-run)

Because the skill-arm agents were given access to the benchmark repo (the skill directory
`skills/plugin-upgrade`), the run was audited three ways:

1. **8-gram overlap vs solution reports** — all 38 reports ≤2.5% overlap; no verbatim copying of
   any solution (minor overlap is shared card IDs / command lines).
2. **Session-log file-access audit** — decompressed all subagent jsonl.zstd logs and scanned
   every tool call's `file_path`/`path` for `benchmark/tasks/*/solution`. Exactly ONE violation:
   the S3-snapshot-migration **no-skill** agent read `H16-history-dock/solution/plugin/client.js`
   (a *different* task's reference, not its own). No agent read its own task's solution. The S3
   no-skill result was therefore re-run under a hard-isolation prompt after wiping all staging
   artifacts; the re-run (scored 60, logged with 0 forbidden path accesses) replaces the
   contaminated original (which had scored 100) in the recorded table. The replacement used a
   different model from the skill arm, so S3 remains excluded from the paired summary. The S16
   arms (run last) were audited the same way: 0 real solution-path accesses across all six
   S16-era logs (the word "solution" appears only inside the inlined skill prose).
3. **Theoretical exposure** — skill-arm agents for S1–S11/H4/H6 could physically reach the repo's
   `solution/` during their run; the access audit found no evidence they did. **H12/H13 and the
   S16 arms were given an isolated copy of the skill only** (`E:/skill-iso`), physically separated
   from any solutions, so those are clean by design.

**Honest limitation**: the file-access audit verifies what tools were *invoked*, not full browser
or shell history; and a solved-from-memory/paraphrased answer would not show up in an n-gram check.

## Environment

- Benchmark repo: `oh-my-dsh/dsh-plugin-upgrade-skill` local clone; the run started when main
  carried 44 tasks and finished after S12–S16 merged (52 tasks, v2.4 registry); S16 was run
  against its task definition as merged in #149
- Tasks recorded: 19 static tasks plus H13 (a runtime task run without its required environment).
  Static fixtures were staged to `E:/bench/<task>/fixture` and scored in an isolated `E:/app`
  git-baseline layout with the official `judge.mjs`. H13 cannot be validated by this static setup.
- Judge scoring: official per-task judge, 0–100; fixture-modification gate enforced for static
  tasks. H13's recorded 0/0 is not an eligible task-performance measurement.
- Attempts per task/arm: 1 (re-runs only after infra/audit failures: S4/S10/S11 relaunches and
  the S3 no-skill integrity re-run described above)
- **Model: changed mid-run.** Most runs used **GLM-5.3**; after a quota break the **S16 arms and
  the S3 no-skill integrity re-run used DeepSeek-V4-Flash-Vision-Exp**. S3 is excluded because
  its arms differ in model; S16 remains an eligible pair because both arms used the same model.
  The headline pools 17 GLM pairs and one DeepSeek pair, with model-specific summaries above.
- Subagents: launched via the harness subagent mechanism, ≤2 concurrent after a 429 rate-limit event
- Host: Windows 11 Pro, `@deepseek-ai/dsh` 0.1.2-rc.1 (npm global), working dir `E:/deepseek-harness/test-lhh010`

## How to reproduce

Staging + both-arm prompts are under `E:/bench/<task>/prompt-{noskill,skill}.md`; the single-arm
judge runner is `E:/bench/run-judge-arm.mjs <task> <noskill|skill>` (stages fixture + that arm's
report only, so arm reports can never contaminate each other). The no-skill arm prompt forbids the
repo and any path outside `E:/bench/<task>/fixture`; the skill arm inlines
`skills/plugin-upgrade/SKILL.md` (S12–S16 arms: reads an isolated copy of the skill directory).

These are author-local paths; the custom prompts and runner are not included in this PR.
The corrected aggregate is reproducible from the recorded table: exclude S3 and H13, use the
remaining 18 rows with equal task weights, and report the two model subsets separately.
Recovering S3 requires a fresh same-model pair. Recovering H13 requires the official disposable
task environment, provisioning, and live-host verification, not the static staging runner.

## Known deviations / caveats

- H13 is excluded as an invalid environment result; its original 0/0 remains visible for provenance.
- S3/no-skill final number is the clean integrity re-run (60); the contaminated first attempt is
  excluded (its 100 is not counted anywhere). The retained 60/80 pair is also excluded from the
  paired summary because its arms used different models.
- These two exclusions were made during report review, not pre-registered before the experiment.
- Token, duration, and cost estimates retain the original run scope; no eligible-subset estimate
  or new model run was produced for this correction.
- PR #148's first commit shipped a truncated version of this file (partial staging restore); this
  commit supersedes it.
