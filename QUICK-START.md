# 🚀 Wise Defense Platform - Complete Quick Start Guide

**Everything is built. Now deploy it in 30 minutes.**

---

## 📋 What You Have

A **complete SaaS platform** with:

✅ **30+ Features** - All core functionality  
✅ **10 Autonomous Agents** - 24/7 automation  
✅ **AI Customer Service** - Zero API costs  
✅ **Admin Dashboards** - Real-time management  
✅ **Multi-Channel Support** - Web, Discord, Telegram  
✅ **Auto-Recovery System** - Self-healing infrastructure  

---

## ⚡ Quick Deploy (30 minutes)

### **Prerequisites** (check these first)

```bash
# SSH to VPS
ssh ubuntu@51.81.80.252

# Verify Docker is installed
docker --version
# Should output: Docker version 20.10+

# Verify PostgreSQL is running
psql -U postgres -d wise_defense -c "SELECT 1"
# Should output: (1 row) 1

# Verify git is synced
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas
git status
# Should show: On branch main, nothing to commit
```

### **Step 1: Deploy Core Platform** (5 minutes)

```bash
# SSH to VPS
ssh ubuntu@51.81.80.252
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas

# Pull latest code
git pull origin main

# Create database tables
psql "$DATABASE_URL" << 'SQL'
-- Run all migrations
\i migrations/001-schema.sql
\i migrations/002-bookings.sql
\i migrations/003-gamification.sql
\i migrations/004-analytics.sql
\i migrations/005-repair-agent.sql
\i migrations/006-ai-assistant.sql
SQL

# Rebuild dashboard container
docker compose build --no-cache dashboard

# Restart all services
docker compose restart

# Wait for startup
sleep 10

# Verify dashboard is running
curl -s http://localhost:3001 | grep -q "Wise Defense" && echo "✅ Dashboard online"
```

### **Step 2: Deploy Hybrid AI** (5 minutes)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sleep 3

# Download Mistral model (takes 2-3 minutes)
ollama pull mistral

# Verify Ollama is working
curl -s http://localhost:11434/api/tags | grep -q mistral && echo "✅ Ollama ready"
```

### **Step 3: Setup Discord Control Bot** (10 minutes)

```bash
# Get credentials (you'll need these)
# 1. Go to https://discord.com/developers/applications
# 2. Create "New Application"
# 3. Go to "Bot" → "Add Bot" → Copy TOKEN
# 4. Save as DISCORD_CONTROL_BOT_TOKEN

# Set environment variables
ssh ubuntu@51.81.80.252
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas

# Edit .env file
nano .env

# Add these lines:
# DISCORD_CONTROL_BOT_TOKEN=your_token_here
# DISCORD_GUILD_ID=your_server_id_here

# Start Discord bot
pm2 restart discord-control-bot
pm2 save
pm2 logs discord-control-bot
# Should show: "[DISCORD-CONTROL] Bot logged in as YourBot#1234"
```

### **Step 4: Start Agent Fleet** (5 minutes)

```bash
# Kill existing PM2 processes
pm2 kill

# Start all agents
pm2 start ecosystem.config.js

# Verify all agents are online
pm2 status
# Should show 10 agents, all with status "online"

# Save configuration
pm2 save

# View logs
pm2 logs
# Should show all agents starting up
```

### **Step 5: Verify Deployment** (5 minutes)

```bash
# Test dashboard
curl -s http://51.81.80.252:3001 | grep -q "Wise Defense" && echo "✅ Dashboard"

# Test API
curl -s http://51.81.80.252:3001/api/health | jq . && echo "✅ API"

# Test PM2 agents
pm2 status | grep -q "online" && echo "✅ Agents"

# Test Ollama
curl -s http://localhost:11434/api/tags | jq . && echo "✅ AI"

