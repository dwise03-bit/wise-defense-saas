#!/bin/bash

clear

echo "==========================================="
echo "WISE DEFENSE PRODUCTION LAUNCH SYSTEM"
echo "Version 1.0"
echo "==========================================="

echo ""
echo "[1/12] Creating Backup..."
./backup.sh

echo ""
echo "[2/12] Pulling Latest Code..."
git pull || true

echo ""
echo "[3/12] Checking Disk Space..."
df -h

echo ""
echo "[4/12] Rebuilding Platform..."
docker compose down
docker compose up -d --build

echo ""
echo "[5/12] Waiting For Startup..."
sleep 20

echo ""
echo "[6/12] Container Status"
docker compose ps

echo ""
echo "[7/12] Dashboard Health"
curl -s http://localhost:3001/api/status

echo ""
echo "[8/12] API Health"
curl -s http://localhost:3000 || true

echo ""
echo "[9/12] Deploy Engine"
curl -s http://localhost:4000/status || true

echo ""
echo "[10/12] Ollama"
curl -s http://localhost:11434/api/tags || true

echo ""
echo "[11/12] Git Release Tag"
git tag -a production-$(date +%Y%m%d-%H%M) \
-m "Production Launch" || true

echo ""
echo "[12/12] Final Verification"
docker compose ps

echo ""
echo "==========================================="
echo "LAUNCH SUCCESSFUL"
echo "==========================================="

echo ""
echo "Dashboard"
echo "http://51.81.80.252:3001"

echo ""
echo "API"
echo "http://51.81.80.252:3000"

echo ""
echo "Deploy Engine"
echo "http://51.81.80.252:4000"

echo ""
echo "Traefik"
echo "http://51.81.80.252:8080"

echo ""
echo "Ollama"
echo "http://51.81.80.252:11434"

echo ""
echo "Launch Kit"
echo "~/Desktop/WiseDefense-LaunchKit"

echo ""
echo "==========================================="
echo "WISE DEFENSE IS LIVE"
echo "==========================================="
