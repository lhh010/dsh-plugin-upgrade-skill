## Summary

Appends a new author entry to the ACL author block in `paper/latex/acl_latex.tex`, following the maintainer's request that contributors submit their names. Inserted after the first author so the contributor's co-authorship reads prominently.

- **Haihao Li** — Fudan University — `24302010010@m.fudan.edu.cn` (backup: `lhhisdd@163.com`)

Contribution context (all merged, `lhh010` / `@lhh010`):

- `#15` — real-world batch migration example (6 plugins, 0.1.1-rc.1 → 0.1.2-alpha.1).
- `#57` — first-hand migration annotations to A1-03 and A1-21.
- `#58` — migration-hygiene reference (version-agnostic toolchain pitfalls).
- `#64` — example-06 corridor coverage note.
- `#69` — S3-snapshot-migration and H4-tsbuildinfo-trap benchmark tasks.
- `#85` — profile-dependency-management §8 (version routing) + §9 (tag sync).
- `#90` — S8-release-routing-trap benchmark task (tag sync + version routing diagnosis).
- `#106` — S9 + S10 runtime-debug benchmark tasks + `plugin-runtime-debug` skill.
- `#109` — S11-mermaid-lazyload-trap benchmark task + `plugin-heavy-dep` skill.
- `#114` — §10 in-plugin update-prompt routing and rescue notes.

> These contributions span the benchmark tasks (S3/S4 via #69, S8, S9, S10, S11), two method-level skills (`plugin-runtime-debug`, `plugin-heavy-dep`), and the release-engineering docs (§8/§9/§10) that the paper's task-to-card pipeline and version-confidence claims rest on. The recent multi-plugin DSH alpha.4/alpha.5 adaptation work lives in the companion plugin repositories and is out of scope for this paper's benchmark/skill corpus.

Single file, `\and`-separated entry appended inside the existing `\author{}` block (the closing `\}` moves to the last entry), no other change. If `#118`/`#119` lands first I will rebase onto them.

Note: the document currently builds with `\usepackage[review]{acl}`, which replaces the author block with "Anonymous ACL submission". This entry only renders once the option is switched to `final` or `preprint`.

## Scope Checklist

- [x] I checked existing Issues and PRs for overlap and coordinated any related work.
- [ ] For version-specific work, I used exact DSH tags or commit hashes, not `latest` or inferred versions. — not applicable.
- [ ] I cited fixed first-party sources for version-specific claims. — not applicable.
- [ ] For migration or card work, I listed the affected touchpoints (`#1`-`#7`) and complete card IDs. — not applicable.
- [ ] I kept Host, Web Client, and ordinary Cordis plugin faces distinct. — not applicable.
- [ ] For benchmark result or validation-report PRs, the report states the consumed tokens and the total run duration per round. — not applicable.

## Verification

```text
node scripts/validate.mjs
node scripts/validate-manifests.mjs
git diff --check
```

All pass below. Brace nesting of `\author{}` unchanged; the closing `\}` moves to the final entry.

Unverified boundaries: not compiled with `pdflatex` locally.
