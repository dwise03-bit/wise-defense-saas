#!/bin/bash

set -e

echo "===================================="
echo "🚀 Wise Defense SaaS AUTO DEPLOY"
echo "===================================="

cd "$(dirname "$0")"

echo "📦 Ensuring folders exist..."
mkdir -p api dashboard worker

# ----------------------------
# API Dockerfile
# ----------------------------
if [ ! -f api/Dockerfile ]; then
cat > api/Dockerfile <<'EOD'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install || true
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
EOD
echo "✔ API Dockerfile created"
fi

# ----------------------------
# DASHBOARD Dockerfile
# ----------------------------
if [ ! -f dashboard/Dockerfile ]; then
cat > dashboard/Dockerfile <<'EOD'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install || true
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOD
echo "✔ Dashboard Dockerfile created"
fi

# ----------------------------
# WORKER Dockerfile
# ----------------------------
if [ ! -f worker/Dockerfile ]; then
cat > worker/Dockerfile <<'EOD'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install || true
COPY . .
CMD ["node", "worker.js"]
EOD
echo "✔ Worker Dockerfile created"
fi

# ----------------------------
# DEPLOY STACK
# ----------------------------
echo "🔄 Restarting stack..."

docker compose down --remove-orphans || true
docker compose build || { echo "❌ Build failed"; exit 1; }
docker compose up -d

echo "⏳ Waiting..."
sleep 10

# ----------------------------
# HEALTH CHECK
# ----------------------------
echo "🔍 Checking API..."

if curl -s http://localhost:3000 >/dev/null; then
  echo "✅ API healthy"
else
  echo "❌ API failed → rollback"
  docker compose down
  docker compose up -d
  exit 1
fi

echo "===================================="
echo "🎉 DEPLOY COMPLETE"
echo "===================================="

docker ps
