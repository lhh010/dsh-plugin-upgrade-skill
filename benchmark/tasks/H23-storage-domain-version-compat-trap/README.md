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
  alpha.5 packages (v4/v5 records preserved in full, unlisted v3
  foreign, read-modify-write preserves fields and re-stamps 5, close+reopen retains full records) + 25 migration (runtime
  `compatibleVersions === [4]`, version stays 5, schema preserves valid records and rejects invalid fields) + 10 hygiene.
  Hard caps: invalid declaration → 30; version downgrade → 20; alpha.4 pin
  → 20; backup-and-skip instead of compatibility → 50; schema bypass → 70.
  Flat 0: fixture untouched, persisted data / tests / node_modules modified,
  or the baseline rewritten.
- **Oracle**: `harbor run -p benchmark/tasks/H23-storage-domain-version-compat-trap -a oracle`, expected reward 1.0.

```
environment/fixture/   # alpha.4 domain spec + reader app + preloaded records + pinned closure (test material only)
tests/                 # judge.mjs + judge-utils.mjs + unit/runtime regression tests + test.sh
solution/              # alpha.5 migration + solve.sh
```

Distinct from H20 (Session.events ledger migration), H5 (runtime export
drift), and M-tasks: this failure mode — boot-green / open-green with
historical compatible records silently disappearing at a version-stamp
boundary — was previously uncovered.

## Grader regression checks

Run `npm run test:h23-judge` from the repository root. It installs the exact
fixture lockfile (installation scripts disabled), then runs helper and full
judge tests against the real alpha.5 packages in disposable git baselines.
The same command runs in `npm test` and the Node 22/24 CI matrix.

Constants, expressions, and spread arrays evaluating to `[4]` earn the same
100 as the oracle. Schema probes inspect the actual table schema, including
aliased or imported `any`/`unknown` fields; they must preserve valid records
and reject missing or wrongly typed fields. Full-record comparisons also
cover initial reads, read-modify-write, and close/reopen.

Current regression controls: untouched/sealed edits 0; oracle and equivalent
declarations 100; downgrade/alpha.4 pin 20; invalid declarations 10;
comment-only and backup-and-skip without compatibility 40; direct, aliased,
or imported schema bypasses at most 70. A spec that fails to load earns no
schema-validation points. These local runtime tests do not replace a Harbor
container run.
