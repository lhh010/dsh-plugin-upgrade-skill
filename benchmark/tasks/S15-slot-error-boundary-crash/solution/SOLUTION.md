# S15 参考解法

## 考点（一句话）

悬空标识符 + 短路求值 + 槽位错误边界三重叠加：`disabled: A || busy` 中 `busy` 是别的
组件的 state（本作用域不存在），仅当 A 为 false（phase 为 plain，即正常输入态）才求值 →
ReferenceError；该表达式只在**有 chip 渲染**时执行（空 dock 提前 return null），所以带病
发布到某次用户真的贴了附件才爆炸；槽位级错误边界把整个条目卸载 → 症状是"dock 消失"而非
"删除按钮坏了"，且错误只在浏览器 console。修复 = 删除悬空引用；回归 = **带 occurrence
数据的渲染冒烟**（空态测不到这行）。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：根因（哪行抛、为何仅 chip 渲染时抛、`||` 短路为何潜伏、错误边界
整条目卸载 + console-only）、正确归因（不应先怪 v0.2.11 diff；rollback/最小渲染挂载二分，
区分"新功能炸槽"与"旧隐患首次被踩"）、修复 + 两种加固（防御性 `?? []`、`closest?.()`）、
带数据渲染冒烟回归、发布流程教训（`node --check` 不够，lib-only 槽位插件最少要有
data-present 渲染冒烟）。

## fixture 出处

真实 2026-09-03 dsh-paste-input v0.1.17 会话（AttachmentChips 悬空 `busy`，因悬停预览
发布首次触发），插件与组件名已改写。
