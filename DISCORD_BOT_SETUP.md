# Discord Content Bot Setup Guide

The Wise Defense Discord bot allows users to submit content directly from Discord, which automatically flows through the entire pipeline for approval, social media posting, and YouTube video generation.

## Bot Features

### Commands Available

```
/submit - Submit new content/article
  ├─ title: Article title (required)
  ├─ content: Article content/summary (required)
  ├─ source: Where you found it (optional)
  └─ url: Link to original content (optional)

/pending - View submissions awaiting approval

/approve <article_id> - Approve a submission for social media

/reject <article_id> - Reject a submission

/stats - View platform statistics
```

### Workflow

```
User in Discord: /submit title content
        ↓
Article added to database
        ↓
Posted to #approval-channel
        ↓
Admins: /approve <id>
        ↓
Marked as high-priority
        ↓
Auto-posted to Telegram/Discord
        ↓
YouTube video generated
        ↓
Published to all platforms
```

## Setup Instructions

### Step 1: Create Discord Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Wise Defense Bot"
4. Go to "Bot" tab → Click "Add Bot"
5. Under TOKEN, click "Copy" → Save this as `DISCORD_BOT_TOKEN`

### Step 2: Configure Bot Permissions

In the Developer Portal:

1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot`, `applications.commands`
3. Select permissions:
   - ✅ Send Messages
   - ✅ Read Messages/View Channels
   - ✅ Read Message History
   - ✅ Embed Links
   - ✅ Use Slash Commands
4. Copy generated URL and open it to add bot to your Discord server

### Step 3: Get Discord IDs

1. **Server ID (Guild ID):**
   - Enable Developer Mode in Discord (User Settings → Advanced)
   - Right-click your server → Copy Server ID
   - Save as `DISCORD_GUILD_ID`

2. **Channel ID (for approval channel):**
   - Right-click the channel (e.g., #approvals)
   - Copy Channel ID
   - Save as `DISCORD_APPROVAL_CHANNEL_ID`

### Step 4: Add to Environment

Update `.env` on the VPS:

```bash
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_APPROVAL_CHANNEL_ID=your_approval_channel_id_here
```

### Step 5: Restart Bot

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas/wise-defense-saas/dashboard
pm2 restart discord-content-bot
pm2 logs discord-content-bot
```

## Usage Examples

### Submit News Article

```
/submit
  title: "Federal Court Rules 2A Protections"
  content: "A federal appeals court has affirmed Second Amendment protections..."
  source: "Legal News Weekly"
  url: https://legalnews.com/article
```

**Result:** Article is added, posted to #approvals, and awaits approval.

### View Pending

```
/pending
```

**Result:** Shows all submissions waiting for approval with their IDs.

### Approve Content

```
/approve 15
```

**Result:** 
- Marks article as approved
- Creates high-priority review
- Auto-posts to Telegram/Discord
- Generates YouTube video
- Posts to social media

### Check Statistics

```
/stats
```

**Result:**
- Discord Submissions: 45
- Pending Approval: 3
- YouTube Videos: 12
- Posts Published: 287

## Integration with Pipeline

Once content is approved via `/approve`, it automatically:

1. ✅ Marked as high-priority
2. ✅ Queued for social media
3. ✅ Sent to YouTube video agent
4. ✅ Posted to Telegram/Discord
5. ✅ Tracked in analytics

## Troubleshooting

### Bot Not Responding to Commands

```bash
# Check bot status
pm2 status | grep discord-content-bot

# View logs
pm2 logs discord-content-bot

# Restart if needed
pm2 restart discord-content-bot
```

### Permission Denied Errors

Ensure the bot has these permissions in your Discord server:
- Send Messages
- Embed Links
- Use Slash Commands
- Read Message History

### Bot Offline

```bash
# Kill and restart
pm2 kill
pm2 start ecosystem.config.js

# Verify
pm2 status
```

## Production Checklist

- [ ] Bot token added to `.env`
- [ ] Guild ID configured
- [ ] Approval channel set up
- [ ] Bot invited to Discord server
- [ ] Bot permissions verified
- [ ] Test `/submit` command
- [ ] Test `/approve` command
- [ ] Verify posts appear on social media
- [ ] Monitor logs for 24 hours

## Security Notes

- 🔒 Never share your bot token
- 🔒 Store token in `.env` (never in code)
- 🔒 `.env` is in `.gitignore` and won't be committed
- 🔒 Only approved users should have `/approve` permission
- 🔒 Regular token rotation recommended

## Support

For issues or questions:
- Check logs: `pm2 logs discord-content-bot`
- Review this guide
- Check Discord Developer Portal permissions
- Verify environment variables are set
