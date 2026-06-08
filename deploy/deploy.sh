#!/bin/bash
set -e

APP_DIR="/home/ubuntu/wise-defense-saas"
cd $APP_DIR

ACTIVE=$(cat deploy/active)
echo "🧠 Active version: $ACTIVE"

if [ "$ACTIVE" = "blue" ]; then
  NEW="green"
else
  NEW="blue"
fi

echo "🚀 Deploying NEW version: $NEW"

# BUILD NEW STACK
docker compose -f docker-compose.$NEW.yml build --no-cache

# START NEW STACK
docker compose -f docker-compose.$NEW.yml up -d

echo "⏳ Waiting for health check..."
sleep 10

# HEALTH CHECK
HEALTH=$(curl -s http://localhost:3000/health || echo "fail")

if [[ "$HEALTH" == *"ok"* ]]; then
  echo "✅ HEALTH OK → switching traffic"

  echo "$NEW" > deploy/active

  # stop old version
  docker compose -f docker-compose.$ACTIVE.yml down

  echo "🎉 DEPLOY SUCCESS ($NEW is now live)"
else
  echo "❌ HEALTH FAILED → rollback"

  docker compose -f docker-compose.$NEW.yml down

  exit 1
fi
