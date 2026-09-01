# S8 Release-engineering diagnosis (reference answer)

## Attempt-1: the pinned tag does not exist on the public mirror

The README pinned `#v0.9.5`, but the mirror's tag listing (`ls-remote-tags.txt`) contains
only v0.1.0–v0.9.1 and v0.9.7 — **v0.9.5 was never distributed to the mirror**, so pnpm's git
resolver correctly reports "Could not resolve v0.9.5 to a commit". The consumer's command and
network were fine: the release sync script (`sync-script.sh`) pushes branches only
(`git push --force-with-lease <remote> HEAD:main`) and **never pushes tags**, so documented
versions can silently miss every public mirror.

## Attempt-2: forward-incompatible plugin version on an older runtime

`#v0.9.7` resolves and installs, then the slot entry crashes with
`TypeError: useConversation is not a function`. Per the compatibility table, v0.9.7 was built
against the **dsh 0.1.2-alpha.1** client API; the consumer's runtime is **0.1.1-rc.2**
(`dsh-version.txt`) — an older, forward-incompatible contract whose
`conversation.input.dock` props do not include the `useConversation` seat the plugin reads.
The crash is the version-routing failure, not a plugin bug.

## Remedy for the consumer right now

The consumer's runtime cannot be upgraded (production freeze), so the working target is the
**rc-compatible version v0.9.3** — the last release verified against 0.1.1-rc.1 (rc.2 adds
only image preprocessing, so rc.1-verified plugins work).

The mirror's tag listing shows **v0.9.3 is not on the public mirror either** — the same
tag-distribution defect as v0.9.5 — so the install only works once the tag is distributed.
The working sequence is:

1. Maintainer: push the missing tag to the public mirror —
   `git push public v0.9.3` (or `git push public --tags` to catch every missed release);
2. Consumer: then install the rc-compatible tag:

   ```
   dsh plugin --profile web add '@org/dsh-ui-progress@github:public-org/dsh-ui-progress#v0.9.3'
   ```

If the consumer cannot wait for the tag push, the immediate unblock is to pin the full
commit SHA of v0.9.3 (`...#<sha>`), which resolves even without tags. As with any
plain-dependency install, the plugin still needs its `insert` row in the profile's
`cordis.patch.yml` to activate.

## Maintainer-side fix (so both defects cannot recur)

1. **Tag distribution**: the release/sync tooling must push tags to every mirror — append
   `git push <remote> --tags` (non-forced) after each branch push; a documented version that
   cannot resolve is a release defect.
2. **Version routing**: the README must route installs by the consumer's DSH version — a
   top-of-README matrix ("DSH 0.1.1-rc.2 → v0.9.3; DSH 0.1.2-alpha.x → v0.9.7") with a
   self-check symptom ("a wrong pick crashes: useConversation is not a function"), instead of
   a single default command.

See profile-dependency-management.md §8 (version routing) and §9 (tag sync) for the durable
recipes.
