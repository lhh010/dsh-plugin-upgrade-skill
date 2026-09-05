// migration_summaries domain declaration.
// Written against dsh 0.1.2-alpha.4, where the domain was at version 4.
//
// Alpha.5 upgrade note: the version was bumped to 5 because the record
// schema adds the optional `pinned` field. Domain version bumps
// intentionally invalidate all old records. Do not carry forward stale
// cache entries.
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { z } from 'zod'

export const summarySchema = z.object({
  id: z.string(),
  title: z.string(),
  pinned: z.boolean().optional(),
})

export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  tables: {
    summaries: domainTable(summarySchema),
  },
})