# Test Discord
pm2 logs discord-control-bot | grep -q "logged in" && echo "✅ Discord Bot"
```

---

## 🌐 Accessing Your Platform

### **User Access**

```
🏠 Homepage:         http://51.81.80.252:3001
📝 Sign Up:          http://51.81.80.252:3001/auth/signup
🔐 Login:            http://51.81.80.252:3001/auth/login
💰 Pricing:          http://51.81.80.252:3001/pricing
📅 Booking:          http://51.81.80.252:3001/booking (after login)
👤 Dashboard:        http://51.81.80.252:3001/dashboard (after login)
💬 Chat:             Click button in bottom-right corner
```

### **Admin Access** (after login as admin)

```
📊 Admin Home:       http://51.81.80.252:3001/admin/dashboard
🤖 Bot Control:      http://51.81.80.252:3001/admin/bots
💼 Support:          http://51.81.80.252:3001/admin/support
🔧 Settings:         http://51.81.80.252:3001/admin/settings
```

### **Backend Access**

```bash
# SSH to VPS
ssh ubuntu@51.81.80.252

# View live logs
pm2 logs                    # All agents
pm2 logs scheduler-agent    # Specific agent
pm2 logs discord-control-bot
pm2 logs ai-assistant

# Monitor resource usage
pm2 monit                   # CPU/Memory dashboard

# Restart specific agent
pm2 restart scheduler-agent
pm2 restart all             # Restart everything

# Stop/start services
docker compose stop
docker compose start
```

---

## 🔧 Configuration

### **Environment Variables** (.env file)

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/wise_defense

# Stripe (Optional - for actual payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_test_...
RESEND_FROM_EMAIL=noreply@wisedefense.com

# Discord Control Bot
DISCORD_CONTROL_BOT_TOKEN=your_bot_token
DISCORD_GUILD_ID=your_server_id

# Ollama
OLLAMA_MODEL=mistral

# App
APP_URL=http://51.81.80.252:3001
JWT_SECRET=your-secret-key-here
```

### **Database Setup**

```bash
# Connect to database
psql $DATABASE_URL

# View tables
\dt

# Check users
SELECT * FROM users;

# Check conversations
SELECT * FROM conversations;

# Check agents online
SELECT * FROM agent_health ORDER BY created_at DESC LIMIT 5;

# Exit
\q
```

---

## 🧪 Testing Features

### **Test 1: Homepage & Auth**
```
1. Open http://51.81.80.252:3001
2. Click "Start Training"
3. Fill signup form
4. Create account
5. Should redirect to /dashboard
✅ Auth working
```

### **Test 2: Chat Widget**
```
1. Open dashboard (logged in)
2. See chat bubble in bottom-right
3. Ask: "How much is the VIP tier?"
4. Get instant response from cache (0.1 seconds)
5. Ask: "What's the best way to improve?"
6. Get Ollama response (2-5 seconds)
✅ AI Chat working
```

### **Test 3: Discord Bot**
```
1. Open Discord server
2. Type: /bots status
3. See all agents with status
4. Type: /health
5. See system health report
6. Click "🔄 Refresh" button
✅ Discord Bot working
```

### **Test 4: Booking System**
```
1. Go to /booking
2. Select a date
3. Choose session type
4. Click "Book Session"
5. See confirmation
✅ Booking working
```

### **Test 5: Admin Dashboard**
```
1. Go to /admin/dashboard
2. See KPI cards (users, revenue, etc)
3. See top performers table
4. Go to /admin/bots
5. See all agents with controls
6. Click "Restart" button
7. Agent restarts
✅ Admin working
```

### **Test 6: Support Ticket Escalation**
```
1. Open chat widget
2. Ask: "I need to speak with a human"
3. Chat says "I'll connect you with support"
4. Go to /admin/support
5. See new ticket created
✅ Escalation working
```

---

## 📊 System Status Commands

