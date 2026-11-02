#!/bin/sh
# Forwarder. The real script is deploy.sh at the root of the MAIN checkout.
#
# This path used to hold a second deploy script that ran `netlify deploy --dir .`,
# which ships the working tree — including whatever another session has
# half-written. Several of us edit this repo at once, so that is a live hazard
# and not a theoretical one. It is kept as a forwarder rather than deleted
# because it sits beside check.sh, so it is the one people reach for.
#
# --show-toplevel would give the worktree's own root when run from a worktree,
# and so forward to that branch's copy of the script. --git-common-dir always
# points into the main checkout's .git, so this resolves to the one canonical
# script wherever it is run from.
set -eu
common=$(git rev-parse --path-format=absolute --git-common-dir)
root=$(dirname "$common")
exec "$root/deploy.sh" "$@"
