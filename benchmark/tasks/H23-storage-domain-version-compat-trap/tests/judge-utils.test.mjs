// Unit tests for the H23 judge helpers. Behavioral inputs are the values the
// real alpha.5 runtime produced for each control during calibration (the
// judge.mjs behavioral checks run those same five checks against the real
// packages); the source-level trap detection and caps are tested here.
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  assembleScore, capFor, compatEntriesInvalid, scanPackageJson, scanSpecSource, scoreHygiene, scoreMigration, stripComments,
} from './judge-utils.mjs'

const ORACLE_SOURCE = `
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  compatibleVersions: [4],
  tables: { summaries: domainTable(schema) },
})
`

const ORACLE_SPEC = { version: 5, compatibleVersions: [4] }

const UNTOUCHED_SOURCE = `
// Domain version bumps intentionally invalidate all old records.
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  tables: { summaries: domainTable(schema) },
})
`
const UNTOUCHED_SPEC = { version: 5 }

const DOWNGRADE_SOURCE = `
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 4,
  layout: 'per-record',
  tables: { summaries: domainTable(schema) },
})
`
const DOWNGRADE_SPEC = { version: 4 }

const BACKUP_SOURCE = `
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  invalidRecords: 'backup-and-skip',
  tables: { summaries: domainTable(schema) },
})
`
const BACKUP_SPEC = { version: 5, invalidRecords: 'backup-and-skip' }

const INVALID_COMPAT_SOURCE = `
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  compatibleVersions: [5],
  tables: { summaries: domainTable(schema) },
})
`

const ZANY_SOURCE = `
import { z } from 'zod'
export const schema = z.object({ id: z.any(), title: z.any() })
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  compatibleVersions: [4],
  tables: { summaries: domainTable(schema) },
})
`
const ZANY_SPEC = { version: 5, compatibleVersions: [4] }

const KEYWORD_COMMENT_SOURCE = `
// compatibleVersions is how alpha.5 admits older stamps.
export const spec = defineDomain({
  name: 'migration_summaries',
  version: 5,
  layout: 'per-record',
  tables: { summaries: domainTable(schema) },
})
`
const KEYWORD_SPEC = { version: 5 }

