#!/bin/bash
# Oracle 解法：把参考报告写到 agent 输出目录（不碰 fixture/src，满足只读纪律）。
set -e
mkdir -p /app/agent-output/H4-tsbuildinfo-trap
cp "$(dirname "$0")/report.md" /app/agent-output/H4-tsbuildinfo-trap/report.md
