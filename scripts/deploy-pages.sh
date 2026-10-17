#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ "$(git branch --show-current)" != "main" ] || [ -n "$(git status --porcelain)" ]; then
  echo "Commit all changes on main before deploying."
  exit 1
fi
npm test
git subtree split --prefix=www --branch=gh-pages
git push --atomic origin main gh-pages
gh api --method POST repos/ManojRaga/afterglow-market/pages/builds
echo "Publishing https://manojraga.github.io/afterglow-market/"
