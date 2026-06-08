#!/bin/bash

echo "♻️ Rolling back last stable state..."

docker compose down
docker compose up -d

echo "✅ Rollback complete"