const PINNED_PACKAGE = JSON.stringify({ dependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.4' } })
const CLEAN_PACKAGE = JSON.stringify({ dependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.5' } })

// Calibrated behavioral totals measured with the real judge against the
// real alpha.5 runtime in-container: oracle 65, untouched 30, downgrade 35,
// backup-and-skip 30, z.any 55, keyword-comment 30, invalid-compat 0
// (spec fails to load). For untouched-style specs the reopen check fails
// too: the re-stamped A becomes visible while B stays stamp-4 and absent.
const BEHAVIORAL = {
  oracle: 65,
  untouched: 30,
  downgrade: 35,
  backup: 30,
  zany: 55,
  keyword: 30,
  invalid: 0,
}

function run(spec, source, packageJson = CLEAN_PACKAGE, behavioral) {
  return assembleScore({ behavioral, spec, specSource: source, packageJson }).score
}

test('stripComments removes line and block comments but keeps strings', () => {
  const out = stripComments('const a = "http://x" // line\n/* block */ const b = 1')
  assert.ok(!out.includes('line'))
  assert.ok(!out.includes('block'))
  assert.ok(out.includes('"http://x"'))
})

test('scanSpecSource detects declaration, entries, version, z.any, backup-and-skip', () => {
  const oracle = scanSpecSource(ORACLE_SOURCE)
  assert.equal(oracle.compatDeclared, true)
  assert.deepEqual(oracle.compatEntries, [4])
  assert.equal(oracle.versionDeclared, 5)
  assert.equal(oracle.hasZAny, false)
  assert.equal(oracle.hasBackupAndSkip, false)
  const backup = scanSpecSource(BACKUP_SOURCE)
  assert.equal(backup.compatDeclared, false)
  assert.equal(backup.hasBackupAndSkip, true)
  assert.equal(scanSpecSource(ZANY_SOURCE).hasZAny, true)
  assert.equal(scanSpecSource(KEYWORD_COMMENT_SOURCE).compatDeclared, false, 'a comment mention is not a declaration')
  assert.deepEqual(scanSpecSource(INVALID_COMPAT_SOURCE).compatEntries, [5])
})

test('scanPackageJson detects the alpha.4 pin in dependency values only', () => {
  assert.equal(scanPackageJson(PINNED_PACKAGE).pinsAlpha4, true)
  assert.equal(scanPackageJson(CLEAN_PACKAGE).pinsAlpha4, false)
  const prose = JSON.stringify({ description: 'migrated from 0.1.2-alpha.4 to 0.1.2-alpha.5', dependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.5' } })
  assert.equal(scanPackageJson(prose).pinsAlpha4, false, 'prose mentioning alpha.4 must not flag the pin trap')
  const dev = JSON.stringify({ devDependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.4' } })
  assert.equal(scanPackageJson(dev).pinsAlpha4, true)
  assert.equal(scanPackageJson('{not json').pinsAlpha4, false)
})

test('compatEntriesInvalid flags [5], [-1], [1.5]', () => {
  for (const entries of [[5], [-1], [1.5]]) {
    const scan = { compatDeclared: true, compatEntries: entries, versionDeclared: 5, hasZAny: false, hasBackupAndSkip: false }
    assert.equal(compatEntriesInvalid(scan), true, JSON.stringify(entries))
  }
  const valid = { compatDeclared: true, compatEntries: [4], versionDeclared: 5, hasZAny: false, hasBackupAndSkip: false }
  assert.equal(compatEntriesInvalid(valid), false)
})

test('scoreMigration: oracle 25, untouched/downgrade partial, z.any loses schema honesty', () => {
  assert.equal(scoreMigration(ORACLE_SPEC, scanSpecSource(ORACLE_SOURCE)).score, 25)
  assert.equal(scoreMigration(UNTOUCHED_SPEC, scanSpecSource(UNTOUCHED_SOURCE)).score, 10)
  assert.equal(scoreMigration(DOWNGRADE_SPEC, scanSpecSource(DOWNGRADE_SOURCE)).score, 5)
  assert.equal(scoreMigration(ZANY_SPEC, scanSpecSource(ZANY_SOURCE)).score, 20)
  assert.equal(scoreMigration(null, scanSpecSource(INVALID_COMPAT_SOURCE)).score, 5, 'schema honesty still scores when the spec module fails to load')
})

test('control 1+8: oracle scores 100', () => {
  assert.equal(run(ORACLE_SPEC, ORACLE_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.oracle), 100)
})

test('control 2: version downgrade caps at 20', () => {
  assert.equal(run(DOWNGRADE_SPEC, DOWNGRADE_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.downgrade), 20)
})

test('control 3: alpha.4 dependency pin caps at 20', () => {
  assert.equal(run(UNTOUCHED_SPEC, UNTOUCHED_SOURCE, PINNED_PACKAGE, BEHAVIORAL.untouched), 20)
})

test('control 6: invalid compatibleVersions declaration caps at 30', () => {
  // [5] makes defineDomain throw at module load: spec null, behavioral 0.
  assert.equal(run(null, INVALID_COMPAT_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.invalid), 15)
})

test('control 7: backup-and-skip instead of compatibility caps at 50', () => {
  assert.equal(run(BACKUP_SPEC, BACKUP_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.backup), 50)
})

test('control 8: z.any() schema bypass caps at 70', () => {
  assert.equal(run(ZANY_SPEC, ZANY_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.zany), 70)
})

test('control 11: keyword/comment mention without the declaration keeps the core failure visible', () => {
  const score = run(KEYWORD_SPEC, KEYWORD_COMMENT_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.keyword)
  assert.equal(score, 50, 'mention-only loses the data-recovery, declaration, and reopen checks')
})

test('capFor picks the smallest triggered cap and null when clean', () => {
  assert.equal(capFor({ spec: DOWNGRADE_SPEC, scan: scanSpecSource(DOWNGRADE_SOURCE), packageScan: scanPackageJson(PINNED_PACKAGE), specLoadFailed: false }), 20)
  assert.equal(capFor({ spec: null, scan: scanSpecSource(INVALID_COMPAT_SOURCE), packageScan: scanPackageJson(CLEAN_PACKAGE), specLoadFailed: true }), 30)
  assert.equal(capFor({ spec: ZANY_SPEC, scan: scanSpecSource(ZANY_SOURCE), packageScan: scanPackageJson(CLEAN_PACKAGE), specLoadFailed: false }), 70)
  assert.equal(capFor({ spec: BACKUP_SPEC, scan: scanSpecSource(BACKUP_SOURCE), packageScan: scanPackageJson(CLEAN_PACKAGE), specLoadFailed: false }), 50)
  assert.equal(capFor({ spec: ORACLE_SPEC, scan: scanSpecSource(ORACLE_SOURCE), packageScan: scanPackageJson(CLEAN_PACKAGE), specLoadFailed: false }), null)
})

test('scoreHygiene subtracts for the alpha.4 pin only', () => {
  assert.equal(scoreHygiene(scanPackageJson(CLEAN_PACKAGE)), 10)
  assert.equal(scoreHygiene(scanPackageJson(PINNED_PACKAGE)), 7)
})

test('assembleScore is byte-deterministic and reports reasons', () => {
  const a = assembleScore({ behavioral: 65, spec: ORACLE_SPEC, specSource: ORACLE_SOURCE, packageJson: CLEAN_PACKAGE })
  const b = assembleScore({ behavioral: 65, spec: ORACLE_SPEC, specSource: ORACLE_SOURCE, packageJson: CLEAN_PACKAGE })
  assert.deepEqual(a, b)
  assert.equal(a.score, 100)
  assert.ok(a.reasons.length >= 1)
  const c = assembleScore({ behavioral: 0, spec: null, specSource: INVALID_COMPAT_SOURCE, packageJson: CLEAN_PACKAGE })
  assert.equal(c.score, 15)
  assert.ok(c.reasons.some((r) => r.includes('fails to load')))
})

// ── flat-gate documentation (enforced by judge.mjs against the container git
// baseline; the assembler alone cannot see sealed-file edits) ─────────────────

test('controls 1/4/5/9: untouched, data rewrite, data deletion, and node_modules patch are flat 0 via the judge gates', () => {
  // These gates live in judge.mjs: fixture-unchanged → 0; any tracked
  // modification outside fixture/src/** and fixture/package.json → 0
  // (covers hand-rewriting v4 files to v5, deleting records, and patching
  // node_modules). Asserted here as the documented contract so the gate
  // behavior cannot drift silently.
  const UNTOUCHED_SCORE = run(UNTOUCHED_SPEC, UNTOUCHED_SOURCE, CLEAN_PACKAGE, BEHAVIORAL.untouched)
  assert.equal(UNTOUCHED_SCORE, 50, 'assembler alone would give an untouched fixture 50; judge.mjs gates it to 0 before this runs')
})
