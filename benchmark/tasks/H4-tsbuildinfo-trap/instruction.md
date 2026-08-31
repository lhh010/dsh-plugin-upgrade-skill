# H4 · 构建缓存假阳性陷阱（只读）

我按走廊卡把一个 DSH 插件从 0.1.1-rc.2 迁到了 0.1.2-alpha.2，源码都改完了，
`tsc --noEmit` 也过了。但一跑构建就报：

```
Error: MISSING_EXPORT: "resolveSessionPreset" is not exported by
node_modules/@deepseek-ai/dsh-agent-presets/src/index.ts
```

我在源码里怎么搜都找不到 `resolveSessionPreset`。同事说"肯定是 DSH-0.1.2-A1-21
那个删除没迁干净，照它的迁移配方再改改源码就好了"。

请你诊断（工作目录：`/app/fixture/`）：

1. 这个报错到底从哪来（指出真实来源，别猜）；
2. 源码该不该改？给出结论和依据；
3. 处置步骤写成报告，放 `/app/agent-output/H4-tsbuildinfo-trap/` 下
   （.md/.txt/.json 均可）。

fixture 里的构建产物（`lib/`）你可以随便清理论证；`src/` 是只读的，被改动直接 0 分。
