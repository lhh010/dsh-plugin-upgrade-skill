# H23-storage-domain-version-compat-trap · Storage-Domain Version Compatibility

The agent repairs a plugin-owned `per-record` storage domain after the
alpha.4 → alpha.5 upgrade: the domain version was bumped to 5 (schema adds
only an optional field) but the version-4 persisted records silently read as
absent while boot, domain open, and new writes all stay green. Tests
"version-stamp compatibility, not schema migration": the old records must
reappear through the runtime's own admission contract
(DSH-0.1.2-A5-01 `compatibleVersions`), the version bump must survive, and
the unlisted ancient stamp must stay foreign.

- **Environment**: `node:24-bookworm` + git; `/app/fixture` ships the alpha.4
  domain declaration, a real-runtime reader app, the preloaded persisted
  records (stamps 4/4/5/3), and the exact pinned alpha.5 storage closure
  (`@deepseek-ai/dsh-storage*@0.1.2-alpha.5`, `@deepseek-ai/cordis@4.0.2`,
  `zod@4.4.3`; committed lockfile, `npm ci` at build time; the agent phase
  needs no network). The fixture, data, and `node_modules` are committed as
  a git baseline — the judge seals everything except `fixture/src/**` and
  `fixture/package.json` (dependency edits are scanned, not trusted).
- **Verifier**: deterministic. 65 behavioral against the real published
  alpha.5 packages (v4 records visible, v5 record intact, unlisted v3
  foreign, write re-stamps 5, close+reopen retains) + 25 migration (runtime
  `compatibleVersions === [4]`, version stays 5, no `z.any()`) + 10 hygiene.
  Hard caps: invalid declaration → 30; version downgrade → 20; alpha.4 pin
  → 20; backup-and-skip instead of compatibility → 50; `z.any()` → 70.
  Flat 0: fixture untouched, persisted data / tests / node_modules modified,
  or the baseline rewritten.
- **Oracle**: `harbor run -p benchmark/tasks/H23-storage-domain-version-compat-trap -a oracle`, expected reward 1.0.

```
environment/fixture/   # alpha.4 domain spec + reader app + preloaded records + pinned closure (test material only)
tests/                 # judge.mjs + judge-utils.mjs + judge-utils.test.mjs + test.sh
solution/              # alpha.5 migration + solve.sh
```

Distinct from H20 (Session.events ledger migration), H5 (runtime export
drift), and M-tasks: this failure mode — boot-green / open-green with
historical compatible records silently disappearing at a version-stamp
boundary — was previously uncovered.
