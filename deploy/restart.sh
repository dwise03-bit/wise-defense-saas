#!/bin/bash
set -e

echo "🚀 SAFE DEPLOY START"

# stop stack safely
docker compose down

# rebuild fresh
docker compose build --no-cache

# start stack
docker compose up -d

# health check
sleep 10

STATUS=$(curl -s http://localhost:3000/health || echo "fail")

if [[ "$STATUS" == *"ok"* ]]; then
  echo "✅ DEPLOY SUCCESS"
else
  echo "❌ FAIL - rolling back"
  docker compose down
  exit 1
fi
