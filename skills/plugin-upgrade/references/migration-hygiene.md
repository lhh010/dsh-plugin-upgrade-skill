# 迁移卫生 · 与版本无关的工具链坑

> 取自 6 个真实插件批量迁移（rc.1 → 0.1.2-alpha.1，见 [example 06](../examples/06-real-world-batch-migration.md)）的一手记录。这些坑不属于任何版本卡——它们在任何走廊段都可能吃掉迁移者半小时以上。

## 1. 增量 tsbuildinfo 假阳性

症状：改完源码后 typecheck 报与本次改动无关的老错误（如 `MISSING_EXPORT resolveSessionPreset`），或增量检查直接骗过、clean 后才暴露真实错误链。

解法：迁移验证前一律 `pnpm run clean` 再 build。看到可疑 TS2305/TS2305 类导出缺失，先 clean 排除缓存，再 grep 真实引用（见 [A1-21 实战批注](v0.1.2-alpha.1.md)）。

## 2. oxc / vite 解析器比 tsc 严格

症状：tsc 通过，构建期报「Did you mean {'>'}」类解析错误。已知触发：未闭合的 JSX 标签、跨行三元表达式里带箭头函数。

解法：按解析器提示重写该表达式——预计算变量、拆语句。不要绕，也不要以 tsc 通过为准。

## 3. client 硬刷新 vs host 重启的生效平面

症状：改完代码浏览器刷新无变化，或 host 行为像旧版。

规则：改动落进 `lib/client.js`（client 半段）→ 浏览器硬刷新即生效；落进 `lib/index.js`（host 半段）→ 必须重启 dsh。与 [host-plane-probes.md](host-plane-probes.md) 的平面视角对应：先判断插件形态与改动落点，再决定验证动作。

## 4. pnpm 11 拦截依赖构建脚本

症状：新环境安装插件报 node-pty 等构建被拒。

解法：在 profile 目录执行 `pnpm approve-builds --all`。建议插件 README 直接写明这一步。

## 5. 测试代码的 readonly 与 as-in-JSX

症状：迁移后测试文件编译失败，但源码 typecheck 干净。

已知触发：fiber 上 `dispose` 等字段变 readonly（测试不能再赋值模拟，改间接观察）；测试文件里 `as` 断言在 JSX 解析路径上不支持（改变量预收窄）。

## 验证纪律

每个迁移改动跑完整链：`pnpm run clean && pnpm run build && pnpm run typecheck && pnpm run test`，然后实机 boot（`dsh --profile web` + 硬刷新；host 半段有改动则重启）。只跑增量检查的结论不可信，见第 1 条。
