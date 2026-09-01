# S11 参考解法

## 考点（一句话）

**重依赖懒加载接入的三连坑归因**：① 分片 chunk 的同级导入按 chunk 自身 URL 相对解析、
哈希名分片未随包分发/路由 → 整链 import 失败（修：关掉代码分割打成单文件）；② 路由包含
判断用大小写敏感的 startsWith，Windows realpathSync 把盘符归一为小写而 LIB_DIR 保留大写
→ 合法路径被误判越界 403（Linux 一致大小写所以过；修：path.relative 语义判定）；③ 全屏
缩放 modal 与面板 Ctrl+滚轮监听同手势双触发（修：modal 打开时面板处理器让位 +
modal preventDefault/stopPropagation）。外加动态 import 的 JS MIME 要求与四项回归测试。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：分片相对解析/单文件打包、403 的 realpath 盘符大小写机制、
path.relative 修复 + MIME、modal 事件所有权、回归覆盖（回退/包含大小写用例/单文件断言/
modal 下字体处理器失效）。

## fixture 出处

裁剪自 2026-09-01 dsh-file-trace mermaid 集成的真实踩坑（v0.2.3 分片→单文件、
Windows 盘符 403、v0.2.4 modal 与 Ctrl+滚轮冲突）；配套方法论 skill：
`skills/plugin-heavy-dep/`（七点清单）。
