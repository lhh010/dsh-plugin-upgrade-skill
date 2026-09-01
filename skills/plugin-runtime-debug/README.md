# plugin-runtime-debug

Diagnosing DSH Web plugin runtime bugs against host API contracts read from
the DSH source tree. Born from a real 2026-09-01 external-plugin incident
session (composer attachment insertion/removal failing after the first
attachment, a stale "latest version" chip, and phantom dock entries), kept
method-level on purpose: the skill names the questions and symptom families,
not the answers — the companion benchmark task
`benchmark/tasks/S9-composer-coordinate-trap/` grades the concrete diagnosis.

- `SKILL.md` — the standing rule (read the verb's contract), three
  questions to ask any offset/span-taking verb, symptom families, and the
  debug-to-release workflow.
