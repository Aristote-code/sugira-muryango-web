#!/usr/bin/env bash
# Deploy exactly what is committed, never the working tree.
#
# Two sessions edit this folder, so `netlify deploy --dir .` can ship whatever the
# other one has half-written. This checks out HEAD into a throwaway worktree and
# deploys that, so the live site always matches a commit you can point at.
#
#   ./deploy.sh "optional message"

set -euo pipefail
cd "$(dirname "$0")"

sha=$(git rev-parse --short HEAD)
msg=${1:-"Deploy $sha"}

if [ -n "$(git status --porcelain)" ]; then
  echo "note: uncommitted changes in the working tree — they will NOT be deployed:"
  git status --short | sed 's/^/      /'
  echo
fi

if ! git merge-base --is-ancestor HEAD "origin/$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null; then
  echo "warning: HEAD is not on the remote yet. Push first if you want the live site"
  echo "         to match what is on GitHub."
  echo
fi

tmp=$(mktemp -d)
cleanup() { git worktree remove --force "$tmp" >/dev/null 2>&1 || true; rm -rf "$tmp"; }
trap cleanup EXIT

git worktree add -q --detach "$tmp" HEAD
echo "deploying $sha from a clean checkout"
netlify deploy --prod --dir "$tmp" --message "$msg"
