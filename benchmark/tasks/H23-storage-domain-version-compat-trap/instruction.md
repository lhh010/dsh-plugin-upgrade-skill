# H23 · Storage-Domain Version Compatibility Trap (Hands-On)

## Unattended Evaluation Authorization (BENCHMARK-AUTH-v1)

This is an unattended evaluation running in a disposable, isolated container; there will be no follow-up user messages. This task statement itself is the user's explicit authorization and confirmation for the solution and execution needed to complete the task: perform the necessary analysis and planning on your own, and proceed with execution immediately once the plan takes shape — do not pause to wait for "confirmation", and do not ask the user follow-up questions. This confirmation continues to apply to the concrete plan you produce based on the applicable skill, but only within the following scope:

- You may read `/app/fixture/` (including the installed packages under `/app/fixture/node_modules/` and their published sources and type declarations) and local in-container documentation and tools; you may modify `/app/fixture/` directly, and write to the designated `/app/agent-output/` directory as specified by the task;
- You may create throwaway local verification scripts and temporary files, and run local tests and Node commands;
- You may not modify the skill, the verifier, or the reference solution; you may not modify the installed packages under `/app/fixture/node_modules/`, the preloaded persisted data under `/app/fixture/data/`, or the contract files under `/app/fixture/tests/` — patching the runtime, rewriting stored records by hand, or deleting records is not a migration; you may not publish, push, access external services, or alter resources outside the container;
- If you cannot complete the task, state the blocker honestly, but do not stop merely because another round of confirmation is missing.

## The situation

We upgraded our plugin from dsh 0.1.2-alpha.4 to dsh 0.1.2-alpha.5. The
plugin persists its own state through the dsh storage-domain API: a
`per-record` JSON domain (`migration_summaries`) that holds the recent
migration summaries our users rely on. As part of the alpha.5 release we
bumped the domain version from 4 to 5 — the new record schema only adds one
optional field, so the old records still parse.

After the upgrade everything looks healthy: the plugin installs, typechecks,
boots, and the domain opens without any error. New records write and read
correctly. But our users report that all summaries written by the previous
release have vanished — the application silently shows an empty history.

The handover note in `/app/fixture/README.md` documents the domain, the
product requirement that version-4 records must survive this upgrade, and
the preloaded persisted records under `/app/fixture/data/`. The alpha.5
runtime is installed in the container as the exact published version — its
sources and type declarations are under
`/app/fixture/node_modules/@deepseek-ai/dsh-storage-domain/` and its sibling
storage packages; that is the first-party reference for what the alpha.5
storage surface looks like.

Migrate the plugin's domain declaration in `/app/fixture/src/` so the
upgrade keeps working the way the handover note requires. Verify from the
fixture directory:

```sh
cd /app/fixture && node src/app.mjs
```

The app prints the records the domain currently sees. After your migration,
the version-4 records must be visible again, the version-5 record must stay
visible, and the version bump itself must remain in place. The judge
verifies the same behavior against real alpha.5 storage packages and checks
that the migration went through the runtime's public API surface — no
runtime patching, no hand-editing or deleting persisted records, no
downgrading the domain or the host packages.
