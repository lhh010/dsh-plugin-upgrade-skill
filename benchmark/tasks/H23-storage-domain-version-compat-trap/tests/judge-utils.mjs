// Pure source-analysis and scoring-assembly helpers for the H23 judge.
//
// Scoring model (behavioral inputs are produced by the real alpha.5 runtime
// in judge.mjs; the unit tests pin the same values from calibration):
//   behavioral 65 (v4 records visible 25 / v5 record correct 10 / unlisted
//                  v3 still foreign 10 / write re-stamps current version 10 /
//                  reopen retains state 10)
//   migration  25 (real compatibleVersions declaration === [4] 15 +
//                  current version stays 5 (5) + honest schema, no z.any (5))
//   hygiene    10 (no alpha.4 dependency pin)
//   hard caps  — invalid compatibleVersions declaration → 30;
//                domain version downgrade → 20; alpha.4 pin → 20;
//                backup-and-skip used instead of compatibility → 50;
//                z.any() schema bypass → 70.
//   flat 0     — fixture untouched, persisted data / tests / node_modules
//                modified, or the git baseline rewritten (judge.mjs gates).
// The declaration is judged from the IMPORTED runtime spec object, never
// from grep alone; the source scan only flags trap forms and caps.

/** Remove // line and / * block * / comments (string-aware). */
export function stripComments(source) {
  let out = ''
  let i = 0
  const n = source.length
  let quote = null
  while (i < n) {
    const ch = source[i]
    const next = source[i + 1]
    if (quote !== null) {
      out += ch
      if (ch === '\\') { out += next ?? ''; i += 2; continue }
      if (ch === quote) quote = null
      i += 1
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; out += ch; i += 1; continue }
    if (ch === '/' && next === '/') {
      while (i < n && source[i] !== '\n') i += 1
      continue
    }
    if (ch === '/' && next === '*') {
      i += 2
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) i += 1
      i += 2
      out += ' '
      continue
    }
    out += ch
    i += 1
  }
  return out
}

/**
 * Scan the (comment-stripped) domain-spec source for trap forms.
 * @returns {{ compatDeclared: boolean, compatEntries: number[]|null,
 *             versionDeclared: number|null, hasZAny: boolean,
 *             hasBackupAndSkip: boolean }}
 */
export function scanSpecSource(specSource) {
  const text = stripComments(specSource)
  const compatMatch = /compatibleVersions\s*:\s*\[([^\]]*)\]/.exec(text)
  let compatEntries = null
  if (compatMatch) {
    compatEntries = compatMatch[1].split(',').map((entry) => entry.trim()).filter((entry) => entry !== '').map((entry) => Number(entry))
  }
  const versionMatch = /version\s*:\s*(\d+)/.exec(text)
  return {
    compatDeclared: compatMatch !== null,
    compatEntries,
    versionDeclared: versionMatch === null ? null : Number(versionMatch[1]),
    hasZAny: /\bz\.any\b/.test(text),
    hasBackupAndSkip: /invalidRecords\s*:\s*['"]backup-and-skip['"]/.test(text),
  }
}

/** Scan the fixture package.json dependency VALUES for the alpha.4 pin (prose mentioning alpha.4 never flags). */
export function scanPackageJson(packageJson) {
  let parsed = null
  try {
    parsed = JSON.parse(packageJson)
  } catch {
    parsed = null
  }
  let pinsAlpha4 = false
  if (parsed !== null && typeof parsed === 'object') {
    for (const section of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      const deps = parsed[section]
      if (deps === null || typeof deps !== 'object') continue
      for (const value of Object.values(deps)) {
        if (typeof value === 'string' && /0\.1\.2-alpha\.4/.test(value)) pinsAlpha4 = true
      }
    }
  }
  return { pinsAlpha4 }
}

/** True when the declared compatibleVersions list is invalid for version 5. */
export function compatEntriesInvalid(scan) {
  if (!scan.compatDeclared || scan.compatEntries === null) return false
  return scan.compatEntries.some((entry) => !Number.isInteger(entry) || entry < 0 || entry >= 5)
}

/** Migration-correctness points from the imported runtime spec + source scan (max 25). */
export function scoreMigration(spec, scan) {
  let score = 0
  const detail = []
  if (spec !== null && Array.isArray(spec.compatibleVersions) && spec.compatibleVersions.length === 1 && spec.compatibleVersions[0] === 4) {
    score += 15
    detail.push('compatibleVersions:[4]:15')
  } else {
    detail.push('compatibleVersions:[4]:0')
  }
  if (spec !== null && spec.version === 5) {
    score += 5
    detail.push('version:5')
  } else {
    detail.push('version!=5:0')
  }
  if (!scan.hasZAny) {
    score += 5
    detail.push('schema-honest:5')
  } else {
    detail.push('z.any:0')
  }
  return { score, detail: detail.join(' ') }
}

/** Migration hygiene (max 10). */
export function scoreHygiene(packageScan) {
  return packageScan.pinsAlpha4 ? 7 : 10
}

/** Smallest triggered hard cap, or null. */
export function capFor({ spec, scan, packageScan, specLoadFailed }) {
  const caps = []
  if (specLoadFailed || compatEntriesInvalid(scan)) caps.push(30)
  if (spec !== null && typeof spec.version === 'number' && spec.version < 5) caps.push(20)
  if (packageScan.pinsAlpha4) caps.push(20)
  const compatHas4 = spec !== null && Array.isArray(spec.compatibleVersions) && spec.compatibleVersions.includes(4)
  if (scan.hasBackupAndSkip && !compatHas4) caps.push(50)
  if (scan.hasZAny) caps.push(70)
  return caps.length > 0 ? Math.min(...caps) : null
}

/**
 * Assemble the final score from the behavioral total, the imported runtime
 * spec (null when the agent's module fails to load), and the fixture sources.
 * @returns {{ score: number, reasons: string[] }}
 */
export function assembleScore({ behavioral, spec, specSource, packageJson }) {
  const reasons = []
  const scan = scanSpecSource(specSource)
  const packageScan = scanPackageJson(packageJson)
  const specLoadFailed = spec === null
  const migration = scoreMigration(spec, scan)
  const hygiene = scoreHygiene(packageScan)
  reasons.push(`behavioral ${behavioral}/65; migration ${migration.score}/25 (${migration.detail}); hygiene ${hygiene}/10`)
  if (specLoadFailed) reasons.push('domain spec fails to load (invalid declaration?) — cap 30')
  if (compatEntriesInvalid(scan)) reasons.push('invalid compatibleVersions declaration — cap 30')
  if (spec !== null && typeof spec.version === 'number' && spec.version < 5) reasons.push(`domain version downgraded to ${spec.version} — cap 20`)
  if (packageScan.pinsAlpha4) reasons.push('alpha.4 dependency pin — cap 20')
  if (scan.hasBackupAndSkip && !(spec !== null && Array.isArray(spec.compatibleVersions) && spec.compatibleVersions.includes(4))) {
    reasons.push('backup-and-skip used instead of version compatibility — cap 50')
  }
  if (scan.hasZAny) reasons.push('z.any() schema bypass — cap 70')
  let score = behavioral + migration.score + hygiene
  const cap = capFor({ spec, scan, packageScan, specLoadFailed })
  if (cap !== null && score > cap) {
    reasons.push(`capped at ${cap} (was ${score})`)
    score = cap
  }
  score = Math.max(0, Math.min(100, Math.round(score)))
  return { score, reasons }
}
