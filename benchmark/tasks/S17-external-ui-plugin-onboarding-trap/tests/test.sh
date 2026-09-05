#!/bin/bash
# Harbor verifier for S17: two stages.
#   Stage 1 (counter-example): a report that draws the WRONG conclusion (advises
#     against the cross-entry ctx.slots.inject wrap and/or the restart) must
#     score 0 — the judge rejects wrong-conclusion reports outright.
#   Stage 2 (oracle): the reference report must score 100.
# The judge itself always exits 0; the last stdout line is a 0-100 score JSON.
mkdir -p /logs/verifier /app/agent-output/S17-external-ui-plugin-onboarding-trap

# ── Stage 1: wrong-conclusion counter-example ────────────────────────────────
cat > /app/agent-output/S17-external-ui-plugin-onboarding-trap/report-wrong.md <<'EOF'
# Diagnosis

The combo failure means the ModuleLoader wrapper approach is the problem — do
NOT use slots.inject for the settings.section registration; register it
directly instead. Also there is no need to restart the host for plugin file
changes; the bundle reloads in place. Just re-add the insert row and reload
the browser tab.
EOF
node /tests/judge.mjs > /tmp/judge-wrong.out 2>&1
cat /tmp/judge-wrong.out
node -e '
const fs = require("node:fs");
const lines = fs.readFileSync("/tmp/judge-wrong.out", "utf8").trim().split("\n").filter(Boolean);
let score = 100;
for (let i = lines.length - 1; i >= 0; i -= 1) {
  try {
    const j = JSON.parse(lines[i]);
    if (typeof j.score === "number") { score = j.score; break }
  } catch {}
}
if (score > 20) {
  console.error("counter-example FAILED: wrong-conclusion report scored " + score + " (must be <= 20)");
  process.exit(1);
}
' || exit 1
rm -f /app/agent-output/S17-external-ui-plugin-onboarding-trap/report-wrong.md

# ── Stage 2: oracle ──────────────────────────────────────────────────────────
cp /solution/report.md /app/agent-output/S17-external-ui-plugin-onboarding-trap/report.md
node /tests/judge.mjs > /tmp/judge-oracle.out 2>&1
cat /tmp/judge-oracle.out
node -e '
const fs = require("node:fs");
const lines = fs.readFileSync("/tmp/judge-oracle.out", "utf8").trim().split("\n").filter(Boolean);
let score = 0;
for (let i = lines.length - 1; i >= 0; i -= 1) {
  try {
    const j = JSON.parse(lines[i]);
    if (typeof j.score === "number" && typeof j.max === "number") { score = j.score; break }
  } catch {}
}
const reward = Math.max(0, Math.min(1, score / 100));
fs.writeFileSync("/logs/verifier/reward.txt", String(reward) + "\n")
'