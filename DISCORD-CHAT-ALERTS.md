# Discord Chat Alerts

## 🎯 Overview

The chat system now sends real-time Discord notifications for important chat events. Staff can monitor chat activity, user engagement, and issues directly in Discord.

---

## 📢 Alert Types

### 1. 💬 New Conversation
**When:** User starts a new chat session
**Shows:** User ID, channel, conversation ID
**Color:** Blue

```
💬 New Chat Conversation
User started a new chat session

User ID: guest
Channel: web
Conversation ID: 1234567890
Time: 2:45:30 PM
```

### 2. 🚨 Escalation Alert
**When:** User sends 2+ frustrated messages
**Shows:** Frustration score (%), user message
**Color:** Red (urgent)
**Action:** Staff should reach out within 2 hours

```
🚨 Chat Escalation Alert
User showing signs of frustration

User ID: user123
Frustration Score: 82%
Conversation ID: 1234567890
Last Message: I'm angry! This doesn't work!!!
```

### 3. ⭐ High-Priority Message
**When:** User mentions: booking, payment, refund, urgent, help, emergency
**Shows:** Topic, user message, conversation ID
**Color:** Yellow

```
⭐ High Priority Message
User asked about something important

Topic: booking
User ID: guest
Message: I need to book a session urgently for tomorrow
Conversation ID: 1234567890
```

### 4. 📅 Quick Reply Action
**When:** User clicks a button (Book, Pricing, Contact, etc.)
**Shows:** Action taken, button label
**Color:** Orange
**Emoji:** 📅 (booking), 💰 (pricing), ☎️ (contact), etc.

```
📅 Quick Reply Action
User clicked: 📅 Book a Session

Action: booking
Button: 📅 Book a Session
Conversation ID: 1234567890
Time: 2:46:15 PM
```

---

## 🔧 Setup

### 1. Ensure Discord Webhook is Set

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/wise-defense-saas

# Check webhook URL
grep DISCORD_ALERTS_WEBHOOK_URL .env

# If not set, add it
echo "DISCORD_ALERTS_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN" >> dashboard/.env.local
```

### 2. Create Discord Channel (Optional)

In your Discord server:
1. Create new channel: `#chat-alerts`
2. Create webhook in that channel
3. Copy webhook URL
4. Add to `.env` as shown above

### 3. Rebuild Dashboard

```bash
docker compose up --build -d dashboard

# Verify
docker compose logs -f dashboard | grep -i discord
```

---

## 📊 Alert Channels

**Primary Channel:** `DISCORD_ALERTS_WEBHOOK_URL`
- New conversations
- Quick reply actions
- High-priority messages

**Escalation Channel:** `DISCORD_APPROVAL_WEBHOOK_URL` (fallback)
- Frustrated user escalations
- Requires immediate action

**Fallback Channel:** `DISCORD_NEWS_WEBHOOK_URL`
- Used if primary webhooks not configured

### Multi-Channel Setup (Recommended)

```bash
# Chat alerts to #chat-alerts
DISCORD_ALERTS_WEBHOOK_URL=https://discord.com/api/webhooks/ABC123/XYZ789

# Escalations to #urgent or #escalations
DISCORD_APPROVAL_WEBHOOK_URL=https://discord.com/api/webhooks/DEF456/UVW321

# News to #updates (fallback)
DISCORD_NEWS_WEBHOOK_URL=https://discord.com/api/webhooks/GHI789/RST654
```

---

## 📈 What Gets Tracked

### New Conversation Alert
- ✅ User ID (guest or authenticated)
- ✅ Channel (web/discord/telegram)
- ✅ Conversation ID (for follow-up)
- ✅ Timestamp

### Escalation Alert
- ✅ Frustration score (0-100%)
- ✅ User message (first 200 chars)
- ✅ User ID
- ✅ Conversation ID

### High-Priority Alert
- ✅ Topic detected (booking/payment/help/etc)
- ✅ Full user message (first 150 chars)
- ✅ User ID
- ✅ Conversation ID

### Quick Reply Alert
- ✅ Action (booking/pricing/contact/etc)
- ✅ Button label
- ✅ Conversation ID
- ✅ Timestamp

---

## 🎯 Use Cases

### 1. Support Team Monitoring
```
Slack Integration → Discord → Ops team
├─ New chat? → "Let's get on it"
├─ Escalation? → "High priority!"
├─ High-priority? → "Customer needs booking"
└─ Quick reply? → "User interested in pricing"
```

### 2. Sales Insights
```
Monitor quick reply actions
├─ 📅 Book clicks → Hot leads
├─ 💰 Pricing clicks → Price-sensitive
└─ ☎️ Contact clicks → Needs personal touch
```

### 3. Customer Success
```
Track escalations
├─ Frustrated users → Reach out
├─ Booking questions → Follow-up
└─ Refund requests → Immediate action
```

---

## 📱 Discord Bot Integration