```bash
# Overall status
pm2 status

# Detailed status with memory/CPU
pm2 monit

# View all logs
pm2 logs

# View specific agent
pm2 logs repair-agent

# Real-time dashboard
pm2 web  # Then visit http://localhost:9615

# Save current state
pm2 save

# Restart everything
pm2 restart all

# Stop all
pm2 stop all

# Start all
pm2 start ecosystem.config.js

# Kill everything
pm2 kill
```

---

## 🚨 Emergency Troubleshooting

### **Chat not working?**
```bash
# Test Ollama
curl http://localhost:11434/api/tags

# If failed, restart:
sudo systemctl restart ollama
sleep 5

# Check API
curl http://51.81.80.252:3001/api/chat
```

### **Agents not running?**
```bash
pm2 status | grep -v "online"  # See what's not running
pm2 logs <agent-name>           # Check error logs
pm2 restart <agent-name>        # Restart it
```

### **Dashboard won't load?**
```bash
docker compose ps                # See container status
docker compose logs dashboard    # View errors
docker compose restart dashboard # Restart
sleep 10
curl http://localhost:3001       # Test
```

### **Database connection failed?**
```bash
# Check database is running
psql -U postgres -c "SELECT 1"

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT count(*) FROM users;"

# If still failed, restart PostgreSQL
sudo systemctl restart postgresql
```

### **Discord bot not responding?**
```bash
# Check token
echo $DISCORD_CONTROL_BOT_TOKEN

# Check guild ID
echo $DISCORD_GUILD_ID

# Restart bot
pm2 restart discord-control-bot

# View logs
pm2 logs discord-control-bot | tail -20

# Should see: "Bot logged in as YourBot#1234"
```

---

## 📈 Monitoring & Maintenance

### **Daily**
```bash
# Check agent status
pm2 status

# Check for errors
pm2 logs | grep "ERROR"

# Monitor disk space
df -h /home/ubuntu

# Monitor database
psql $DATABASE_URL -c "SELECT count(*) FROM conversations;"
```

### **Weekly**
```bash
# View performance
pm2 monit

# Check database backups
ls -lah /backups/wise_defense/

# Review support tickets
psql $DATABASE_URL -c "SELECT * FROM support_tickets WHERE status='open';"

# Check agent health
psql $DATABASE_URL -c "SELECT * FROM agent_health ORDER BY created_at DESC LIMIT 10;"
```

### **Monthly**
```bash
# Database cleanup
psql $DATABASE_URL << 'SQL'
DELETE FROM conversation_messages WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM repair_log WHERE created_at < NOW() - INTERVAL '90 days';
VACUUM ANALYZE;
SQL

# Review analytics
psql $DATABASE_URL -c "SELECT * FROM chat_analytics ORDER BY date DESC LIMIT 30;"

# Check Ollama model size
du -sh /usr/share/ollama/models/

# Backup database
pg_dump $DATABASE_URL | gzip > /backups/wise_defense/db_$(date +%Y%m%d).sql.gz
```

---

## 🎯 Feature Checklist

After deployment, verify everything works:

### **Core Platform**
- [ ] Homepage loads
- [ ] Can sign up
- [ ] Can login
- [ ] Can view pricing
- [ ] Can book sessions
- [ ] Dashboard displays user data

### **AI Chat**
- [ ] Chat widget appears
- [ ] Can send messages
- [ ] Get instant cached responses
- [ ] Get Ollama responses for complex questions
- [ ] Can escalate to human

### **Admin Features**
- [ ] Admin dashboard loads
- [ ] See KPI cards
- [ ] See top performers
- [ ] Bot control page shows all agents
- [ ] Can restart individual agents
- [ ] Support dashboard shows tickets
- [ ] Can view conversations

### **Agents**
- [ ] All 10 agents showing "online"
- [ ] Repair agent monitoring health
- [ ] Discord bot responding to commands
- [ ] Scheduler sending reminders
- [ ] Social media agent posting

### **Integrations**
- [ ] Discord bot `/bots status` works
- [ ] Can see real-time metrics
- [ ] Telegram bot receiving messages
- [ ] Email sending (if configured)

