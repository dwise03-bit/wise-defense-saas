#!/bin/bash

echo "=================================="
echo "WISE DEFENSE MASTER UPDATE"
echo "=================================="

echo ""
echo "[1/8] Pulling latest code..."
git pull

echo ""
echo "[2/8] Cleaning Docker cache..."
docker image prune -a -f
docker builder prune -a -f

echo ""
echo "[3/8] Rebuilding stack..."
docker compose down
docker compose up -d --build

echo ""
echo "[4/8] Waiting for services..."
sleep 15

echo ""
echo "[5/8] Docker Status"
docker compose ps

echo ""
echo "[6/8] API Test"
curl -s http://localhost:3000 || true

echo ""
echo "[7/8] Dashboard Status"
curl -s http://localhost:3001/api/status || true

echo ""
echo "[8/8] Disk Usage"
df -h

echo ""
echo "=================================="
echo "UPDATE COMPLETE"
echo "=================================="
echo ""
echo "Dashboard:"
echo "http://51.81.80.252:3001"
echo ""
echo "API:"
echo "http://51.81.80.252:3000"
echo ""
echo "Deploy Engine:"
echo "http://51.81.80.252:4000"
echo ""
echo "Traefik:"
echo "http://51.81.80.252:8080"
echo ""
echo "Ollama:"
echo "http://51.81.80.252:11434"
echo ""
