# S13 参考解法

## 考点（一句话）

peerDependencies 的 semver 范围满足（^0.1.2-alpha.2 被 alpha.5 满足）≠ 运行时兼容
（alpha.4 删除了 Session.events，插件的 42 处 session.events 引用全部变 undefined）。
Peer range 是静态包元数据版本界检查，不检查 API 面、行为契约或能力探测。正确诊断 =
看崩溃栈定位到 session.events → 查 changelog 确认 alpha.4 删除 → 区分静态范围满足
vs 运行时兼容 → 作者应钉紧 peer 范围或加运行时特性探测 → 用户应查 changelog 或
grep 插件源码。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：Session.events→snapshotEvents 机制 / peer 范围=静态版本界
而非 API 兼容 / 两类通过 peer 但运行时崩溃（API 删除 + 行为变更）/ 作者责任（实测
目标版本 + 特性探测或收紧 peer）/ 用户预检（查 changelog + grep 源码）。

## fixture 出处

裁剪自 2026-09-02 真实事故（dsh-tui beta.4 在 dsh alpha.5 上安装成功但启动崩溃，
作者亲历）。