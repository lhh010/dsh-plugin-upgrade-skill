# H23-storage-domain-version-compat-trap reference solution

See [solution/src/domain-spec.mjs](src/domain-spec.mjs) — the alpha.5
migration declares `compatibleVersions: [4]` next to the unchanged
`version: 5`. Expected judge score 100.

## The change

`dsh-v0.1.2-alpha.5` adds `DomainSpec.compatibleVersions` (DSH-0.1.2-A5-01).
On a `per-record` layout, a stored document whose version stamp is not the
unit's current version reads as ABSENT — the silent-discard contract is
unchanged from alpha.4. Declaring the old version makes the json per-record
backend accept documents stamped with it; writes always stamp the current
version; stamps outside the set stay foreign; `single`-layout reads stay
exact-version; and the declaration itself is validated
(non-negative integers strictly below `version`).

The fixture's trap: the plugin owner bumps the domain to `version: 5`
(schema adds only the optional `pinned` field — every v4 record parses), so
install/typecheck/boot/domain-open are all green while the v4 records read
as absent. Boot green ≠ data migration correct.

Correct migration (one semantic change):

```js
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  compatibleVersions: [4],
  tables: { summaries: domainTable(summarySchema) },
})
```

- `version: 5` stays (no downgrade);
- the schema stays honest (`pinned` optional, no `z.any()`);
- records stamped 4 load as current and re-stamp 5 on the first write;
- the unlisted stamp-3 artifact stays foreign — compatibility is a
  declaration the owner vouches for, not a blanket amnesty;
- `invalidRecords: 'backup-and-skip'` (A5-02) is a DIFFERENT axis
  (schema-invalid salvage) and deliberately not required here.

## First-party provenance

- Repository: `deepseek-ai/deepseek-harness`
- `dsh-v0.1.2-alpha.4` = `4e84901e6471b79ec0338099867ebb4606d12bb5`
- `dsh-v0.1.2-alpha.5` = `db6bdc3576c2d4e7c965e8e3ed0c2a731eed87f5`
- `packages/storage/storage-domain/src/spec.ts` (`compatibleVersions`
  declaration + `defineDomain` validation)
- `packages/storage/storage/src/backend.ts` (`KvUnitDescriptor.compatibleVersions`)
- `packages/storage/storage-json/src/per-record-unit.ts` (accepted-stamp
  reads, re-stamp-on-write contract)
- `packages/storage/storage-json/src/format.ts` (document format + legacy
  bootstrap version gate)
- Migration card: `DSH-0.1.2-A5-01` (`skills/plugin-upgrade/references/v0.1.2-alpha.5.md`)
- Published runtime the fixture pins: `@deepseek-ai/dsh-storage`,
  `@deepseek-ai/dsh-storage-json`, `@deepseek-ai/dsh-storage-domain` at
  `0.1.2-alpha.5` (exact; lockfile integrity fixed), `@deepseek-ai/cordis`
  `4.0.2`, `zod` `4.4.3`.

Every API shape in this solution was verified against the published
packages before the task shipped (see the judge's behavioral checks).

## Scoring

65 behavioral (real alpha.5 runtime: complete v4 records preserved 25 / v5
record intact 10 / unlisted v3 foreign 10 / read-modify-write preserves
fields and re-stamps 5 10 / reopen retains complete records 10) + 25 migration
(evaluated declaration [4] 15, version stays 5 5, schema behavior probes 5)
+ 10 hygiene (all required runtime dependencies keep their exact pins).
Hard caps: invalid declaration → 30; version downgrade → 20;
alpha.4 pin or missing/changed required runtime dependency → 20;
backup-and-skip instead of compatibility → 50; schema
bypass (including aliased/imported `any` or `unknown`) → 70. Flat 0: untouched fixture, sealed files modified, or baseline
missing/rewritten. Integrity checks also run after candidate import, initial
reads, and final schema probes; only the judge's own A write is allowed.
Full model in [tests/judge.mjs](../tests/judge.mjs).
