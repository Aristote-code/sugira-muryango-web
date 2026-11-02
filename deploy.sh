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

# Production only ever serves main. Each session now works in its own worktree,
# and `git rev-parse HEAD` inside one is that branch's tip, not main's — so
# without this guard a session could put its own unmerged branch live from its
# own checkout, and the deploy would look perfectly clean while doing it. This
# rule used to live in an agreement between sessions; it belongs in the script.
git fetch -q origin main 2>/dev/null || true
if ! git merge-base --is-ancestor HEAD origin/main 2>/dev/null; then
  echo "deploy refused — $sha ($(git rev-parse --abbrev-ref HEAD)) is not on origin/main."
  echo
  echo "  The live site only ever serves main. Merge this branch into main and push"
  echo "  it, then deploy from a checkout whose HEAD is on main."
  exit 1
fi

tmp=$(mktemp -d)
pub=$(mktemp -d)
cleanup() { git worktree remove --force "$tmp" >/dev/null 2>&1 || true; rm -rf "$tmp" "$pub"; }
trap cleanup EXIT

git worktree add -q --detach "$tmp" HEAD

# Check what is about to ship, not what happens to be on disk. The pre-commit
# hook validates a commit as it is made, but `git commit --no-verify` slips past
# it, so the exported tree gets checked too.
if ! sh "$tmp/scripts/check.sh" "$tmp"; then
  echo
  echo "deploy aborted — $sha would put a broken site live."
  exit 1
fi

# The site, named explicitly. This is an allowlist rather than a list of files
# to delete, because the repository also holds build tooling, git hooks and this
# script. With a blocklist every tool file added later ships until someone
# remembers to exclude it — which is how scripts/check.sh and
# scripts/audit-tokens.py came to be served from the live site. Forgetting to
# add an asset here fails loudly the first time a page is opened; forgetting to
# delete one fails silently, in public.
site="index.html app.js style.css logo.svg netlify.toml"
for f in $site; do
  if [ ! -e "$tmp/$f" ]; then
    echo "deploy aborted — $f is missing from $sha."
    exit 1
  fi
  cp "$tmp/$f" "$pub/$f"
done

echo "deploying $sha from a clean checkout:"
printf '      %s\n' $site
netlify deploy --prod --dir "$pub" --message "$msg"
