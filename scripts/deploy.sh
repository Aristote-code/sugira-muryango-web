#!/bin/sh
# Deploy, but only if the site is sound.
#
# `netlify deploy --dir .` skips the build step, so netlify.toml cannot guard it:
# whatever is in the folder goes live as-is. That is how a half-written app.js
# reached production once. Use this instead of calling netlify directly.
set -eu
root=$(git rev-parse --show-toplevel)
cd "$root"

echo "Checking before deploy"
if ! sh scripts/check.sh "$root"; then
  echo ""
  echo "Deploy aborted — the site would be broken."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo ""
  echo "Note: the working tree has uncommitted changes. Deploying them anyway:"
  git status --short | sed 's/^/      /'
fi

echo ""
netlify deploy --prod --dir . --message "${1:-Deploy}"
