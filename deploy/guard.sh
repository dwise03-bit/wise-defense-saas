#!/bin/bash

if pgrep -f "node" > /dev/null; then
  echo "❌ RAW NODE PROCESS DETECTED - BLOCKING"
  exit 1
fi

echo "✅ SAFE"
