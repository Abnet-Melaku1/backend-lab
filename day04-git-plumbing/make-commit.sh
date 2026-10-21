#!/usr/bin/env bash
# make-commit.sh: create a git commit using only plumbing commands.
# Usage: make-commit.sh REPO_DIR
set -euo pipefail

REPO="${1:?Usage: make-commit.sh REPO_DIR}"
mkdir -p "$REPO"
cd "$REPO"
git init -q -b main
# -q = quiet (don't print "Initialized empty Git repository")
# -b main = name the first branch "main"
git config commit.gpgsign false

echo "built by hand" > note.txt
BLOB=$(git hash-object -w note.txt)
git update-index --add --cacheinfo 100644 "$BLOB" note.txt
TREE=$(git write-tree)
COMMIT=$(echo "my first hand-made commit" | git commit-tree "$TREE")
git update-ref refs/heads/main "$COMMIT"

echo "$COMMIT"