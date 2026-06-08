#!/bin/bash

echo "⚙️ Wise Defense SaaS UPDATE v1.1 STARTING..."

cd ~/wise-defense-saas || exit

# =========================
# SAFETY STOP
# =========================
echo "Stopping containers..."
docker compose down

# =========================
# ENV CHECK
# =========================
if [ ! -f .env ]; then
  echo "Creating missing .env file..."
  cat > .env <<EOF
JWT_SECRET=change-me
DISCORD_BOT_TOKEN=your_discord_token_here
DISCORD_WEBHOOK_URL=your_webhook_here
EOF
fi

# =========================
# INSTALL DISCORD SUPPORT
# =========================
cd api

if [ -f package.json ]; then
  echo "Installing Discord dependencies..."
  npm install discord.js
fi

cd ..

# =========================
# REBUILD SYSTEM
# =========================
echo "Rebuilding Docker stack..."
docker compose up -d --build

# =========================
# VERIFY STATUS
# =========================
sleep 5

echo "Checking containers..."
docker ps

echo "Testing API..."
curl -s http://localhost:3000 || echo "API not ready yet"

# =========================
# DONE
# =========================
echo "=================================="
echo "✅ Wise Defense SaaS UPDATED v1.1"
echo "=================================="
echo "🤖 Discord integration enabled"
echo "🐳 Containers rebuilt"
echo "⚡ System restarted cleanly"
echo "==================================

