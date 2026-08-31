# H4-tsbuildinfo-trap · 构建缓存假阳性陷阱（只读）

agent 诊断一个"已完成迁移"插件在构建期报 `MISSING_EXPORT resolveSessionPreset`
但源码零引用的问题：需识别这是陈旧构建产物/增量缓存的假阳性（`lib/index.js`
仍 import 已删导出、`lib/tsconfig.tsbuildinfo` 挂旧依赖图），处置是 clean 后重建，
源码零改动。陷阱：照 DSH-0.1.2-A1-21 迁移配方去"修"不存在的引用（改 src 直接 0 分）。
题面见 [instruction.md](instruction.md)，判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **环境**：`node:24-bookworm` + git（fixture 以 git 基线提交支持只读门禁），不装 dsh（本题静态）。
- **Verifier**：judge 检查 src 零改动 + 报告识别假阳性/clean 处置/源码无需改动三要点，0-100 归一化写
  `/logs/verifier/reward.txt`。
- **Oracle**：`harbor run -p benchmark/tasks/H4-tsbuildinfo-trap -a oracle`，期望 reward 1.0。

```
environment/fixture/   # 已迁移干净的插件 + 遗留 0.1.1 构建产物
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # 参考报告 + solve.sh
```
