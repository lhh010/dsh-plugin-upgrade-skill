# S8 参考解法

## 考点（一句话）

发布工程双陷阱的归因：**tag 分发缺失**（文档引用的 tag 从未被同步到镜像 → "Could not resolve"）
与**版本路由缺失**（面向 alpha.x 构建的插件装上 rc.x 运行时 → `useConversation is not a function` 崩溃）；
正确处置 = 维护者先把缺失的 v0.9.3 tag 同步到镜像、消费者再装 rc 兼容旧版（v0.9.3）
+ 维护者补 tag 同步与 README 版本路由。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：v0.9.5 缺失归因（attempt-1）、useConversation 前向不兼容（attempt-2）、
方向识别（alpha.x 构建 vs rc.x 运行时）、rc 兼容版本 v0.9.3、维护者 tag 同步修复。

## fixture 出处

裁剪自 2026-08-31 真实事故（作者本人 6 插件仓库的镜像 tag 缺失 + 版本路由缺失，
与 profile-dependency-management.md §8/§9 同源）。
