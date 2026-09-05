# migration_summaries domain — handover note

This plugin persists its own state through the dsh storage-domain API: one
`per-record` JSON domain named `migration_summaries`, served by the `json`
backend. `/app/fixture/data/` is the backend root with the users' persisted
records already in place.

## What the records look like

- Records written by the **previous release** (domain version 4):
  `{ "id": ..., "title": ... }`.
- Records written by the **current release** (domain version 5):
  `{ "id": ..., "title": ..., "pinned": ... }` — the only schema change is
  the new **optional** `pinned` field, so every version-4 record still
  parses under the version-5 schema.
- `D.json` is stamped with version 3 — an ancient artifact from before the
  previous release. It is **not** covered by any support promise and must
  keep reading as absent.

## The upgrade requirement

The product requirement for the alpha.4 → alpha.5 upgrade is explicit:

> Version-4 records must survive the upgrade unchanged. The version bump to
> 5 is a schema-compatible extension (optional field only); losing the
> users' history is a data-loss regression, not a migration.

The plugin owner already bumped the domain declaration to `version: 5` in
`src/domain-spec.mjs`. Something about the storage-domain version-stamp
semantics on alpha.5 is making the old records read as absent. The alpha.5
runtime is installed here as the exact published version — its published
sources and type declarations live under
`node_modules/@deepseek-ai/dsh-storage-domain/` (and the `dsh-storage` /
`dsh-storage-json` siblings); that is the first-party reference for the
alpha.5 storage surface.

If boot succeeds, the storage migration is complete.
