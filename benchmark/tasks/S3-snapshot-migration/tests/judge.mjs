// S3-snapshot-migration 判分：fixture 只读门禁 + 快照读取面五要点。
// 期望（对应 DSH-0.1.2-A1-03 会话视图工程大幅拆分）：
//   1. 平铺快照字段 → views.get('chat')?.legacy 兼容投影（两步走第一步）
//   2. 生命周期字段（running）→ useSession 座
//   3. ClientContext 类型导入 → @deepseek-ai/cordis（dsh-client-runtime 已移除）
//   4. slot 注册 → ctx.slots.inject(name, () => ctx.slots.register(...))
//   5. 报告引用完整卡片 DSH-0.1.2-A1-03
import { emit, fixtureChanges, readAgentText } from './judge-utils.mjs'

const TASK = 'S3-snapshot-migration'

const ASPECTS = [
  { key: 'legacy 投影', pattern: /views[.]get|[.]legacy|兼容投影/, points: 20 },
  { key: 'useSession 生命周期座', pattern: /useSession/, points: 20 },
  { key: 'cordis 类型导入替换', pattern: /@deepseek-ai\/cordis/, points: 20 },
  { key: 'slots.inject 注册', pattern: /slots[.]inject/, points: 20 },
  { key: '卡片 DSH-0.1.2-A1-03', pattern: /A1-03/, points: 20 },
]

main().catch((error) => emit(0, ['judge 异常: ' + error.message]))

async function main() {
  const reasons = []

  const gate = await fixtureChanges('fixture')
  if (gate.changed === true) {
    emit(0, ['fixture 被改动，本题 0 分（只读纪律）: ' + gate.detail])
  }
  if (gate.changed === null) reasons.push('警告: ' + gate.detail)
  else reasons.push('fixture 未被修改（只读纪律通过）')

  const { text, files } = readAgentText('', TASK)
  if (!text.trim()) {
    emit(0, [...reasons, '未在 /app/agent-output/' + TASK + '/ 找到报告，按 0 分处理'])
  }
  reasons.push('读取到 agent 报告: ' + files.join(', '))

  let score = 0
  for (const aspect of ASPECTS) {
    if (aspect.pattern.test(text)) {
      score += aspect.points
      reasons.push('命中要点「' + aspect.key + '」(+' + aspect.points + ')')
    } else {
      reasons.push('缺少要点「' + aspect.key + '」(-' + aspect.points + ')')
    }
  }

  emit(score, reasons)
}
