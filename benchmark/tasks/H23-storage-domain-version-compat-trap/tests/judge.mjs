// H23-storage-domain-version-compat-trap grading.
//
// A plugin upgrades alpha.4 → alpha.5, bumps its storage domain to version 5
// without declaring compatibleVersions, and its older per-record documents
// silently read as absent. The judge verifies the repair against the REAL
// published alpha.5 storage packages and the preloaded persisted records.
//
//   65 — behavioral, against the real runtime:
//        v4 records A+B visible again (25), v5 record C intact with its
//        optional field (10), unlisted v3 record D still foreign (10), a
//        write after reading a v4 record re-stamps the file to version 5
//        (10), close+reopen retains the expected state (10);
//   25 — migration correctness from the IMPORTED runtime spec + schema probes:
//        compatibleVersions === [4] (15), version stays 5 (5), honest schema
//        preserving valid records and rejecting invalid field types (5);
//   10 — hygiene: no alpha.4 dependency pin;
//   caps — invalid compatibleVersions declaration → 30; version downgrade
//        → 20; alpha.4 pin → 20; backup-and-skip instead of compatibility
//        → 50; schema contract bypass (including any/unknown) → 70;
//    0 — fixture untouched, persisted data / tests / node_modules modified,
//        or the git baseline rewritten (all git-gated).
// The judge always exits 0; the last stdout line is the {score, max, reasons} JSON.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { assembleScore } from './judge-utils.mjs'

function emit(score, reasons) {
  console.log(JSON.stringify({ score, max: 100, reasons }))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  grade().catch((error) => emit(0, [`judge error: ${error.message}`]))
}

