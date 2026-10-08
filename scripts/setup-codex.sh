#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node -e 'if (+process.versions.node.split(".")[0] !== 24) { console.error("Use Node.js 24, como na Vercel."); process.exit(1); }'
npm ci --no-audit --no-fund
npm test
printf '\nAmbiente pronto. Inicie com: npm run dev -- --hostname 0.0.0.0\n'
