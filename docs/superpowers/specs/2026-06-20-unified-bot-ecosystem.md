# Unified Bot Ecosystem Enhancement

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan.

**Goal:** Enhance Discord, Telegram, and social media bots with engagement, training, admin, and analytics features — unified in one cohesive ecosystem with AI-powered personalization.

**Architecture:** Hybrid system where Discord bot owns real-time community interaction, Telegram handles notifications, social media amplifies content, and web dashboard provides admin control. All platforms share a unified database and AI-driven insights.

**Tech Stack:** Node.js PM2 agents, PostgreSQL, Discord.js, Telegram Bot API, Twitter/Instagram/LinkedIn APIs, Hermes AI for content generation

## Global Constraints

- **Platform:** Node.js + PostgreSQL (existing stack)
- **Orchestration:** PM2 (existing agent setup)
- **AI:** Use existing Hermes AI agents for content generation
- **Database:** Extend existing schema, no breaking changes
- **Scope:** Phase 1 MVP only — lean features, ship in 2 weeks
- **Excluded:** Advanced quizzes with scoring, coaching scheduling, churn analytics (Phase 2)
- **AI Integration:** Personalized tips, social captions, engagement insights only

---

## System Architecture

### Components

**1. Discord Bot** (Community Hub)
- Real-time member engagement platform
- Hosts daily check-ins, challenges, leaderboards
- Gamification engine (points, badges, streaks)
- Integration point for peer feedback and social sharing
- Orchestrated via PM2 as `discord-bot` agent

**2. Telegram Bot** (Notification Layer)
- One-way notifications to members
- Session reminders, daily tips, weekly summaries
- Personalized content from Hermes AI
- Existing agent, enhanced with AI tips

**3. Social Media Bot** (Amplification Engine)
- Auto-reposts viral Discord moments to Twitter/Instagram/LinkedIn
- Generates engaging captions via Hermes AI
- Tracks cross-platform reach and rewards members
- Existing `social-media-agent`, enhanced with Discord integration

**4. Web Dashboard** (`/admin/bots`)
- Admin interface for member management
- Moderation tools, tier assignment, search
- Announcement scheduling across all platforms
- Real-time analytics and insights
- New Next.js routes at `/admin/bots`

**5. Unified Database**
- Shared member profiles across all platforms
- Engagement tracking, progress logs, analytics
- Extends existing schema with new tables

### Data Flow

```
Member Action (Discord)
  ↓
Log to member_engagement table
  ↓
AI analyzes engagement value
  ↓
If viral (>5 reactions)
  ↓
Social bot queues for Twitter/Instagram
  ↓
Member gets +5 bonus points
  ↓
Dashboard shows real-time metrics
```

---

## Phase 1: MVP Feature Set (Lean)

### Discord Bot Features

1. **Daily Check-In Polls**
   - Post every morning: "Ready to train today? Yes/No/Maybe"
   - Track yes/no/maybe responses
   - Awards +1 point for responding

2. **Member Streak Tracking**
   - Track consecutive days of activity
   - Display current streak on member profile
   - Alert when streak at risk (no activity for 24h)

3. **Simple Leaderboard**
   - Top 10 members by activity score
   - Updated hourly
   - Shows name, score, streak, days active

4. **Peer Encouragement Reactions**
   - React with 🔥 to celebrate others' progress
   - Each reaction = +1 point for receiver
   - Encourages positive community culture

5. **Training Progress Posts**
   - Members post "Completed Session X" updates
   - Posts auto-logged to progress table
   - Counts as daily activity

6. **Social Share Buttons**
   - React with 📱 on any post to queue for social media
   - Shares to Twitter/Instagram with caption and link back to Discord
   - Gives member +5 bonus points when shared

### Telegram Bot Features

1. **AI-Generated Daily Tips**
   - Query member skill level and goals from database
   - Use Hermes AI to generate personalized tip
   - Send at 7 AM UTC (standardized, store user timezone preference for Phase 2)
   - Personalized per member (beginner vs competitive shooter gets different tips)

2. **Session Reminders**
   - Keep existing 2-hour reminder system
   - No changes to this feature

3. **Weekly Progress Summary**
   - Keep existing Sunday summary
   - No changes to this feature

### Social Media Bot Features

1. **Auto-Repost Viral Discord Content**
   - Monitor Discord messages for reactions
   - If message gets >5 reactions within 1 hour, queue for social
   - Post within 2 hours of viral threshold

2. **Engaging Social Captions**
   - Hermes AI generates caption based on Discord post content
   - Caption includes: member name, achievement, call-to-action back to Discord
   - Format: "🎯 [Member] just [achievement]! Join the community: [link]"

