import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from '../environment/fixture/node_modules/zod/index.js'
import {
  assembleScore, capFor, compatEntriesInvalid, scanPackageJson, schemaContractHolds, scoreHygiene, scoreMigration,
} from './judge-utils.mjs'

const CLEAN_PACKAGE = JSON.stringify({ dependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.5' } })
const PINNED_PACKAGE = JSON.stringify({ dependencies: { '@deepseek-ai/dsh-storage': '0.1.2-alpha.4' } })
const honestSchema = z.object({ id: z.string(), title: z.string(), pinned: z.boolean().optional() })
const withSchema = (schema) => ({ version: 5, compatibleVersions: [4], tables: { summaries: { valueSchema: schema } } })
const oracle = withSchema(honestSchema)
const bypass = withSchema(z.object({ id: z.any(), title: z.any(), pinned: z.boolean().optional() }))
const score = (spec, behavioral = 65, packageJson = CLEAN_PACKAGE) => assembleScore({ behavioral, spec, packageJson })

test('dependency scan only flags alpha.4 in dependency values', () => {
  assert.equal(scanPackageJson(PINNED_PACKAGE).pinsAlpha4, true)
  assert.equal(scanPackageJson(CLEAN_PACKAGE).pinsAlpha4, false)
  assert.equal(scanPackageJson(JSON.stringify({ description: 'from 0.1.2-alpha.4', dependencies: {} })).pinsAlpha4, false)
  for (const section of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    assert.equal(scanPackageJson(JSON.stringify({ [section]: { dsh: '0.1.2-alpha.4' } })).pinsAlpha4, true)
  }
  assert.equal(scanPackageJson('{not json').pinsAlpha4, false)
})

test('compatibility validation uses actual values and the declared current version', () => {
  for (const compatibleVersions of [[5], [-1], [1.5], [NaN], ['4'], null, 4]) {
    assert.equal(compatEntriesInvalid({ version: 5, compatibleVersions }), true)
  }
  const PREVIOUS_VERSION = 4
  assert.equal(compatEntriesInvalid({ version: 5, compatibleVersions: [PREVIOUS_VERSION] }), false)
  assert.equal(compatEntriesInvalid({ version: 5, compatibleVersions: [2 + 2] }), false)
  assert.equal(compatEntriesInvalid({ version: 4, compatibleVersions: [4] }), true)
  assert.equal(compatEntriesInvalid({ version: 5 }), false)
  assert.equal(compatEntriesInvalid(null), false)
})

test('honest schema preserves valid records with optional pinned', () => {
  assert.equal(schemaContractHolds(oracle), true)
  assert.equal(schemaContractHolds(null), false)
  assert.equal(schemaContractHolds({}), false)
})

test('schema probes reject any/unknown, missing fields, coercion, and record transforms', () => {
  const schemas = [
    bypass.tables.summaries.valueSchema,
    z.unknown(),
    honestSchema.omit({ id: true }),
    honestSchema.omit({ title: true }),
    honestSchema.omit({ pinned: true }),
    honestSchema.partial(),
    honestSchema.extend({ id: z.coerce.string() }),
    honestSchema.extend({ pinned: z.any() }),
    honestSchema.transform((record) => ({ ...record, title: 'lost' })),
  ]
  for (const schema of schemas) assert.equal(schemaContractHolds(withSchema(schema)), false)
})

test('schema probes fail closed when parsing throws', () => {
  assert.equal(schemaContractHolds(withSchema({ safeParse() { throw new Error('invalid schema') } })), false)
})

test('migration points require an inspected schema even when module loading fails', () => {
  assert.equal(scoreMigration(oracle, true).score, 25)
  assert.equal(scoreMigration({ ...oracle, compatibleVersions: undefined }, true).score, 10)
  assert.equal(scoreMigration({ ...oracle, version: 4, compatibleVersions: undefined }, true).score, 5)
  assert.equal(scoreMigration(bypass, false).score, 20)
  assert.equal(scoreMigration(null, false).score, 0)
})

test('score assembly awards the oracle 100 and caps schema bypasses at 70', () => {
  assert.equal(score(oracle).score, 100)
  assert.equal(score(bypass).score, 70)
})

test('score assembly caps downgrades and pins at 20, invalid declarations at 30', () => {
  assert.equal(score({ ...oracle, version: 4 }).score, 20)
  assert.equal(score(oracle, 65, PINNED_PACKAGE).score, 20)
  assert.equal(score({ ...oracle, compatibleVersions: [5] }).score, 30)
  assert.equal(score(null, 0).score, 10)
})

test('backup-and-skip cap uses the evaluated policy and compatibility declaration', () => {
  const policy = 'backup-and-skip'
  assert.equal(score({ ...oracle, invalidRecords: policy, compatibleVersions: undefined }).score, 50)
  assert.equal(score({ ...oracle, invalidRecords: policy }).score, 100)
})

test('capFor picks the smallest cap; clean runtime contracts have no cap', () => {
  assert.equal(capFor({ spec: oracle, schemaHonest: true, packageScan: { pinsAlpha4: false } }), null)
  assert.equal(capFor({ spec: { ...oracle, version: 4 }, schemaHonest: false, packageScan: { pinsAlpha4: true } }), 20)
  assert.equal(capFor({ spec: null, schemaHonest: false, packageScan: { pinsAlpha4: false } }), 30)
})

test('hygiene and score reasons are deterministic', () => {
  assert.equal(scoreHygiene(scanPackageJson(CLEAN_PACKAGE)), 10)
  assert.equal(scoreHygiene(scanPackageJson(PINNED_PACKAGE)), 7)
  assert.deepEqual(score(oracle), score(oracle))
  assert.ok(score(bypass).reasons.some((reason) => reason.includes('schema fails')))
})
