# S3 迁移评估报告（参考答案）

## 会坏的面与迁移写法

1. **类型导入（src/client/index.ts:6, Pet.tsx:8）**：`@deepseek-ai/dsh-client-runtime/client`
   包在 alpha 已移除。`ClientContext`/`ConversationSnapshot` 类型改从
   `@deepseek-ai/cordis` 导入；`package.json` `client.inject` 里的
   `dsh-client-runtime` 声明同步删除（残留会启动报服务缺失）。
2. **平铺快照读取（Pet.tsx isThinking / toolRunning / lastTurnEnd）**：
   `partial`、`runningCalls`、`turnEnds` 等平铺字段移入
   `views.get('chat')?.legacy` 兼容投影。第一步先全量走 legacy 投影
   （两步走），字段语义不变；`turnEnds` 的时间线语义后续迁 `timeline`。
3. **生命周期字段（Pet.tsx running）**：`running` 不在 legacy 投影内，
   必须经 `useSession` 座读取（会话生命周期拆分到 SessionSnapshot）。
4. **slot 注册（index.ts apply 尾部）**：`ctx.slots.register` 改为
   `ctx.slots.inject(name, () => ctx.slots.register(...))`；
   `ctx.slots` 类型需引入 `@deepseek-ai/dsh-client-ui-renderer/client`。

## 对应卡片

- DSH-0.1.2-A1-03（会话视图工程大幅拆分）：以上 2/3/4 全部出自该卡。

## 两步走结论

可先走兼容投影跑起来的：partial / runningCalls / turnEnds（legacy 投影全量可读）。
必须立即换路径的：running（useSession 座）、类型导入与 inject 声明（否则不激活）。
