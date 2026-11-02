#!/bin/sh
# Forwarder. The real script is ../deploy.sh at the repository root.
#
# This path used to hold a second deploy script that ran `netlify deploy --dir .`,
# which ships the working tree — including whatever another session has
# half-written. Several of us edit this repo at once, so that is a live hazard
# and not a theoretical one. It is kept as a forwarder rather than deleted
# because it sits beside check.sh, so it is the one people reach for.
set -eu
root=$(git rev-parse --show-toplevel)
exec "$root/deploy.sh" "$@"
