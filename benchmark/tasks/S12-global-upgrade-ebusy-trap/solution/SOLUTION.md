# S12 参考解法

## 考点（一句话）

全局升级 dsh 的两个操作陷阱：① EBUSY——运行中的 dsh 宿主进程加载了原生模块
koffi.node，OS 级文件锁持续到进程退出，刷新浏览器页面不释放（只有完全停止宿主进程
才行）；② 降级陷阱——`npm install -g @deepseek-ai/dsh` 不带版本号会解析到 `latest`
dist-tag（= rc.2），而不是当前安装的 alpha 版或最新 alpha 版，把已钉好的 alpha.4
静默降级。正确姿势 = 完全停止 dsh → 钉版本安装 → 重启。预防 = README 安装命令必须
钉版本。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：koffi 原生模块锁 / 必须完全停止进程（不是刷新页面）/ npm
latest dist-tag 降级 / 钉版本安装 / README 预防。

## fixture 出处

裁剪自 2026-09-02 真实升级事故（dsh alpha.4→alpha.5 升级时 EBUSY + dsh-tui 安装时
降级，作者亲历）。