---

## 📱 User Workflows

### **New User Journey**
```
1. Visit homepage → http://51.81.80.252:3001
2. Click "Start Training"
3. Fill signup form (email, password, name)
4. Email verification (if configured)
5. Redirected to dashboard
6. Browse courses in /pricing
7. Book session in /booking
8. Chat with AI assistant
9. View progress in dashboard
```

### **Booking Flow**
```
1. Click "Booking" in dashboard
2. Select date from calendar
3. Choose session type
4. Confirm booking
5. Receive confirmation email
6. Can reschedule/cancel up to 24h before
```

### **Payment Flow**
```
1. Choose membership tier
2. Click "Subscribe"
3. Redirected to Stripe
4. Enter card details
5. Payment processed
6. Membership activated
7. Upgraded features available
```

### **Support Flow**
```
1. Click chat widget
2. Ask question
3. Get instant response from cache (80%)
4. Or get Ollama response (20%)
5. If need human, type "speak to human"
6. Support ticket created
7. Admin notified
8. Human agent responds within 2 hours
```

---

## 💰 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| **VPS (Cloud)** | $20/month | Already running |
| **PostgreSQL** | Included | On VPS |
| **Ollama AI** | $0/month | Local model |
| **Discord Bot** | $0 | Free API |
| **Telegram Bot** | $0 | Free API |
| **Email (Resend)** | $0-20/month | Optional, only sends |
| **Stripe** | 2.9% + $0.30 | Only on transactions |
| **Total** | **$20-40/month** | Everything included |

**No per-request API charges. No seat licenses. No hidden fees.**

---

## 🔐 Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL on VPS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Review Discord bot permissions
- [ ] Enable GitHub 2FA
- [ ] Store API keys in .env (not git)
- [ ] Run security audit: `npm audit`

---

## 📞 Support & Docs

### **Full Documentation**
- `docs/AI-ASSISTANT.md` - AI/Chat system
- `docs/DISCORD-CONTROL-BOT.md` - Discord bot commands
- `dashboard/README.md` - Frontend setup
- `CLAUDE.md` - Development guidelines

### **API Endpoints**
```
POST   /api/auth/signup           - Create account
POST   /api/auth/login            - Login
POST   /api/chat                  - Send message
GET    /api/leaderboard           - Rankings
POST   /api/bookings              - Book session
GET    /api/admin/stats           - KPIs
GET    /api/admin/bots/control    - Bot status
POST   /api/admin/support/stats    - Support metrics
```

### **Database Schema**
```sql
-- Core
users              -- User accounts
memberships        -- Subscription status
sessions           -- Booking slots

-- Training
content            -- Courses/drills
progress           -- User progress
certificates       -- Completion certs

-- Social
leaderboards       -- Rankings
achievements       -- Gamification
referrals          -- Referral program

-- Support
conversations      -- Chat history
support_tickets    -- Escalations
knowledge_base     -- FAQ system

-- Operations
agent_health       -- Agent status
repair_log         -- Auto-recovery logs
```

---

## ✅ You're Done!

Your complete platform is now live with:

✅ **Production-ready Next.js app**  
✅ **PostgreSQL database**  
✅ **10 autonomous agents**  
✅ **AI customer service**  
✅ **Admin dashboards**  
✅ **Discord integration**  
✅ **Multi-channel support**  
✅ **Zero API costs**  

**Total deployment time: 30 minutes**  
**Total monthly cost: $20-40**  
**Total features: 32+**

---

## 🚀 Next Steps

1. **Customize**: Update pricing, courses, content
2. **Brand**: Add your logo, colors, content
3. **Market**: Tell customers about the new platform
4. **Monitor**: Check `/admin/dashboard` daily
5. **Improve**: Add more cached answers as questions come in

---

**Questions?** Check the full docs in the `docs/` folder.

**Ready to launch?** You have everything you need.

**Good luck!** 🎯
