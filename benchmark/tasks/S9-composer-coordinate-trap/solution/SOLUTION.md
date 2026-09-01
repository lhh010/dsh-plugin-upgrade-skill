# S9 参考解法

## 考点（一句话）

**一个契约误读、两个症状**：插件把 clipboard 投影坐标（`InputState.draft` 长度、
`Occurrence.offset/length`，chip = 完整 clipboardText）直接喂给以 detect 投影工作的
输入机动词（`insertReference` 插入点、`consumeToken` 删除 span；chip 在 detect 文本中只占
1 个 U+FFFC）——空输入框时两套坐标重合所以第一次成功，之后插入点越界被拒 →
"The DSH composer changed…"；删除同样静默失败但 record 已删 → dock 显示 unavailable、
chip 残留。正确处置 = 在两个调用点按「前面每个 chip 折减 length−1」换算坐标 +
仅在动词报告成功后才清理簿记 + 连续交互与全视图清除的回归测试。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：两套投影被点名（clipboard vs detect/U+FFFC）、
「首次成功后续失败」签名机制（空时重合/插入点越界）、unavailable 归因（动词静默失败 +
提前删 record）、换算规则与两个调用点、回归计划（连续两次粘贴共存 + 删除清除全部视图）。

## fixture 出处

裁剪自 2026-09-01 真实排障会话（dsh-paste-input v0.1.10 修复的双投影坐标 bug，
作者本人维护的社区插件）；host 摘录引自 DSH ui-conversation 输入门面/契约源码。
配套方法论 skill：`skills/plugin-runtime-debug/`（刻意不含本答案）。
