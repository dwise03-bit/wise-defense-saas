#!/bin/bash

set -e

echo "🚀 Starting deploy..."

cd ~/wise-defense-saas

echo "📦 Pulling latest code..."
git pull origin main

echo "🔨 Rebuilding containers..."
docker compose build

echo "🔄 Restarting services safely..."
docker compose up -d --remove-orphans

echo "🧹 Cleaning old containers..."
docker compose prune -f || true

echo "✅ Deploy complete"
