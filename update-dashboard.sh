#!/bin/bash
# Wise Defense Easy Dashboard Update Script
# Run from any location: ./update-dashboard.sh

set -e

# Server info
SERVER_IP=$(curl -s http://checkip.amazonaws.com || echo "unknown")

# Dashboard paths
DASHBOARD_PUBLIC=~/wise-defense-saas/dashboard-v2/public
LAUNCH_KIT=~/Desktop/WiseDefense-LaunchKit
BACKUP_DIR=~/wise-defense-backups/dashboard-assets-$(date +%Y%m%d_%H%M%S)

echo "==== Creating backup of old assets ===="
mkdir -p "$BACKUP_DIR"
cp -r $DASHBOARD_PUBLIC/branding "$BACKUP_DIR/"
cp -r $DASHBOARD_PUBLIC/dashboard-art "$BACKUP_DIR/"
cp -r $DASHBOARD_PUBLIC/mascot "$BACKUP_DIR/"
cp -r $DASHBOARD_PUBLIC/marketing "$BACKUP_DIR/"

echo "==== Copying new launch kit assets ===="
mkdir -p $DASHBOARD_PUBLIC/branding $DASHBOARD_PUBLIC/dashboard-art $DASHBOARD_PUBLIC/mascot $DASHBOARD_PUBLIC/marketing
cp -r $LAUNCH_KIT/Branding/* $DASHBOARD_PUBLIC/branding/
cp -r $LAUNCH_KIT/Dashboard-Art/* $DASHBOARD_PUBLIC/dashboard-art/
cp -r $LAUNCH_KIT/Mascot-Stickers/* $DASHBOARD_PUBLIC/mascot/
cp -r $LAUNCH_KIT/Marketing/* $DASHBOARD_PUBLIC/marketing/

echo "==== Rebuilding Dashboard Docker Container ===="
cd ~/wise-defense-saas
docker compose up -d --build dashboard

echo "==== Generating Release Note ===="
mkdir -p ~/wise-defense-backups/release-notes
cat > ~/wise-defense-backups/release-notes/dashboard-update-$(date +%Y%m%d_%H%M%S).txt <<EOF
Wise Defense Dashboard Update

Date: $(date)
Server IP: $SERVER_IP

Dashboard Container: rebuilt and running
Assets Updated:
- Branding
- Dashboard Art
- Mascot
- Marketing

Backup stored at: $BACKUP_DIR

EOF

echo "==== Update Complete! Dashboard should be live at http://$SERVER_IP:3001 ===="
