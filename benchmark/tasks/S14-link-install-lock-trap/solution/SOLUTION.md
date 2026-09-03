# S14 参考解法

## 考点（一句话）

link/junction 安装的插件，**仓库工作树就是 profile 的安装副本**：改完仓库无需任何
"同步复制"；两把锁分别是**运行中的 dsh 宿主进程**（持有 lib 文件句柄 → EBUSY，与浏览器
无关）与**浏览器缓存的 client bundle**（硬刷新解决）；rename-aside 在 junction 下等于把
唯一一份真身改名（两个路径是同一目录），正确恢复是把 .old2 改回原名。

## 参考报告

见 [report.md](report.md)，期望 judge 得分 100。

## 判分要点

只读门禁 + 五要点各 20：junction 语义（无需复制/复制有害）、两把锁归因（宿主进程 +
浏览器缓存，关浏览器不解锁）、rename-aside 灾难机理与恢复（同目录、改回原名 + 语法检查）、
正确激活顺序（完全停宿主 → 重启 → 硬刷新 → 验证加载）、装前判别安装模式
（LinkType/Target、patch.yml 安装标记）。

## fixture 出处

真实 2026-09-03 dsh-paste-input v0.1.17 悬停预览功能验证会话（junction 安装 + EBUSY +
rename-aside 事故），插件名与路径已改写。
