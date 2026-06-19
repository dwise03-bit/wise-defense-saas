# Discord Control Bot Setup Guide

The Discord Control Bot provides real-time monitoring and control of the agent fleet directly from Discord.

## Features

✅ **Fleet Monitoring** - Real-time status of all agents  
✅ **Remote Control** - Start/stop/restart agents from Discord  
✅ **Health Reports** - System health summaries  
✅ **Log Viewing** - Stream agent logs to Discord  
✅ **Interactive Buttons** - Quick refresh and mass restart  
✅ **Slash Commands** - Clean, modern command interface  

## Setup Instructions

### Step 1: Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Wise Defense Control Bot"
4. Go to "Bot" section → "Add Bot"
5. Under TOKEN, click "Copy"
6. Save this token as `DISCORD_CONTROL_BOT_TOKEN` in your `.env` file

### Step 2: Configure Bot Permissions

In Discord Developer Portal, go to "OAuth2" → "URL Generator":

**Select scopes:**
- `applications.commands`
- `bot`

**Select permissions:**
- Send Messages
- Embed Links
- Read Message History
- Use Slash Commands
- Manage Messages

Copy the generated URL and open it to invite the bot to your server.

### Step 3: Get Guild ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click your server → "Copy Server ID"
3. Save this as `DISCORD_GUILD_ID` in your `.env` file

### Step 4: Configure Environment

Add to your `.env` file:

```bash
DISCORD_CONTROL_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_guild_id_here
```

Or update your `.env.local` on the VPS:

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas
nano .env

# Add or update:
DISCORD_CONTROL_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_guild_id_here
```

### Step 5: Start the Bot

```bash
pm2 restart discord-control-bot
pm2 save
```

Verify it's running:

```bash
pm2 logs discord-control-bot
```

You should see:
```
[DISCORD-CONTROL] Bot logged in as YourBotName#1234
[DISCORD-CONTROL] Slash commands registered
```

## Commands

### `/bots status`
Display current status of all agents with:
- Agent name and ID
- Status (✅ online, ❌ errored, ⏸️ stopped)
- Memory and CPU usage
- Uptime and restart count

**Buttons:**
- 🔄 Refresh - Update status in real-time
- Restart All - Restart all agents at once

```
/bots status
```

### `/bots restart [bot]`
Restart one or all agents.

```
/bots restart                    # Restart all agents
/bots restart scheduler-agent    # Restart by name
/bots restart 1                  # Restart by ID
```

### `/bots start [bot]`
Start stopped agents.

```
/bots start                      # Start all agents
/bots start engagement-agent     # Start by name
/bots start 2                    # Start by ID
```

### `/bots stop [bot]`
Stop running agents.

```
/bots stop                       # Stop all agents
/bots stop social-media-agent    # Stop by name
/bots stop 3                     # Stop by ID
```

### `/bots logs <bot>`
View recent logs from an agent (last 10 lines).

```
/bots logs repair-agent
/bots logs 0
```

### `/health`
Show system health report:
- Database status
- Agent fleet health (online count)
- Overall system health

```
/health
```

## Usage Examples

### Monitor the Fleet

```
/bots status
```

Displays all agents with color-coded status. Use the "Refresh" button to update.

### Restart a Failed Agent

```
/bots logs repair-agent     # Check what went wrong
/bots restart repair-agent  # Restart it
/bots status                # Verify it came back online
```

### Emergency Stop

If an agent is misbehaving:

```
/bots stop discord-bot      # Stop the misbehaving agent
/bots logs discord-bot      # Check logs
/bots restart discord-bot   # Restart when ready
```

### Health Check

Get a quick system status:

```
/health
```

Shows database connectivity and agent fleet health.

## Troubleshooting

### Bot doesn't respond to commands

1. **Check if bot is running:**
   ```bash
   pm2 status | grep discord-control-bot
   ```

2. **Check logs for errors:**
   ```bash
   pm2 logs discord-control-bot --err
   ```

3. **Verify bot has permissions:**
   - Right-click bot in Discord → Member Settings
   - Check it has "Use Slash Commands" permission

4. **Verify guild ID:**
   ```bash
   echo $DISCORD_GUILD_ID
   # Should return your server's ID (18+ digits)
   ```

### Bot is offline

1. **Check Discord token:**
   ```bash
   echo $DISCORD_CONTROL_BOT_TOKEN
   # Should start with "MTk..." or similar
   ```

2. **Check for errors:**
   ```bash
   pm2 logs discord-control-bot
   ```

3. **Restart bot:**
   ```bash
   pm2 restart discord-control-bot
   ```

### Commands not appearing

1. **Re-register commands:**
   ```bash
   pm2 restart discord-control-bot
   ```

2. **Wait 1 minute** for Discord to sync

3. **Try in the correct server** (where bot has permissions)

## Production Deployment

### Memory Usage

The Discord Control Bot uses ~256 MB of memory by default.

Current fleet memory:
- repair-agent: 256 MB
- scheduler-agent: 512 MB
- engagement-agent: 512 MB
- social-media-agent: 512 MB
- discord-bot: 512 MB
- telegram-bot: 512 MB
- youtube-agent: 512 MB
- tiktok-agent: 512 MB
- **discord-control-bot: 256 MB** ← NEW
- **Total: ~3.6 GB**

### Auto-Restart

The bot is configured to auto-restart if:
- Process crashes
- Memory exceeds 256 MB
- Graceful shutdown signals received

### Monitoring

Monitor the bot via:

```bash
# Real-time logs
pm2 logs discord-control-bot

# Historical logs
tail -f logs/discord-control-bot.log

# Check status
pm2 status | grep discord-control-bot
```

### Backup

The bot does not store state — all data comes from:
- PM2 process list (current)
- Database health tables (historical)

No backups needed beyond regular database backups.

## Advanced Features

### Channel-Specific Alerts

Add optional Discord channel alerts by modifying the bot:

```javascript
// In discord-control-bot.js

async function alertChannel(message) {
  const channel = client.channels.cache.get(process.env.DISCORD_ALERT_CHANNEL);
  if (channel) {
    await channel.send(message);
  }
}

// Then use in auto-recovery
if (action === 'restart') {
  await alertChannel(`⚠️ Auto-restarted ${botName} - agent was in error state`);
}
```

### Custom Role Permissions

Restrict commands to specific roles:

```javascript
// Check user role
const hasAdminRole = interaction.member.roles.cache.has(process.env.DISCORD_ADMIN_ROLE_ID);
if (!hasAdminRole) {
  return interaction.editReply('❌ Only admins can control agents');
}
```

## Support

For issues:

1. Check logs: `pm2 logs discord-control-bot`
2. Verify environment variables are set
3. Ensure bot has proper Discord permissions
4. Restart bot: `pm2 restart discord-control-bot`

## Environment Variables Reference

```bash
# Required
DISCORD_CONTROL_BOT_TOKEN        # Bot token from Discord Developer Portal
DISCORD_GUILD_ID                 # Server ID where bot operates

# Optional
DATABASE_URL                     # PostgreSQL connection (auto-detected)
```
