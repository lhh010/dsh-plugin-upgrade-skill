# H4 参考解法

## 考点（一句话）

构建缓存假阳性：`MISSING_EXPORT resolveSessionPreset` 来自陈旧构建产物
（`lib/index.js` 仍 import 该已删导出、`lib/tsconfig.tsbuildinfo` 的
referencedMap 仍指向旧依赖图），源码零引用——处置是 clean 后重建，
**不是**照 DSH-0.1.2-A1-21 的迁移配方去改源码（那是给真实引用者的配方）。
（参考答案措辞刻意避开陷阱字面量——若照其配方去"修"，判分器的陷阱正则将封顶 30。）

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 陷阱设计

题面里同事的建议（"照 A1-21 配方再改改源码"）是误导：A1-21 配方只适用于真的
调用了 `resolveSessionPreset` 的代码；本 fixture 的 src 已迁移干净。判分把
"报告出现配方式修改"封顶 30——但仅当报告**未得出"源码无需改动"正确结论**时才触发；
引用卡片原文（含 `presets/` 等字面量）而正确结论在，不误伤。
