#!/bin/bash
set -e

echo "=================================="
echo "WISE DEFENSE SAAS INSTALLER"
echo "=================================="

sudo apt update
sudo apt install -y git curl

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

sudo usermod -aG docker $USER || true

cd ~

if [ ! -d wise-defense-saas ]; then
  git clone git@github.com:dwise03-bit/wise-defense-saas.git
fi

cd wise-defense-saas

if [ ! -f .env ]; then
cat > .env <<EOF
POSTGRES_DB=wisedefense
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_ME
REDIS_URL=redis://redis:6379
EOF
fi

docker compose down --remove-orphans || true
docker compose up -d --build

echo
echo "=================================="
echo "INSTALL COMPLETE"
echo "=================================="
docker ps
