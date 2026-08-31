# S3-snapshot-migration · 快照读取面迁移评估（只读）

agent 只读评估 `/app/fixture/` 里 0.1.1-rc.1 时代的浏览器宠物插件，把快照读取面
（平铺 `ConversationSnapshot` → views/legacy 投影、`useSession` 生命周期座、
`@deepseek-ai/cordis` 类型导入替换、`slots.inject` 注册）映射到
DSH-0.1.2-A1-03，报告写到 `/app/agent-output/S3-snapshot-migration/`。
题面见 [instruction.md](instruction.md)，判分逻辑见 [tests/judge.mjs](tests/judge.mjs)。

- **环境**：`node:24-bookworm` + git（fixture 以 git 基线提交支持只读门禁），不装 dsh（本题静态）。
- **Verifier**：judge 检查 fixture 零改动 + 报告命中五要点各 20 分，0-100 归一化写
  `/logs/verifier/reward.txt`。
- **Oracle**：`harbor run -p benchmark/tasks/S3-snapshot-migration -a oracle`，期望 reward 1.0。

```
environment/fixture/   # 0.1.1 快照面浏览器插件（裁剪自真实迁移前代码）
tests/                 # judge.mjs + judge-utils.mjs + test.sh
solution/              # 参考报告 + solve.sh
```
