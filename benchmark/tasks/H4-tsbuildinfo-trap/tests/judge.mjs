// H4-tsbuildinfo-trap 判分：src 只读门禁 + 假阳性归因三要点 + 陷阱封顶。
// 考点（migration-hygiene §1 + DSH-0.1.2-A1-21 实战批注）：
//   - 报错来自陈旧构建产物/增量缓存（lib/index.js 与 lib/tsconfig.tsbuildinfo
//     里残留 resolveSessionPreset），不是源码真实引用；
//   - 正确处置 = pnpm run clean 后重建，源码零改动；
//   - 陷阱 = 照 DSH-0.1.2-A1-21 迁移配方去"修"不存在的引用（改源码即 0 分）。
import { emit, fixtureChanges, readAgentText } from './judge-utils.mjs'

const TASK = 'H4-tsbuildinfo-trap'
const TRAP = /resolveRecordedPreset|presets\//

main().catch((error) => emit(0, ['judge 异常: ' + error.message]))

async function main() {
  const reasons = []

  // 门禁：src 必须零改动（lib/ 允许清理）。
  const gate = await fixtureChanges('fixture/src')
  if (gate.changed === true) {
    emit(0, ['src 被改动，本题 0 分（陷阱命中：源码本就无需迁移）: ' + gate.detail])
  }
  if (gate.changed === null) reasons.push('警告: ' + gate.detail)
  else reasons.push('src 未被修改（门禁通过）')

  const { text, files } = readAgentText('', TASK)
  if (!text.trim()) {
    emit(0, [...reasons, '未在 /app/agent-output/' + TASK + '/ 找到报告，按 0 分处理'])
  }
  reasons.push('读取到 agent 报告: ' + files.join(', '))

  let score = 0
  const hasConclusion = /零引用|没有(任何)?(真实)?引用|并非(真实)?(引用|依赖)|不是真实|伪报错|无需(改动|修改|迁移)/.test(text)
  if (/tsbuildinfo|增量缓存|构建缓存|陈旧|stale|假阳性/i.test(text)) {
    score += 30; reasons.push('命中要点「识别构建缓存/产物假阳性」(+30)')
  } else { reasons.push('缺少要点「识别构建缓存/产物假阳性」(-30)') }
  if (/clean/i.test(text)) {
    score += 30; reasons.push('命中要点「clean 后重建的处置」(+30)')
  } else { reasons.push('缺少要点「clean 后重建的处置」(-30)') }
  if (hasConclusion) {
    score += 40; reasons.push('命中要点「源码无需改动的明确结论」(+40)')
  } else { reasons.push('缺少要点「源码无需改动的明确结论」(-40)') }

  // 陷阱封顶：只有未得出"源码无需改动"结论却照 DSH-0.1.2-A1-21 配方"修复"时才触发；
  // 引用卡片原文（含 presets/ 等字面量）但正确结论在，不误伤。
  if (TRAP.test(text) && !hasConclusion) {
    score = Math.min(score, 30)
    reasons.push('陷阱命中：报告按 DSH-0.1.2-A1-21 配方"修复"不存在的引用，封顶 30')
  }

  emit(score, reasons)
}