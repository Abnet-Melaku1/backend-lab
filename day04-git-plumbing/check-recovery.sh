#!/usr/bin/env bash
# check-recovery.sh: verify a repo still has all its important work.
# Usage: check-recovery.sh REPO_DIR
set -euo pipefail

REPO="${1:?Usage: check-recovery.sh REPO_DIR}"
fail=0

for n in 1 2 3 4; do
# for n in 1 2 3 4 = run the lines until "done" four times, with n = 1, then 2, 3, 4
  if git -C "$REPO" log main --format=%s | grep -qx "work $n"; then
  # log main --format=%s = list the message of every commit on main
  # grep -qx = -q quiet (just succeed or fail), -x match the WHOLE line exactly
    echo "✅ main has 'work $n'"
  else
    echo "❌ main is missing 'work $n'"; fail=1
  fi
done

if git -C "$REPO" rev-parse --verify -q refs/heads/feature-x > /dev/null; then
# rev-parse --verify -q = check quietly whether this branch exists
  echo "✅ branch feature-x exists"
else
  echo "❌ branch feature-x is missing"; fail=1
fi

exit $fail





















