3. **Viral Reward System**
   - When post shared to social and gets engagement, member gets +5 points
   - Tracks which members' content goes viral
   - Leaderboard shows "Most Shared Creator" monthly

### Web Dashboard Features (`/admin/bots`)

1. **Member Management**
   - List all members with search/filter by name, tier, activity
   - Approve pending members
   - Assign tier (free/pro/vip)
   - Remove inactive members
   - View member activity timeline

2. **Basic Analytics Dashboard**
   - DAU (daily active users): count
   - Engagement rate: % of members active daily
   - Top posts: most reactions in last 7 days
   - Tier breakdown: count by free/pro/vip
   - Discord activity over time: graph

3. **Announcement Scheduling**
   - Create announcement text
   - Select platforms: Discord, Telegram, Social media
   - Schedule date/time
   - Preview what it looks like on each platform
   - Queue for posting

4. **Moderation Tools**
   - Flag/review questionable messages
   - Remove messages from Discord
   - Mute/unmute members
   - View moderation log

5. **AI Insights Panel**
   - "What content performs best?" — shows top post types
   - "What should we post next?" — Hermes AI recommends topics
   - "Member engagement forecast" — predicts churn risk
   - Engagement breakdown by content type

### Database Schema (New Tables)

**member_engagement**
```sql
id, member_id, platform, action_type (checkin/post/reaction/share), 
points_awarded, timestamp, metadata_json
```

**member_progress**
```sql
id, member_id, session_id, streak_current, streak_longest, 
last_active_date, total_points, created_at, updated_at
```

**bot_social_posts**
```sql
id, discord_message_id, social_platform (twitter/instagram), 
post_url, engagement_count, member_id, posted_at, caption
```

**bot_analytics_daily**
```sql
id, date, dau_count, engagement_rate, top_post_id, tier_breakdown_json, 
created_at
```

**bot_scheduled_posts**
```sql
id, content, platforms_json, scheduled_time, posted_time, status, 
created_by, created_at
```

---

## Error Handling & Reliability

**Message Delivery Failures**
- Log error to `bot_message_errors` table
- Retry after 5 minutes
- Alert admin if 3 consecutive retries fail
- Manual retry button in dashboard

**AI Generation Failures**
- Fall back to template message (e.g., generic training tip)
- Log to error table with "ai_fallback" flag
- Human review optional, but content still delivers
- Track fallback rate in dashboard

**Database Connection Loss**
- Queue events in memory (up to 1000)
- Retry connection every 5 seconds
- Resume sending when connection restored
- Log disconnection incident

**Social Media Rate Limiting**
- Queue posts if platform rate limit hit
- Space posts out over time (max 1 per minute per platform)
- Show queue status in dashboard

---

## Testing Strategy

**Unit Tests**
- AI content generation (various skill levels)
- Point calculation (check-ins, reactions, shares)
- Streak logic (active/inactive days)
- Analytics aggregation

**Integration Tests**
- Discord message → database → analytics flow
- Social share workflow (Discord → AI caption → Twitter)
- Member approval flow (dashboard → database → bot)
- Scheduled post flow (dashboard → queue → bot execution)

**Manual Testing**
- Post check-in poll, verify point award
- React with 🔥, verify leaderboard update
- Share to social, verify Twitter posts
- Schedule announcement, verify it posts at time
- Approve member, verify they appear on leaderboard

---

## Timeline Estimate

| Phase | Task | Duration |
|-------|------|----------|
| Setup | Database schema, bot agent scaffolding | 1-2 days |
| Discord | Check-ins, streaks, leaderboard, reactions, sharing | 3-4 days |
| AI Integration | Hermes AI hooks for tips, captions, insights | 2-3 days |
| Dashboard | Member mgmt, analytics, scheduling, moderation | 3-4 days |
| Social Integration | Discord → Twitter workflow, captions, rewards | 2 days |
| Testing | Unit/integration/manual tests, bug fixes | 2-3 days |
| Deployment | VPS deployment, PM2 restart, verification | 1 day |

**Total: ~2 weeks**

---

## Success Criteria

- ✅ Members can post check-ins and see points update in real-time
- ✅ Leaderboard shows top 10 members by score
- ✅ Discord messages with >5 reactions auto-post to Twitter within 2 hours
- ✅ Telegram receives personalized daily tips based on member skill level
- ✅ Admin can schedule an announcement and see it post to all platforms at scheduled time
- ✅ Dashboard shows DAU, engagement rate, top posts
- ✅ Zero data loss during bot restarts
- ✅ AI content generation has <5% fallback rate

---

## Phase 2 (Deferred)

- Advanced quizzes with scoring
- Coaching connection scheduling
- Revenue and churn analytics
- Member onboarding workflow
- Custom achievement badges
- API for third-party integrations
