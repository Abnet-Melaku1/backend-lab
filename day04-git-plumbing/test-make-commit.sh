#!/usr/bin/env bash
# test-make-commit.sh: check that make-commit.sh builds a real, valid commit.
set -euo pipefail
cd "$(dirname "$0")"

TMP=$(mktemp -d)
# mktemp -d = create a new, empty temporary folder with a unique name, and print its path
trap 'rm -rf "$TMP"' EXIT
# trap '...' EXIT = run this cleanup when the script ends, even if it fails,
# so the temporary folder is always deleted
fail=0

assert_eq() {
  if [ "$1" = "$2" ]; then echo "✅ $3"; else echo "❌ $3 (expected '$2', got '$1')"; fail=1; fi
}
# assert_eq ACTUAL EXPECTED DESCRIPTION = compare two values and print ✅ or ❌

./make-commit.sh "$TMP/repo" > /dev/null

assert_eq "$(git -C "$TMP/repo" log -1 --format=%s)" "my first hand-made commit" "commit message is correct"
# git -C DIR = run git as if you were inside DIR
# log -1 --format=%s = show only the latest commit's message
assert_eq "$(git -C "$TMP/repo" ls-tree --name-only HEAD)" "note.txt" "commit contains note.txt"
# ls-tree --name-only HEAD = list the file names inside the latest commit's tree
assert_eq "$(git -C "$TMP/repo" show HEAD:note.txt)" "built by hand" "note.txt has the right content"
assert_eq "$(git -C "$TMP/repo" status --porcelain)" "" "working tree is clean"
# status --porcelain = a short, machine-readable status; empty means nothing changed

if git -C "$TMP/repo" fsck --no-progress > /dev/null 2>&1; then echo "✅ repository passes git fsck"; else echo "❌ git fsck found problems"; fail=1; fi
# fsck = "file system check": git verifies every object and link in the database is valid

exit $fail