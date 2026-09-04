# 顶会投稿实验差距分析与任务分工清单

> 日期:2026-09-04。目的:盘点论文(`paper/latex/acl_latex.tex`)已承诺、但 `benchmark/results/` 里尚未完成的实验,拆成可分派的任务卡。
> 每条任务卡包含:为什么、怎么跑、产出物、验收标准、预算估计。
> 负责人 / 截止日期列留空,由分工时填写。

## 总览

| # | 任务 | 优先级 | 类型 | 预估成本 | 负责人 | 截止 |
|---|---|---|---|---|---|---|
| T1 | Generic-skill 对照组 | **P0** | 写 skill + 跑实验 | ~$5(flash)+ 半天人工 | | |
| T2 | Temporal holdout 正式实验 | **P0** | 跑实验 | ~$10–40 | | |
| T3 | 补齐现有模型到 3-run | **P0** | 跑实验 | ~$50–300 | | |
| T4 | 新增 2+ 个跨厂商模型 | **P0** | 跑实验 | 视模型定价 | | |
| T5 | 任务三维标注(难度/卡片依赖/对抗族) | **P0** | 纯人工 | 0 | | |
| T6 | Skill activation 分析 | **P1** | 跑现成脚本 | 0(无 API 成本) | | |
| T7 | with-skill 失败分类 / over-trust 量化 | **P1** | 人工读轨迹 | 0 | | |
| T8 | H6 地板任务诊断 | **P1** | 调查 | ~$2 | | |
| T9 | 冻结扩大版 snapshot(52 任务) | **P1** | 跑实验(可与 T3/T4 合并) | 视范围 | | |
| T10 | 训练 cutoff vs 版本日期对照表 | **P2** | 纯人工 | 0 | | |
| T11 | Grader 信度人工抽查 | **P2** | 人工读轨迹 | 0 | | |
| T12 | 论文数字口径统一(23 vs 24) | **P0** | 文字工作 | 0 | | |

P0 = 不完成就不能投稿;P1 = 审稿人大概率会提;P2 = 防御性加分项。

---

## 统一跑实验规范(所有任务卡共用)

1. **固定 snapshot**:正式实验一律 pin `benchmark/snapshots/2026-09-01-main-23.json`(23 任务),除非该任务卡明确说用别的。禁止用"当前 main"描述实验对象。
2. **次数与聚合**:每任务每条件 **3 次独立 trial**,取 per-task median(`node benchmark/scripts/summarize-runs.mjs` 汇总,paired 模式)。
3. **报告落盘**:报告放 `benchmark/results/validation-report-YYYY-MM-DD-<slug>.md`,**必须**包含每轮的 input/cache/output token 总和、summed job duration、成本,以及 per-task 表。缺这些数字的报告不予合并(见 `benchmark/README.md` 的提交规范)。
4. **协议**:`BENCHMARK-AUTH-v1`;正式条件为 no-network(H21 教训:Windows Docker Desktop 上 Harbor 0.22.0 的 no-network 策略会被拒,**正式跑请在 Linux 主机或可用 nftables 的 Docker 环境**)。
5. **异常处理**:verifier 无 reward 的 trial 记为异常、不得当 0 分;setup/timeout 异常在报告里保留证据。
6. **oracle 自检**:改动任何任务或 judge 后先跑 `harbor run -p <task> -a oracle` 确认参考解仍 1.0,并跑 `node benchmark/scripts/validate-execution-contract.mjs`。

---

## T1 Generic-skill 对照组(P0)

**为什么**:论文 §5.3 和摘要承诺了三条件(no-skill / generic-skill / distilled-skill),目前 generic 组不存在。没有它,"提分来自框架专属知识"的核心论点堵不住"随便给份流程都有用"的攻击。

**子任务**:

