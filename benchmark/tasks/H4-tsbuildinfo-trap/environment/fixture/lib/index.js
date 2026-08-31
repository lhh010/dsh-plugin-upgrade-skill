// Stale build artifact from the 0.1.1-rc.2 era (do not run; benchmark fixture).
import { resolveSessionPreset } from '@deepseek-ai/dsh-agent-presets'
export function apply(ctx) {
  const preset = resolveSessionPreset(ctx.session)
  ctx.logger.info(`preset: ${String(preset)}`)
}
