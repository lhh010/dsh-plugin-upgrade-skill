/**
 * Demo host plugin, already migrated to 0.1.2-alpha.2 conventions.
 * Reads the model catalogue through the owning domain service.
 */
import type { Context } from '@deepseek-ai/cordis'

export const name = '@demo/dsh-bench-catalog'

export const inject = ['llm']

export function apply(ctx: Context): void {
  ctx.effect(() => {
    const dispose = ctx.llm.listProviders()
    ctx.logger.info(`catalog: ${String(dispose.length)} providers`)
    return () => { /* effect cleanup */ }
  }, 'bench-catalog: list')
}