// An explicit root lets regression tests use disposable fixtures; the verifier defaults to /app.
export async function grade(APP = '/app') {
  const SPEC_FILE = join(APP, 'fixture', 'src', 'domain-spec.mjs')
  const PACKAGE_FILE = join(APP, 'fixture', 'package.json')
  const DATA_ROOT = join(APP, 'fixture', 'data')
  const A_FILE = join(DATA_ROOT, 'migration_summaries', 'summaries', 'A.json')
  const CORDIS = join(APP, 'fixture', 'node_modules', '@deepseek-ai', 'cordis', 'lib', 'index.js')
  const STORAGE = join(APP, 'fixture', 'node_modules', '@deepseek-ai', 'dsh-storage', 'lib', 'index.js')
  const STORAGE_JSON = join(APP, 'fixture', 'node_modules', '@deepseek-ai', 'dsh-storage-json', 'lib', 'index.js')
  const STORAGE_DOMAIN = join(APP, 'fixture', 'node_modules', '@deepseek-ai', 'dsh-storage-domain', 'lib', 'index.js')
  const reasons = []
  if (!existsSync(SPEC_FILE)) { emit(0, ['fixture domain spec missing']); return }

  // Git integrity: only fixture/src/** and fixture/package.json may change.
  // Preloaded data, tests, node_modules, and the baseline commit are sealed.
  let status = ''
  try {
    status = execFileSync('git', ['-C', APP, 'status', '--porcelain'], { encoding: 'utf8' })
  } catch (error) { emit(0, [`git baseline check failed to run: ${error.message}`]); return }
  const lines = status.split('\n').filter((l) => l.trim() !== '')
  const modified = lines.filter((l) => !l.startsWith('??')).map((l) => l.slice(3))
  const allowed = (p) => p.startsWith('fixture/src/') || p === 'fixture/package.json'
  const tampered = modified.filter((p) => !allowed(p))
  let head = ''
  try { head = execFileSync('git', ['-C', APP, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() } catch { head = '' }
  let baseline = ''
  try { baseline = readFileSync(join(APP, 'baseline.sha'), 'utf8').trim() } catch { baseline = '' }
  if (tampered.length > 0 || (baseline !== '' && head !== baseline)) {
    const flat = []
    if (tampered.length > 0) flat.push(`sealed files modified (persisted data / tests / node_modules / host): ${tampered.join(' | ').slice(0, 200)}`)
    if (baseline !== '' && head !== baseline) flat.push('git history rewritten (baseline commit moved)')
    emit(0, flat)
    return
  }
  if (modified.length === 0) { emit(0, ['fixture untouched — no migration performed']); return }

  // Import the agent's spec module (an invalid declaration throws at load).
  let spec = null
  let expected
  let packageJson = ''
  try {
    // Snapshot sealed input records before loading candidate code.
    expected = Object.fromEntries(['A', 'B', 'C'].map((key) => [key,
      JSON.parse(readFileSync(join(DATA_ROOT, 'migration_summaries', 'summaries', `${key}.json`), 'utf8')).record,
    ]))
    packageJson = readFileSync(PACKAGE_FILE, 'utf8')
  } catch (error) { emit(0, [`fixture files unreadable: ${error.message}`]); return }
  try {
    const mod = await import(pathToFileURL(SPEC_FILE).href)
    spec = mod.spec ?? null
  } catch (error) {
    reasons.push(`domain spec fails to load: ${String(error.message).slice(0, 160)}`)
  }

  // Behavioral checks against the real alpha.5 runtime.
  let behavioral = 0
  if (spec !== null) {
    try {
      const { Context } = await import(pathToFileURL(CORDIS).href)
      const { default: Storage } = await import(pathToFileURL(STORAGE).href)
      const { JsonStorageBackend } = await import(pathToFileURL(STORAGE_JSON).href)
      const { DomainFacility } = await import(pathToFileURL(STORAGE_DOMAIN).href)

      async function openDomain() {
        const ctx = new Context()
        await ctx.plugin(Storage)
        ctx.storage.backend.register('json', new JsonStorageBackend(DATA_ROOT))
        const facility = new DomainFacility(ctx, { backend: 'json' })
        const domain = await facility.open(spec)
        return { domain, table: domain.table('summaries') }
      }

      const first = await openDomain()
      const visible = () => [...first.table.keys()].sort()

      const keys1 = visible()
      if (isDeepStrictEqual(first.table.get('A'), expected.A) && isDeepStrictEqual(first.table.get('B'), expected.B)) {
        behavioral += 25
        reasons.push('+25 v4 records A and B preserved unchanged')
      } else {
        reasons.push(`+0 v4 record contents missing or changed (got ${keys1.join(',') || 'none'})`)
      }
      const c = first.table.get('C')
      if (isDeepStrictEqual(c, expected.C)) {
        behavioral += 10
        reasons.push('+10 v5 record C intact with its optional field')
      } else {
        reasons.push('+0 v5 record C missing or field lost')
      }
      if (!keys1.includes('D')) {
        behavioral += 10
        reasons.push('+10 unlisted v3 record D still foreign')
      } else {
        reasons.push('+0 unlisted v3 record D became visible')
      }
      const expectedUpdated = { ...expected.A, title: 'judge-updated' }
      await first.table.put('A', { ...first.table.get('A'), title: 'judge-updated' })
      const written = JSON.parse(readFileSync(A_FILE, 'utf8'))
      if (written.version === 5 && isDeepStrictEqual(written.record, expectedUpdated)) {
        behavioral += 10
        reasons.push('+10 read-modify-write preserved the record and re-stamped version 5')
      } else {
        reasons.push(`+0 write lost record fields or stamped version ${written.version} instead of 5`)
      }
      await first.domain.close()

      const second = await openDomain()
      const keys2 = [...second.table.keys()].sort()
      const aUpdated = second.table.get('A')
      if (keys2.includes('A') && keys2.includes('B') && keys2.includes('C') && !keys2.includes('D')
        && isDeepStrictEqual(aUpdated, expectedUpdated)
        && isDeepStrictEqual(second.table.get('B'), expected.B)
        && isDeepStrictEqual(second.table.get('C'), expected.C)) {
        behavioral += 10
        reasons.push('+10 close+reopen retains the expected state')
      } else {
        reasons.push(`+0 reopen state mismatch (got ${keys2.join(',') || 'none'})`)
      }
      await second.domain.close()
    } catch (error) {
      reasons.push(`behavioral checks could not run: ${String(error.message).slice(0, 160)}`)
    }
  }

  const { score, reasons: migrationReasons } = assembleScore({ behavioral, spec, packageJson })
  reasons.push(...migrationReasons)
  emit(score, reasons)
}
