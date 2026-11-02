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

if [ -f "$DIR/app.js" ]; then
  if node --check "$DIR/app.js" 2>/tmp/cu-node-err; then
    echo "  app.js: parses"
  else
    echo "  app.js: SYNTAX ERROR — this would deploy a dead site"
    sed 's/^/      /' /tmp/cu-node-err
    fail=1
  fi
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
