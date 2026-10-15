# Cell Ledger — step5-preview S1–S24 r1 (opencode 1.19.0 subagents)

| task | arm | status | start | end | duration | toolcalls | tokens |
|---|---|---|---|---|---|---|---|
| S1-static-scan | noskill | ok  | 2026-10-12T03:22:18Z | 2026-10-12T03:46:33Z | 24m15s | 19 | 42468 |
| S1-static-scan | skill | invalid:roaming  | 2026-10-12T03:22:29Z | 2026-10-12T04:43:06Z | 50m51s | 80 | 240224 |
| S2-negative-scan | noskill | ok  | 2026-10-12T03:22:38Z | 2026-10-12T03:45:37Z | 22m59s | 16 | 34399 |
| S2-negative-scan | skill | invalid:roaming  | 2026-10-12T04:51:18Z | 2026-10-13T09:06:49Z | 16m09s | 51 | 159523 |
| S3-snapshot-migration | noskill | ok  | 2026-10-12T04:51:27Z | 2026-10-13T09:41:35Z | 25m03s | 39 | 68375 |
| S3-snapshot-migration | skill | invalid:roaming  | 2026-10-12T04:51:37Z | 2026-10-15T09:16:35Z | 54m36s | 114 | 480504 |
| S4-legacy-client-imports | noskill | ok  | 2026-10-13T09:56:24Z | 2026-10-13T10:02:33Z | 6m08s | 9 | 36758 |
| S4-legacy-client-imports | skill | invalid:roaming  | 2026-10-13T09:56:40Z | 2026-10-13T10:17:25Z | 20m45s | 32 | 133681 |
| S5-negative-naming | noskill | ok  | 2026-10-13T10:19:04Z | 2026-10-13T10:21:47Z | 2m43s | 7 | 21842 |
| S5-negative-naming | skill | ok  | 2026-10-13T10:19:19Z | 2026-10-13T10:24:29Z | 5m09s | 12 | 38908 |
| S6-corridor-net-state | noskill | ok  | 2026-10-13T10:25:35Z | 2026-10-13T10:29:41Z | 4m05s | 10 | 24072 |
| S6-corridor-net-state | skill | ok  | 2026-10-13T10:25:51Z | 2026-10-13T10:31:25Z | 5m33s | 16 | 88917 |
| S7-unpublished-cohort | noskill | ok  | 2026-10-13T10:32:37Z | 2026-10-13T10:36:46Z | 4m08s | 5 | 15016 |
| S7-unpublished-cohort | skill | ok  | 2026-10-13T10:32:56Z | 2026-10-13T10:38:32Z | 5m35s | 8 | 55241 |
| S8-release-routing-trap | noskill | ok  | 2026-10-13T10:39:39Z | 2026-10-13T10:46:18Z | 6m38s | 10 | 28442 |
| S8-release-routing-trap | skill | ok  | 2026-10-13T10:39:52Z | 2026-10-13T10:47:24Z | 7m31s | 18 | 65748 |
| S9-composer-coordinate-trap | noskill | invalid:roaming  | 2026-10-13T10:48:36Z | 2026-10-14T08:49:43Z | 7m51s | 12 | 33032 |
| S9-composer-coordinate-trap | skill | invalid:roaming  | 2026-10-13T10:48:52Z | 2026-10-14T08:57:52Z | 17m23s | 33 | 98570 |
| S10-paste-rename-and-version-chip | noskill | ok  | 2026-10-14T09:05:16Z | 2026-10-14T09:15:40Z | 10m24s | 10 | 40213 |
| S10-paste-rename-and-version-chip | skill | ok  | 2026-10-14T09:05:36Z | 2026-10-14T09:13:47Z | 8m11s | 15 | 76514 |
| S11-mermaid-lazyload-trap | noskill | invalid:roaming  | 2026-10-14T09:17:01Z | 2026-10-14T09:27:42Z | 10m41s | 16 | 34439 |
| S11-mermaid-lazyload-trap | skill | invalid:roaming  | 2026-10-14T09:17:18Z | 2026-10-14T09:31:33Z | 14m14s | 24 | 57647 |
| S12-global-upgrade-ebusy-trap | noskill | ok  | 2026-10-14T09:33:54Z | 2026-10-14T09:38:22Z | 4m27s | 9 | 24957 |
| S12-global-upgrade-ebusy-trap | skill | ok  | 2026-10-14T09:34:13Z | 2026-10-14T09:39:44Z | 5m30s | 16 | 60552 |
| S13-peer-range-vs-runtime | noskill | invalid:roaming  | 2026-10-14T09:41:12Z | 2026-10-14T09:44:19Z | 3m07s | 8 | 30658 |
| S13-peer-range-vs-runtime | skill | invalid:roaming  | 2026-10-14T09:41:28Z | 2026-10-14T09:51:29Z | 10m00s | 25 | 74924 |
| S14-link-install-lock-trap | noskill | invalid:roaming  | 2026-10-14T09:53:27Z | 2026-10-14T09:59:45Z | 6m17s | 10 | 32242 |
| S14-link-install-lock-trap | skill | ok  | 2026-10-14T09:53:43Z | 2026-10-14T10:04:07Z | 10m23s | 27 | 73967 |
| S15-slot-error-boundary-crash | noskill | invalid:roaming  | 2026-10-14T10:05:56Z | 2026-10-14T10:18:06Z | 12m09s | 12 | 32438 |
| S15-slot-error-boundary-crash | skill | ok  | 2026-10-14T10:06:17Z | 2026-10-14T10:19:01Z | 12m43s | 16 | 49037 |
| S16-self-host-upgrade-trap | noskill | relaunched  | 2026-10-14T10:20:10Z | 2026-10-14T11:21:07Z | 8m44s | 14 | 40874 |
| S16-self-host-upgrade-trap | skill | invalid:roaming  | 2026-10-14T10:20:26Z | 2026-10-14T11:24:08Z | 14m22s | 35 | 110442 |
| S17-external-ui-plugin-onboarding-trap | noskill | invalid:roaming  | 2026-10-14T11:25:31Z | 2026-10-14T11:30:55Z | 5m23s | 12 | 26186 |
| S17-external-ui-plugin-onboarding-trap | skill | invalid:roaming  | 2026-10-14T11:25:48Z | 2026-10-14T11:43:14Z | 17m25s | 36 | 83245 |
| S18-terminal-sprite-render-trap | noskill | invalid:roaming  | 2026-10-14T11:45:24Z | 2026-10-14T11:51:20Z | 5m55s | 11 | 23891 |
| S18-terminal-sprite-render-trap | skill | invalid:roaming  | 2026-10-14T11:45:38Z | 2026-10-14T11:54:54Z | 9m15s | 14 | 43107 |
| S19-phantom-update-stale-host | noskill | invalid:roaming  | 2026-10-14T11:56:16Z | 2026-10-15T06:07:17Z | 9m53s | 25 | 44972 |
| S19-phantom-update-stale-host | skill | invalid:roaming  | 2026-10-14T11:56:33Z | 2026-10-15T07:20:06Z | 76m48s | 83 | 346412 |
| S20-msvc-flock-trap | noskill | ok  | 2026-10-15T07:09:22Z | 2026-10-15T07:16:16Z | 6m53s | 8 | 19185 |
| S20-msvc-flock-trap | skill | ok  | 2026-10-15T07:21:37Z | 2026-10-15T07:26:25Z | 4m47s | 13 | 40638 |
| S21-resource-service-unavailable-trap | noskill | ok  | 2026-10-15T07:21:54Z | 2026-10-15T07:26:41Z | 4m46s | 9 | 28239 |
| S21-resource-service-unavailable-trap | skill | ok  | 2026-10-15T07:28:01Z | 2026-10-15T07:34:35Z | 6m34s | 18 | 79181 |
| S22-duplicate-insert-boot-crash-trap | noskill | ok  | 2026-10-15T07:28:18Z | 2026-10-15T07:35:26Z | 7m08s | 6 | 24072 |
| S22-duplicate-insert-boot-crash-trap | skill | relaunched  | 2026-10-15T07:39:03Z | 2026-10-15T08:33:13Z | 12m11s | 35 | 166681 |
| S23-passing-compat-guard-trap | noskill | relaunched  | 2026-10-15T07:39:17Z | 2026-10-15T08:34:31Z | 9m01s | 17 | 46118 |
| S23-passing-compat-guard-trap | skill | invalid:roaming  | 2026-10-15T08:36:29Z | 2026-10-15T08:44:36Z | 8m07s | 16 | 56483 |
| S24-dock-cotenant-crash-trap | noskill | ok  | 2026-10-15T08:36:43Z | 2026-10-15T08:43:07Z | 6m24s | 12 | 22116 |
| S24-dock-cotenant-crash-trap | skill | ok  | 2026-10-15T08:47:06Z | 2026-10-15T08:56:15Z | 9m09s | 18 | 65223 |

cells accounted: 48/48 (pending: 0)
