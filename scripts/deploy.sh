#!/bin/bash
# Wise Defense Deployment Script
# Usage: ./scripts/deploy.sh [--no-cache] [--health-check-only]

set -e

REPO_DIR="/home/ubuntu/dev/wise-defense-saas/wise-defense-saas/wise-defense-saas"
NO_CACHE=false
HEALTH_CHECK_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-cache) NO_CACHE=true; shift ;;
    --health-check-only) HEALTH_CHECK_ONLY=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo "🚀 Wise Defense Deployment"
echo "=========================="

if [ "$HEALTH_CHECK_ONLY" = true ]; then
  echo "📊 Running health checks only..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
  TITLE=$(curl -s http://localhost:3001/ | grep -oiE '<title>[^<]*</title>' | head -1)

  echo "HTTP Code: $HTTP_CODE"
  echo "Title: $TITLE"

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed"
    exit 0
  else
    echo "❌ Health check failed"
    exit 1
  fi
fi

# Navigate to repo
cd "$REPO_DIR"
echo "📁 Working directory: $(pwd)"

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin
git merge --ff-only origin/main
echo "✅ Code updated"

# Stop and remove old dashboard
echo "🛑 Stopping old container..."
docker compose down dashboard 2>/dev/null || true
sleep 2

# Remove image to force rebuild
if [ "$NO_CACHE" = true ]; then
  echo "🗑️  Removing old image (no-cache mode)..."
  docker image rm wise-defense-saas-dashboard:latest 2>/dev/null || true
fi

# Rebuild and start
echo "🔨 Building new dashboard..."
docker compose up -d --build dashboard
echo "✅ Container started"

# Wait for health check to pass
echo "⏳ Waiting for container to be healthy..."
MAX_ATTEMPTS=12
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  sleep 5
  ATTEMPT=$((ATTEMPT + 1))

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Container healthy (HTTP 200)"
    break
  fi

  echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS - HTTP $HTTP_CODE"
done

# Final verification
echo "🔍 Final verification..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
TITLE=$(curl -s http://localhost:3001/ | grep -oiE '<title>[^<]*</title>' | head -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo ""
  echo "✅ DEPLOYMENT SUCCESSFUL"
  echo "========================"
  echo "HTTP Code: $HTTP_CODE"
  echo "Page Title: $TITLE"
  echo ""
  echo "🌐 Live at: https://wisedefense.store/"
  exit 0
else
  echo ""
  echo "❌ DEPLOYMENT FAILED"
  echo "===================="
  echo "HTTP Code: $HTTP_CODE"
  echo ""
  echo "📋 Container logs:"
  docker compose logs --tail 30 dashboard
  exit 1
fi
