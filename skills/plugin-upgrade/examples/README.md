# 典型迁移示例

本目录包含常见插件类型从 0.1.1 升级到 0.1.2 的完整示例。

## 示例列表

| 示例 | 场景 | 复杂度 |
|---|---|---|
| [01-simple-client-plugin.md](01-simple-client-plugin.md) | 纯客户端 UI 插件（仅 SDK 包迁移） | ⭐ |
| [02-host-side-plugin.md](02-host-side-plugin.md) | 宿主侧插件（Gateway 调用迁移） | ⭐⭐ |
| `03-dual-cohort-plugin.md`（待补充） | 跨 cohort 兼容插件（双版本支持） | ⭐⭐⭐ |
| `04-preview-cohort-upgrade.md`（待补充） | 未发布 preview cohort 升级（完整流程） | ⭐⭐⭐⭐ |
| `05-third-party-plugin-patch.md`（待补充） | 第三方预构建插件 pnpm patch | ⭐⭐⭐ |
| [06-real-world-batch-migration.md](06-real-world-batch-migration.md)（[EN](06-real-world-batch-migration.en.md)） | 真实批量迁移实录（6 个插件，三种形态，含踩坑清单） | ⭐⭐⭐ |

## 如何使用

1. 根据你的插件类型选择最接近的示例
2. 对照示例中的"升级前"和"升级后"代码
3. 参考"验证"章节确认迁移成功
4. 如遇问题，查看"常见错误"部分

## 贡献新示例

欢迎补充更多典型场景！提交 PR 时请：
1. 遵循现有示例的格式（场景 → 升级前 → 升级后 → 验证 → 常见错误）
2. 提供可运行的完整代码片段
3. 说明适用的触点类型（参考 pre-flight.md）
