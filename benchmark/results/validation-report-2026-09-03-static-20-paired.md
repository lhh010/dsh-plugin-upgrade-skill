# benchmark report · static tasks paired run (with/without plugin-upgrade skill) · 2026-09-03/04

> **Status: DRAFT — local run, not an official snapshot.** 20 static (read-only) tasks, 1 attempt per
> task per arm, scored with the official judge.mjs. v2 of this report: the first commit of PR #148
truncated the file mid-table; this commit replaces it with the complete content (and extends the
run with the S16 task after it merged as task 52).

Paired `with-skill` / `without-skill` evaluation of `skills/plugin-upgrade` on the 20 non-Docker
static tasks of the benchmark (all S-series + H4/H6/H12/H13; S16 is task 52 on current main),
run in a controlled workspace with per-arm report isolation, official judges, and a post-run
file-access audit.

## Headline

| Metric | without-skill | with-skill | delta |
| --- | --- | --- | --- |
| Mean of per-task scores | 65.90 | 74.15 | **+8.25** |
| Median of per-task scores | 80 | 80 | **+0** |
| Summed reward (/2000) | 1318 | 1483 | +165 |
| Per-task win / tie / loss (skill vs no-skill) | — | — | **6 / 14 / 0** |
| Perfect tasks (both arms 100) | 9 | 10 | — |

**The median shows no change (80 vs 80); the mean moves +8.25, and the skill arm never loses a
task** — 6 wins, 14 ties, 0 losses. The wins sit on the harder diagnostic tasks (H6 +25, H12
+15, S5 +25, S7 +40, S2 +40, S3 +20). 11 tasks saturate at 100 in both arms, so the ceiling
understates the effect. S16 — authored from this very run's incident — scores 100 in both arms.

## Per-task results

| Task | without-skill | with-skill | Δ (skill − noskill) |
| --- | --- | --- | --- |
| S1-static-scan | 33 | 33 | 0 |
| S2-negative-scan | 60 | 100 | **+40** |
| S3-snapshot-migration | 60 | 80 | **+20** |
| S4-legacy-client-imports | 100 | 100 | 0 |
| S5-negative-naming | 25 | 50 | **+25** |
| S6-corridor-net-state | 10 | 10 | 0 |
| S7-unpublished-cohort | 10 | 50 | **+40** |
| S8-release-routing-trap | 100 | 100 | 0 |
| S9-composer-coordinate-trap | 100 | 100 | 0 |
| S10-paste-rename-and-version-chip | 100 | 100 | 0 |
| S11-mermaid-lazyload-trap | 100 | 100 | 0 |
| S12-global-upgrade-ebusy-trap | 100 | 100 | 0 |
| S13-peer-range-vs-runtime | 80 | 80 | 0 |
| S14-link-install-lock-trap | 80 | 80 | 0 |
| S15-slot-error-boundary-crash | 100 | 100 | 0 |
| S16-self-host-upgrade-trap | 100 | 100 | 0 |
| H4-tsbuildinfo-trap | 100 | 100 | 0 |
| H6-remote-error-trap | 0 | 25 | **+25** |
| H12-remote-result-boundary-trap | 60 | 75 | **+15** |
| H13-ghost-host-trap | 0 | 0 | 0 |

Notes on the bottom rows: **H6/H12** the skill arm cites the exact card (`A2-02`, `R-11`) and
the namespaced code vocabulary, enough to earn partial credit where the no-skill arm pinned
zero. **H13 is anomalous**: both arms probed the REAL local host (127.0.0.1:3080 of the author
machine) instead of reading the fixture's ghost-host scenario, so both scored 0 — a
prompt-design artifact, not a skill effect; a fixture-only rerun would be needed to measure H13.

## Tokens, duration, cost

> **Token and cost figures are ESTIMATES.** They are computed as `chars/4` (a conservative
> English/CJK mixed constant) over model-visible input chars = prompt chars + 2× per-task fixture
> bytes (each arm re-reads the fixture), and output chars = the written report bytes. Real token
> counts include reasoning tokens, tool-call/result framing, and cache behavior that this method
> does not capture. Treat all figures as approximate.

Per the estimate (40 runs):

| Metric | value |
| --- | --- |
| Scaffold (prompt) chars | ≈438,030 |
| Fixture chars read (2× per task) | ≈124,950 |
| Input chars | ≈562,980 |
| Estimated input tokens | ≈140,745 |
| Output (report) bytes | 432,787 |
| Estimated output tokens | ≈108,197 |
| Summed attempt duration (not wall-clock; 69 subagents ran concurrently) | 77.3 min |

| Arm | duration (summed) | mean score |
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
   contaminated original (which had scored 100). The S16 arms (run last) were audited the same
   way: 0 real solution-path accesses across all six S16-era logs (the word "solution" appears
   only inside the inlined skill prose).
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
- Tasks: 20 static read-only; fixtures staged to `E:/bench/<task>/fixture`; each scored in an
  isolated `E:/app` git-baseline layout with the official `judge.mjs` (no Docker/Harbor needed)
- Judge scoring: official per-task judge, 0–100; fixture-modification gate enforced
- Attempts per task/arm: 1 (re-runs only after infra/audit failures: S4/S10/S11 relaunches and
  the S3 no-skill integrity re-run described above)
- **Model: changed mid-run.** Most runs used **GLM-5.3**; after a quota break the **S16 arms and
  the S3 no-skill integrity re-run used DeepSeek-V4-Flash-Vision-Exp**. The model difference
  partially confounds per-task numbers across the switch boundary.
- Subagents: launched via the harness subagent mechanism, ≤2 concurrent after a 429 rate-limit event
- Host: Windows 11 Pro, `@deepseek-ai/dsh` 0.1.2-rc.1 (npm global), working dir `E:/deepseek-harness/test-lhh010`

## How to reproduce

Staging + both-arm prompts are under `E:/bench/<task>/prompt-{noskill,skill}.md`; the single-arm
judge runner is `E:/bench/run-judge-arm.mjs <task> <noskill|skill>` (stages fixture + that arm's
report only, so arm reports can never contaminate each other). The no-skill arm prompt forbids the
repo and any path outside `E:/bench/<task>/fixture`; the skill arm inlines
`skills/plugin-upgrade/SKILL.md` (S12–S16 arms: reads an isolated copy of the skill directory).

## Known deviations / caveats

- H13 result is uninformative for skill effect (both arms probed the live host; see note above).
- S3/no-skill final number is the clean integrity re-run (60); the contaminated first attempt is
  excluded (its 100 is not counted anywhere).
- PR #148's first commit shipped a truncated version of this file (partial staging restore); this
  commit supersedes it.