### Optional: Create Discord Bot

For richer features, create a dedicated Discord bot:

```bash
# In Discord Developer Portal:
1. Create Application → "Wise Defense Chat Bot"
2. Create Bot user
3. Copy bot token
4. Add to .env: DISCORD_BOT_TOKEN=<token>
5. Set permissions: Send Messages, Embed Links, Read History
6. Add bot to server: oauth2/authorize?client_id=<id>&scope=bot
```

### Bot Features (Future)

- React to alerts with ✅/❌
- Reply to alerts directly in Discord
- Mention @support-team on escalations
- Daily summary at 9 AM
- Conversation stats per hour

---

## 🔍 Monitoring Alerts

### Discord Search

```
Filter by type:
- New conversation: "New Chat Conversation"
- Escalation: "🚨 Escalation"
- High priority: "⭐ High Priority"
- Quick reply: "Quick Reply Action"

Filter by date:
- Today: after:2025-06-21
- Last week: after:2025-06-14
```

### Alert Response Time

**Recommended:**
- Escalations: < 30 minutes
- High-priority: < 1 hour
- Quick replies: informational, no action needed

---

## 📊 Analytics from Alerts

### Questions You Can Answer

**Daily:**
- How many new conversations started?
- How many escalations today?
- Which buttons are most clicked?

**Weekly:**
- Conversation volume trend?
- Escalation rate?
- Top high-priority topics?

**Monthly:**
- Chat usage growth?
- User satisfaction (via quick replies)?
- Support load?

### Sample Query (PostgreSQL)

```sql
-- New conversations per day
SELECT DATE(created_at), COUNT(*) as new_convos
FROM conversations
WHERE status = 'active'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- Escalation rate
SELECT 
  (COUNT(CASE WHEN status = 'escalated' THEN 1 END)::float / COUNT(*)) * 100 as escalation_rate
FROM conversations;

-- Quick reply clicks (from Discord alerts)
SELECT COUNT(*) as total_actions
FROM discord_alerts
WHERE type = 'quick_reply';
```

---

## 🐛 Troubleshooting

### Alerts Not Appearing

**Problem:** Discord alerts not showing
**Solutions:**
1. Check webhook URL is correct: `grep DISCORD_ALERTS_WEBHOOK_URL .env`
2. Verify webhook still exists (check Discord channel)
3. Check logs: `docker compose logs dashboard | grep "ALERT\|Discord"`
4. Verify bot has Send Messages permission
5. Try sending manual test alert via API

**Manual Test:**
```bash
curl -X POST https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"content":"Test alert from Wise Defense chat"}'
```

### Wrong Channel

**Problem:** Alerts going to wrong Discord channel
**Solutions:**
1. Check webhook URL points to right channel
2. Update URL: `sed -i 's|OLD_URL|NEW_URL|g' .env`
3. Rebuild: `docker compose up --build -d dashboard`

### Rate Limiting

**Problem:** Discord says "Too many requests"
**Solutions:**
1. Space out alerts with delays
2. Batch alerts (coming soon)
3. Use different webhooks for different types

---

## 🔐 Privacy & Security

- ✅ No PII in alerts (only User ID)
- ✅ Message preview only (first 150 chars)
- ✅ Webhook URLs stored in .env (not in code)
- ✅ Discord endpoint validates requests
- ✅ No audio/file uploads sent

### Data Retention

Discord keeps alerts for:
- 1 day (message cache)
- 30 days (searchable)
- Forever (pinned messages)

---

## 🚀 Deployment Checklist

- [ ] Discord webhook URL set in `.env`
- [ ] Bot has permissions: Send Messages, Embed Links
- [ ] Dashboard rebuilt: `docker compose up --build -d dashboard`
- [ ] Logs show no errors: `docker compose logs dashboard | grep -i error`
- [ ] Manual test alert sent successfully
- [ ] Alerts appearing in Discord channel
- [ ] Team knows about alerts and responds

---

## 📞 Support

### Common Questions

**Q: Can I customize alert messages?**
A: Yes, edit `sendDiscordAlert()` function in `dashboard/app/api/chat/route.ts`

**Q: Can I add more alert types?**
A: Yes, add new `type` case to `sendDiscordAlert()` with custom embed

**Q: How often do alerts send?**
A: Real-time (within 100ms of event)

**Q: Can I mute certain alert types?**
A: Yes, comment out `sendDiscordAlert()` calls in code

**Q: Does this use Discord API quota?**
A: No, webhooks have unlimited requests (but Discord may rate-limit)

---

## 🎯 Next Steps

**Coming Soon:**
- [ ] Daily summary report at 9 AM
- [ ] Alert filtering in Discord (emoji reactions)
- [ ] Conversation replay in Discord
- [ ] User profile lookup from alert
- [ ] Batch alerts to reduce noise
- [ ] Custom alert rules (e.g., only show frustration > 80%)
