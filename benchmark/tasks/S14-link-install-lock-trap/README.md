# S14 · Link-Install File-Lock Trap

Static, read-only. A link-installed (junction) lib-only Web plugin is edited in its repo;
the maintainer then (a) refreshes only the browser and sees stale code, (b) tries to
Copy-Item the new files into the profile's node_modules and hits EBUSY, (c) attempts a
rename-aside recovery that leaves BOTH the repo and the profile with no entry files
(both paths resolve to the same directory through the junction).

Derived from a real 2026-09-03 dsh-paste-input v0.1.17 verification session
(hover-preview feature rollout).

- Type: static / read-only report
- Score: 5 aspects × 20 points, fixture-modification gate → 0
- **Oracle**: `harbor run -p benchmark/tasks/S14-link-install-lock-trap -a oracle`, expected 1.0.
- See `instruction.md` for the brief, `solution/SOLUTION.md` for the reference answer
