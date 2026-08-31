# H4 诊断报告（参考答案）

## 报错来源

`MISSING_EXPORT resolveSessionPreset` 出现在**构建期**（rolldown/oxc 读构建图），
而 `tsc --noEmit` 通过——两者矛盾指向构建缓存假阳性。核对 fixture：

- `lib/index.js`：0.1.1-rc.2 时代的陈旧产物，仍 `import { resolveSessionPreset }`；
- `lib/tsconfig.tsbuildinfo`：增量构建状态，referencedMap 仍把
  `resolveSessionPreset` 挂在旧依赖图上；
- `src/`：全仓搜索零命中，源码对 `resolveSessionPreset` 没有任何引用。

结论：报错源自陈旧构建产物与增量缓存，不是源码真实依赖
（DSH-0.1.2-A1-21 的删除确实发生，但本插件从未调用它）。

## 源码该不该改

**无需改动。** DSH-0.1.2-A1-21 的迁移配方只适用于真实调用方；对零引用的代码
套配方是无的放矢。

## 处置步骤

1. `pnpm run clean`（删除 `lib/` 与增量缓存）；
2. 重新 `pnpm run build` —— 构建图从当前源码重建，报错消失；
3. 验证纪律：此后每次迁移验证前都先 clean，再 typecheck/build/test
   （增量检查的结论不可信，见 migration-hygiene §1）。
