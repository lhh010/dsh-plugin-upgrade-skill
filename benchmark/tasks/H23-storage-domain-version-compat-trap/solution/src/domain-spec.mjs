// migration_summaries domain declaration — migrated to dsh 0.1.2-alpha.5.
// The version bump to 5 is a schema-compatible extension (the optional
// `pinned` field), so the previous release's version-4 records are
// vouched-for compatible: they load as current and re-stamp on write.
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
  compatibleVersions: [4],
  tables: {
    summaries: domainTable(summarySchema),
  },
})
