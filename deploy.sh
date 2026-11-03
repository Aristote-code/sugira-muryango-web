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

allow_dirty=0
msg=""
for a in "$@"; do
  case "$a" in
    --allow-dirty) allow_dirty=1 ;;
    *) [ -z "$msg" ] && msg="$a" ;;
  esac
done
msg=${msg:-"Deploy $sha"}

# A dirty tree is refused, not noted.
#
# What this replaces was a note saying "these will NOT be deployed", which then
# carried on. It was accurate and it did not help: it prints at the very top of
# the output, where piping through `tail` removes it. Both deploys that went
# wrong on 2 Nov were silent in this same shape — a blocked commit left HEAD on
# an older revision, the export was a sound older tree, every check passed, and
# the live site quietly stayed behind. Nothing was broken. It just was not what
# anyone meant.
#
# If the edits really are unrelated to what is being shipped, say so.
if [ -n "$(git status --porcelain)" ]; then
  if [ "$allow_dirty" -eq 0 ]; then
    echo "deploy refused — the working tree has uncommitted changes:"
    git status --short | sed 's/^/      /'
    echo
    echo "  $sha would ship WITHOUT them."
    echo
    echo "  If you just made a commit and the pre-commit hook blocked it, this is"
    echo "  that: HEAD is still the commit before it. Fix the checks and commit,"
    echo "  or re-run with --allow-dirty if these edits are unrelated."
    exit 1
  fi
  echo "note: --allow-dirty — these stay out of the deploy:"
  git status --short | sed 's/^/      /'
  echo
fi

# Production only ever serves main, and only ever its tip.
#
# Each session works in its own worktree, so HEAD is that branch's tip, not
# main's. Being an *ancestor* of main is not enough: a HEAD sitting behind main
# is a perfectly valid commit that ships last week's site while every check
# passes. Require the exact commit.
git fetch -q origin main 2>/dev/null || true
remote=$(git rev-parse origin/main 2>/dev/null || true)
head=$(git rev-parse HEAD)

if [ -z "$remote" ]; then
  echo "deploy refused — cannot read origin/main, so there is nothing to check"
  echo "                 this deploy against."
  exit 1
fi

if [ "$head" != "$remote" ]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
  echo "deploy refused — $sha ($branch) is not the tip of origin/main."
  echo
  if git merge-base --is-ancestor "$head" "$remote" 2>/dev/null; then
    behind=$(git rev-list --count "$head..$remote")
    echo "  HEAD is $behind commit(s) behind main. Deploying it would put older"
    echo "  content live, and every check would pass while doing it."
    echo "  Merge origin/main, then deploy."
  else
    echo "  The live site only ever serves main. Merge this branch into main and"
    echo "  push it, then deploy from a checkout whose HEAD is on main."
  fi
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
site="index.html tokens.css app.js menu.js filters.js permissions.js places.js relations.js actions.js style.css logo.svg netlify.toml"
for f in $site; do
  if [ ! -e "$tmp/$f" ]; then
    echo "deploy aborted — $f is missing from $sha."
    exit 1
  fi
  cp "$tmp/$f" "$pub/$f"
done

# Stamp the build into the page. "I'm not seeing the changes" is otherwise
# unanswerable without opening devtools, and it was a fair question: the one
# thing nobody could check was which version was on screen.
stamp="$sha · $(date -u '+%d %b %H:%M') UTC"
if grep -q 'class="buildstamp"' "$pub/index.html"; then
  tmpfile=$(mktemp)
  sed "s|<p class=\"buildstamp\"\(.*\)>working copy</p>|<p class=\"buildstamp\"\1>$stamp</p>|" \
    "$pub/index.html" > "$tmpfile" && mv "$tmpfile" "$pub/index.html"
fi

# Version every asset URL with the commit.
#
# The headers already say must-revalidate, and the server is demonstrably
# serving the new files, yet a browser can still hold an old app.js or
# style.css against a fresh index.html — and the result looks exactly like a
# failed deploy. A URL that changes with the commit cannot be served from a
# cache entry made for a different one, so this removes the question rather
# than answering it. The filenames on disk are untouched; only the references
# in the published page carry ?v=.
# The delimiter is '#', not '|': the alternation below uses '|', and sed reads
# the first one as the end of the expression.
tmpfile=$(mktemp)
sed -E "s#(src|href)=\"(app\.js|menu\.js|filters\.js|actions\.js|style\.css|logo\.svg)\"#\1=\"\2?v=$sha\"#g" \
  "$pub/index.html" > "$tmpfile" && mv "$tmpfile" "$pub/index.html"
versioned=$(grep -o "?v=$sha" "$pub/index.html" | wc -l | tr -d ' ')
if [ "$versioned" -lt 4 ]; then
  echo "deploy aborted — only $versioned asset references were versioned, expected at least 4."
  exit 1
fi

echo "deploying $sha from a clean checkout:"
printf '      %s\n' $site
echo

# Only the production URL is printed. The per-deploy "unique deploy URL" that
# netlify also prints is a permanent snapshot of one build: open one of those
# and you keep seeing that version for ever, no matter how often this runs.
# Two of them had already been handed out that way.
netlify deploy --prod --dir "$pub" --message "$msg" \
  | grep -vi 'unique deploy url'

echo
echo "live at https://sugira-muryango.netlify.app  (build $sha)"
