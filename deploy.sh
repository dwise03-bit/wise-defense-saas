#!/bin/bash
set -e

echo "🚀 DEPLOY START"

git fetch origin
git reset --hard origin/main

docker compose up -d --build

sleep 5

if curl -f http://localhost:3000 >/dev/null 2>&1; then
  echo "✅ HEALTH OK"
else
  echo "❌ FAILED → ROLLBACK"
  git reset --hard HEAD~1
  docker compose up -d --build
fi

echo "🎉 DEPLOY COMPLETE"
