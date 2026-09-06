#!/usr/bin/env bash
set -euo pipefail
VERSION="${1:?version is required}"
export SONARIS_VERSION="$VERSION"
npm run package:linux
node scripts/normalize-artifact.js linux "$VERSION"
