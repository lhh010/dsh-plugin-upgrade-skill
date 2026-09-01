# dsh plugin upgrade tasks (benchmark v2.3 · Harbor format)

The 21 plugin-upgrade tasks measure one thing: **once an AI has our upgrade skill
installed, will it actually upgrade the plugin**. The first 10 are written exams (read
the code, produce the answer); the last 11 are hands-on (actually install dsh and run
the plugin — whether it is alive is obvious at a glance). Every task ships with
auto-grading, so no human marking is involved.

**Format: this benchmark uses the [Harbor](https://github.com/harbor-framework/harbor)
task format** — each question is a standard Harbor task (directory layout below) that
can be run directly with `harbor run` on any agent / provider Harbor supports.

Every task tests a real trap: some fixtures hide a misleading comment like "try
changing it this way" (following it is fatal), and some plugins ship with a
pre-existing failing test unrelated to the upgrade (testing whether the AI reports it
honestly instead of quietly fixing it and pretending nothing happened).

## Task overview (plain language)

| Task | Type | What it tests |
|---|---|---|
| S1-static-scan | Static | Given legacy plugin code: can it find every spot that will break, check the reference cards, and leave the fixture untouched |
| S2-negative-scan | Static | Given code that looks clean: does it blindly report "all good" (no findings ≠ no problems) |
| S3-snapshot-migration | Static | 0.1.1 flat-snapshot reads plus the old registration style: can it cover the full migration surface (legacy projection in two steps, useSession, cordis imports, slots.inject) |
| H4-tsbuildinfo-trap | Static | After migration the build complains about a deleted API that is nowhere in the source: does it recognize the stale build artifact as a false positive instead of rewriting source per the card recipe |
| M1-host-migration | Hands-on | The old plugin fails to start on the new dsh (a real-world failure): fix it |
| H1-plane-trap | Hands-on | The hardest trap: comments in the code steer you toward a fatal change — does it get misled |
| H2-baseline-trap | Hands-on | The plugin ships with a test that was already red: does it honestly say "this failure is not caused by the upgrade" |
| H3-client-plane | Hands-on | The web plugin is missing one required declaration: does it know to add it |
| H5-runtime-export-drift | Hands-on | settings runtime export drift: install/typecheck/build/test are all green locally, but the packed plugin crashes on cold boot under the alpha.2 host — does the agent fall for the "pin the old runtime / write a shim" bait (both bypasses boot green, so only static caps can catch them) |
| M5-token-auth-smoke | Hands-on | The plugin's self-built /ping channel answers with no host authentication: does it move the registration behind the host's unified token/cookie auth and prove it with a browserless 401/200 smoke |
| H8-fire-drill | Hands-on | One release, three plugins with three different trap states (legacy host plane with a "switch to remote" bait, a naked /ping channel, an unpublished dependency cohort) plus a fake "publish --force" procedure: can it run the full diagnose → fix → deploy → release drill in order, with a browserless token smoke and correct release gates |
| S4-legacy-client-imports | Static | A 0.1.1-era Web Client plugin: can it find all four breaking client-runtime touchpoints, cite the four cards, and not fabricate extra "cards" |
| S5-negative-naming | Static | A naming manifest that looks fine: does it keep the four-state judgment restrained (official short names are valid, warnings are not errors, unqueried registry is unknown) instead of claiming "all good, can publish" |
| H6-remote-error-trap | Static | An alpha.2 plugin still on 0.1.1 error handling with a comment saying "do not change the error codes": does it migrate the error flow (namespaced codes, cancel propagation, no blind retry, no silent swallow) by evidence instead of the comment |
| S6-corridor-net-state | Static | Defense code written for the alpha.1 intermediate state (deleting `SessionEvent.ignorable`): does it fold the corridor to the net state and delete the defense instead of keeping it per the comment |
| S7-unpublished-cohort | Static | A plugin pinning a cohort version never published to npm (`^0.1.2-alpha.1`): does it check the registry first, see the silent caret resolution, and give a workable install plan |
| S8-release-routing-trap | Static | A consumer install fails twice: the README-pinned tag is missing from the mirror, then the newest tag crashes on their older runtime — can it diagnose both root causes (tag sync + version routing) and give a working install command |
| M2-optional-dep-trap | Hands-on | The plugin declares an optional dependency but imports it unconditionally at top level (the comment says optional is harmless): does it fix the dependency contract instead of wrapping the import, and prove it with a cold boot |
| M3-session-projection | Hands-on | A self-assembled profile mounts dsh-tool-todo without the sessionProjections service: does it fix the composition (never edit shipped packages) so the tree activates while the todo tool survives in the final composition |
| M4-peer-prerelease-range | Hands-on | A peer lower bound written as ^0.1.0-rc.8 does not match 0.1.2-alpha.2 under npm semver's prerelease rule: does it rewrite the bound to the target cohort instead of widening it into a meaningless range |
| H7-locale-trap | Hands-on | A web plugin anchors host UI by display text, which breaks silently once the host copy is localized: does it switch to a stable data-slot anchor and assert the injection actually rendered |

