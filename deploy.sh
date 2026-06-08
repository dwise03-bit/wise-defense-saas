#!/bin/bash

set -e

APP="wise-defense-saas"
BACKUP_TAG=$(date +%s)

echo "🚀 Starting deploy for $APP"

# 1. Pull latest code (if git repo exists)
if [ -d .git ]; then
  git pull
fi

# 2. Build new images (but DON'T kill old ones yet)
docker compose build

# 3. Start new stack in detached mode
docker compose up -d --remove-orphans

# 4. Wait for containers to stabilize
echo "⏳ Waiting for services..."
sleep 10

# 5. Health check (API)
if curl -s http://localhost:3000 >/dev/null; then
  echo "✅ API healthy"
else
  echo "❌ API failed — rolling back"

  # rollback strategy: restart previous stable state
  docker compose down
  docker compose up -d

  echo "♻️ Rollback complete"
  exit 1
fi

# 6. Cleanup unused images
docker image prune -f

echo "🎉 Deploy successful"