- T1a 生成 generic skill(半天):
  - 用一个 LLM 生成 `skills/generic-migration/SKILL.md`:框架无关的插件迁移方法论,**不得出现** dsh 任何版本号、API 名、卡片编号、具体命令;
  - 人工审一遍确认无 dsh 泄漏;
  - 论文里可写"对照 skill 由 LLM 在无任何框架资料条件下生成",排除人为削弱质疑;
  - 全文将进附录 D。
- T1b 跑实验:`deepseek/deepseek-v4-flash` + terminus-2,23 任务 × 3 次 × generic-skill 条件。预期 ~$5。
- T1c(可选,看 T1b 结果):在 1 个贵模型上补跑。

**产出物**:`skills/generic-migration/`(入库)、T1b 报告进 `benchmark/results/`。

**验收**:能与现有 flash with-skill / no-skill 两行做三方对比;报告数字齐全。

## T2 Temporal holdout 正式实验(P0)

**为什么**:§7.1 自称 "strongest evidence",目前只有 H21 的 6 次**有网络** calibration 跑(README 自己声明不算正式成绩)+ H11 只有 snapshot 元数据没有正式 run。

**怎么做**:

1. 选定冻结 commit(建议复用 H21 已用的 `5f7234ba4e00aeaa46c699ea32384389ad38a2a6`,或另选并在论文中固定);
2. 确定 holdout 任务集:所有"蒸馏自冻结点之后所写卡片"的任务(候选:H11、H21,以及 2026-09-01 snapshot 之后新增的 H13–H22 中符合条件的;需要逐个核对卡片日期,**这一步本身要产出一张 holdout split 表**,论文 §7.1 要用);
3. 每任务挂 `metadata.skill_snapshot_commit` 指向冻结 commit;
4. 正式 no-network 环境,≥2 个模型 × 3 次 × (with-frozen-skill / no-skill)。

**产出物**:holdout split 定义表(任务 × 卡片日期 × 冻结 commit)、正式报告。

**验收**:holdout 保留增益百分比(§7.1 的 [Z%])可以算出来;全部 trial 在正式 no-network 环境完成。

## T3 补齐现有模型到 3-run(P0)

**为什么**:§6 承诺 "median over three runs + paired bootstrap CI + Wilcoxon",目前 Luna/Terra 是单 trial,Opus 5 是 15/23 的 interim。

**子任务**:

- T3a Luna(cheap,~$4):23 任务 × 再补 2 次 × 两条件;
- T3b Terra(~$40):同上;
- T3c Opus 5(贵,~$200+):把 interim 缺的 8 个任务补全 + 已有任务补足 3/3(注意:interim 报告里 errored attempt 的 token 已消耗,要计入报告);
- 全部用同一个 snapshot;跑完后更新 `benchmark/README.md` 主表和 per-task delta 表。

**验收**:每模型每任务每条件 3 个有效 scored trial;Wilcoxon / paired bootstrap 可以算。

## T4 新增 2+ 个跨厂商模型(P0)

**为什么**:目前实际是 OpenAI 两家变体 + DeepSeek 一家,覆盖面不足以支撑 "across [N] models" 的摘要表述。

**建议候选**(至少选 2,注意每模型的 **native skill catalog 状态**要记录,论文 Limitations 已承诺 per-model 报告):

- 一个 Gemini 系(harbor 支持的 agent)
- 一个 Anthropic 非 Codex 通道 或 Kimi / Qwen 系
- 每模型:23 任务 × 3 次 × (with-skill / no-skill) 两条件

**验收**:主表模型数 ≥5,跨 ≥3 家厂商;每模型附 native-catalog 状态说明。

## T5 任务三维标注(P0,纯人工)

**为什么**:§4.2 承诺 difficulty / card-dependence 两维度,§4.3 承诺 adversarial family;附录 A 现在写着 "remain future work"——Figure 3 和 §7.2 的条件分析完全依赖这张表。

**怎么做**:两人独立标注 23 个任务的三个维度,分歧第三人仲裁:

- difficulty:easy / medium / hard(参照 oracle 解的改动面与诊断链长度);
- card-dependence:知识完全在卡片里 / 部分可从先验推得 / 与卡片无关;
- adversarial family:misleading-comment / pre-existing-failure / stale-artifact / none。

**产出物**:`benchmark/snapshots/` 或 `benchmark/docs/` 下的标注表(CSV 或 JSON),写清标注规则和仲裁记录。

**验收**:23 行全填;两人标注一致率写进论文附录。

## T6 Skill activation 分析(P1,零 API 成本)

**为什么**:`benchmark/scripts/audit-skill-activation.mjs` 是现成工具,论文引用了 "provision does not imply use" 却没用上自己的 auditor。这是相对 SkillsBench 最便宜的差异化。

**怎么做**:对所有已有 with-skill trial 目录(`jobs/` 下)批量跑 auditor,产出:每模型激活率(supplied→opened→references accessed 漏斗)、激活与否 × per-task delta 的相关表。写进 §6 或 §7 新小节。

**验收**:字节确定性输出归档;论文有一小节 + 一张表。

## T7 失败分类 / over-trust 量化(P1,纯人工)

**为什么**:§7.4 和摘要的 "[N] over-trust regressions" 目前是空头支票。

**怎么做**:收集所有 with-skill 条件下 reward < 1 的 trial,按 §7.4 的四类(over-trust / misapplication / procedure-drift / environment-slip)人工分类;现成案例线索:Terra H5(−0.80)、Flash S5/S7/H9 回归、Luna H7(−0.10)。

**产出物**:分类表 + 每类 1 个代表性案例(写进 Table 5 和正文)。

## T8 H6 地板任务诊断(P1)

**为什么**:H6-remote-error-trap 在所有模型所有条件下都是 0 或 0.25,可能是任务本身标定有问题,也可能是真难——两种情况论文写法完全不同。

**怎么做**:人工走一遍 H6,确认 oracle 1.0 仍然成立、judge 的 checkpoint 是否过严、instruction 是否缺失关键信息;要么修任务(修完跑 oracle + 一次 agent 校准),要么在论文里作为 "nobody passes" 的难度锚点明确解释。

## T9 冻结扩大版 snapshot(P1)

**为什么**:23 任务偏小(Limitations 已认);living benchmark 已 52 个。把更多已稳定任务冻结进新 snapshot,边际成本低于造新任务。

**怎么做**:从 52 个里筛掉有已知问题/依赖特殊环境的,形成 ~40+ 列表 → 按 `benchmark/snapshots/README.md` 流程建新 snapshot → 后续 T3/T4 的新跑直接挂新 snapshot,避免重复花钱。**T9 应尽早做,让 T3/T4 一次跑够。**

## T10 训练 cutoff vs 版本日期表(P2,纯人工)

**为什么**:论文核心前提 "target postdates any model's training data" 需要 per-model 证据表:每个被测模型的知识截止日 vs dsh v0.1.1→v0.1.2-alpha.x 各版本发布日期。一张表,附录用。

## T11 Grader 信度抽查(P2,纯人工)

**为什么**:全自动 judge 是卖点也是靶子。抽 ~30 条不同分数段的 trial 轨迹,人工独立打分后与 judge 分数算一致率,写一小节(或附录)。

## T12 论文数字口径统一(P0,文字工作)

摘要说 24 任务、§4.2 说 8S/5M/11H(=24)、snapshot 是 23。投稿前定死一个数并全文一致(generated metadata 已经是 23,改文字即可,别反着改)。

---

## 建议执行顺序

1. **本周**:T12(半小时)、T5 启动、T9 决策(决定 T3/T4 跑哪个 snapshot)、T1a
2. **下周起并行**:T1b(最便宜,先跑)、T6(零成本)、T2 的 holdout split 表
3. **预算到位后**:T3、T4(挂 T9 的新 snapshot)
4. **分析阶段**:T7、T8、T10、T11
5. 全部数字齐了 → 填论文 `[N]`/`[X]` 占位符 → 补 Figure 1–3、Table 1–5
