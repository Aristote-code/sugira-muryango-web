#!/bin/sh
# Everything that must be true before this site is committed or deployed.
# Pass a directory to check files on disk (default: the repo root).
# The pre-commit hook passes a directory holding the *staged* content instead,
# because the thing that broke production was a file that was fine on disk a
# second later but half-written at the moment it was staged.
set -u
DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
HERE=$(cd "$(dirname "$0")" && pwd)
fail=0

# Every script the site ships, not just app.js. filters.js was added to the
# deploy allowlist without being added here, which would have let a syntax
# error in it reach production with every check reporting green.
for js in "$DIR"/*.js; do
  [ -f "$js" ] || continue
  name=$(basename "$js")
  if node --check "$js" 2>/tmp/cu-node-err; then
    echo "  $name: parses"
  else
    echo "  $name: SYNTAX ERROR — this would deploy a dead site"
    sed 's/^/      /' /tmp/cu-node-err
    fail=1
  fi
done

# A script the page loads but the deploy does not ship is a 404 at runtime.
if [ -f "$DIR/index.html" ] && [ -f "$DIR/deploy.sh" ]; then
  for src in $(grep -o '<script src="[^"]*"' "$DIR/index.html" | sed 's/.*src="//;s/"//'); do
    case "$src" in http*) continue ;; esac
    if ! grep -q "$src" "$DIR/deploy.sh"; then
      echo "  $src: loaded by index.html but missing from the deploy allowlist"
      fail=1
    fi
  done
fi

if [ -f "$DIR/style.css" ]; then
  python3 "$HERE/audit-tokens.py" "$DIR/style.css" || fail=1
fi

if [ -f "$DIR/index.html" ]; then
  # every <use> must point at a symbol that exists in the sprite
  missing=$(python3 - "$DIR/index.html" <<'PY'
import re, sys
h = open(sys.argv[1], encoding="utf-8").read()
have = set(re.findall(r'<symbol id="([^"]+)"', h))
want = set(re.findall(r'<use href="#([^"]+)"', h))
print(",".join(sorted(want - have)))
PY
)
  if [ -n "$missing" ]; then
    echo "  icons: missing symbols -> $missing"
    fail=1
  else
    echo "  icons: every <use> resolves"
  fi
fi

[ "$fail" -eq 0 ] && echo "  all checks passed" || echo "  CHECKS FAILED"
exit "$fail"
