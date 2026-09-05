FROM node:24-bookworm

# git for the judge's tamper baseline (tracked files include node_modules).
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY fixture /app/fixture

# Exact pinned first-party closure: the alpha.5 storage packages the fixture
# migrates TO. Installed at build time from the committed lockfile; the agent
# phase needs no network for the migration itself.
RUN cd /app/fixture && npm ci --no-audit --no-fund

# Baseline commit + pinned HEAD: the judge rejects any tracked modification
# outside fixture/src/ (and fixture/package.json, whose dependency edits are
# scanned instead of trusted) and any history rewrite. Keep the anchor outside
# the agent workspace; a missing or altered verifier anchor is a hard failure.
RUN git init -q && git add -A && git -c user.email=bench@local -c user.name=bench commit -q -m "baseline" \
    && mkdir -p /opt/h23-verifier \
    && git rev-parse HEAD > /opt/h23-verifier/baseline.sha \
    && chmod 444 /opt/h23-verifier/baseline.sha
