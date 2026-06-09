#!/bin/bash

set -e

APP=~/wise-defense-saas
cd $APP

LOG=deploy/deploy.log
STATE=deploy/v5-state.json

mkdir -p deploy

echo "🚀 v5 worker started" | tee -a $LOG

# init state if missing
if [ ! -f $STATE ]; then
  echo '{"current":"blue","locked":false}' > $STATE
fi

while true; do

  LOCKED=$(cat $STATE | jq -r '.locked')

  if [ "$LOCKED" = "true" ]; then
    sleep 3
    continue
  fi

  JOB=$(docker exec wise-defense-saas-redis-1 redis-cli LPOP deploy_queue)

  if [ -z "$JOB" ]; then
    sleep 3
    continue
  fi

  echo "📦 Deploy job received: $JOB" | tee -a $LOG

  # LOCK
  jq '.locked=true' $STATE > tmp.json && mv tmp.json $STATE

  # PULL + BUILD
  git pull origin main >> $LOG 2>&1
  docker compose build >> $LOG 2>&1

  # START GREEN
  echo "🟢 Starting green stack..." | tee -a $LOG
  docker compose up -d api-green dashboard-green worker-green >> $LOG 2>&1

  sleep 8

  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

  if [ "$CODE" != "200" ]; then
    echo "❌ Canary failed" | tee -a $LOG
    docker compose stop api-green dashboard-green worker-green
    jq '.locked=false' $STATE > tmp.jsonc x && mv tmp.json $STATE
    continue
  fi

  OLD=$(cat $STATE | jq -r '.current')

  echo "🚀 Promoting green → live" | tee -a $LOG

  jq '.current="green" | .locked=false' $STATE > tmp.json && mv tmp.json $STATE

  docker compose stop api-$OLD dashboard-$OLD worker-$OLD || true

  echo "🎉 Deploy complete" | tee -a $LOG

done
