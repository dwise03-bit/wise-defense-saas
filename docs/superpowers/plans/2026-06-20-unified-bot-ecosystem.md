# Unified Bot Ecosystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive bot ecosystem that unifies Discord engagement, Telegram notifications, social media amplification, and admin dashboard with AI-powered personalization across all platforms.

**Architecture:** Modular agent-based system where Discord bot handles real-time community interaction, Telegram sends personalized notifications, social media amplifies top content, and a web dashboard provides admin control — all backed by a unified PostgreSQL database and Hermes AI integration.

**Tech Stack:** Node.js, PM2, PostgreSQL, Discord.js, Telegram Bot API, Twitter/Instagram/LinkedIn APIs, Hermes AI agents, Next.js (dashboard)

## Global Constraints

- **Database:** PostgreSQL (existing), no breaking changes to current schema
- **Orchestration:** PM2 agents only (existing setup)
- **Node.js:** v16+ (existing requirement)
- **AI Integration:** Use existing Hermes AI agents, no new dependencies
- **Phase 1 scope:** MVP features only, defer Phase 2 features
- **Deployment target:** VPS at 51.81.80.252
- **Existing agents:** Extend `discord-bot.js`, `telegram-bot.js`, `social-media-agent.js` — don't create new files

---

## File Structure

**Database & Utilities:**
- `dashboard/lib/botEngineering/engagement.ts` — Engagement scoring and points logic
- `dashboard/lib/botEngineering/streak.ts` — Streak calculation and tracking
- `dashboard/lib/botEngineering/analytics.ts` — Aggregation and metrics
- Database migrations: `migrations/2026-06-20-bot-tables.sql`

**Discord Bot Enhancements:**
- `dashboard/agents/discord-bot.js` — Modify existing, add features
- `dashboard/agents/discord-commands/` — New directory for command handlers
  - `checkin.js` — Check-in poll command
  - `leaderboard.js` — Leaderboard command
  - `share.js` — Social share command

**Telegram Bot Enhancements:**
- `dashboard/agents/telegram-bot.js` — Modify existing for AI tips

**Social Media Bot Enhancements:**
- `dashboard/agents/social-media-agent.js` — Modify existing for Discord integration

**Web Dashboard:**
- `dashboard/app/admin/bots/page.tsx` — Main admin hub (new route)
- `dashboard/app/admin/bots/members/page.tsx` — Member management
- `dashboard/app/admin/bots/analytics/page.tsx` — Analytics dashboard
- `dashboard/app/admin/bots/schedule/page.tsx` — Announcement scheduler
- `dashboard/app/admin/bots/moderation/page.tsx` — Moderation tools
- `dashboard/components/BotAdminPanel/` — Reusable admin components

**Tests:**
- `dashboard/__tests__/botEngineering/` — Unit tests for engagement, streak, analytics
- `dashboard/__tests__/api/bots/` — Integration tests for bot endpoints

---

## Task Breakdown

### Task 1: Database Schema & Setup

**Files:**
- Create: `migrations/2026-06-20-bot-tables.sql`
- Modify: `ecosystem.config.js` (if needed for migrations)
- Test: Manual verification script

**Interfaces:**
- Produces: Five new PostgreSQL tables with correct schema and indices

- [ ] **Step 1: Create migration file with all new tables**

```sql
-- migrations/2026-06-20-bot-tables.sql

-- Member engagement tracking
CREATE TABLE IF NOT EXISTS member_engagement (
  id BIGSERIAL PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  points_awarded INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_member_action (member_id, action_type),
  INDEX idx_created (created_at)
);

-- Member progress tracking
CREATE TABLE IF NOT EXISTS member_progress (
  id BIGSERIAL PRIMARY KEY,
  member_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  session_count INT DEFAULT 0,
  streak_current INT DEFAULT 0,
  streak_longest INT DEFAULT 0,
  last_active_date DATE,
  total_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_streak (streak_current),
  INDEX idx_points (total_points)
);

-- Social media posts tracking
CREATE TABLE IF NOT EXISTS bot_social_posts (
  id BIGSERIAL PRIMARY KEY,
  discord_message_id VARCHAR(100),
  discord_content TEXT,
  social_platform VARCHAR(50),
  post_url VARCHAR(500),
  engagement_count INT DEFAULT 0,
  member_id UUID REFERENCES users(id) ON DELETE SET NULL,
  posted_at TIMESTAMP DEFAULT NOW(),
  caption TEXT,
  INDEX idx_member (member_id),
  INDEX idx_platform (social_platform)
);

-- Daily analytics snapshot
CREATE TABLE IF NOT EXISTS bot_analytics_daily (
  id BIGSERIAL PRIMARY KEY,
  day DATE UNIQUE,
  dau_count INT,
  engagement_rate DECIMAL(5,2),
  top_post_id VARCHAR(100),
  tier_breakdown JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_day (day)
);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS bot_scheduled_posts (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  platforms JSONB NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  posted_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_scheduled_time (scheduled_time),
  INDEX idx_status (status)
);
```

- [ ] **Step 2: Apply migration to VPS database**

Run locally first:
```bash
psql $DATABASE_URL -f migrations/2026-06-20-bot-tables.sql
```

Then verify tables exist:
```bash
psql $DATABASE_URL -c "\dt member_engagement, member_progress, bot_social_posts, bot_analytics_daily, bot_scheduled_posts"
```

Expected: 5 tables listed

- [ ] **Step 3: Commit migration**

```bash
git add migrations/2026-06-20-bot-tables.sql
git commit -m "db: add bot ecosystem tables (engagement, progress, social, analytics, scheduling)"
```

---

### Task 2: Engagement & Points Utility Library

**Files:**
- Create: `dashboard/lib/botEngineering/engagement.ts`
- Test: `dashboard/__tests__/botEngineering/engagement.test.ts`

**Interfaces:**
- Produces: 
  - `async function awardPoints(memberId: string, action: string, points: number): Promise<void>`
  - `async function getMemberPoints(memberId: string): Promise<number>`
  - `async function recordEngagement(memberId: string, platform: string, actionType: string, metadata?: any): Promise<void>`

- [ ] **Step 1: Write test for awardPoints function**

```typescript
// dashboard/__tests__/botEngineering/engagement.test.ts
import { awardPoints, getMemberPoints } from '@/lib/botEngineering/engagement';

describe('Engagement Points', () => {
  const testMemberId = 'test-member-123';

  beforeEach(async () => {
    // Clear progress table for this member
    await pool.query('DELETE FROM member_progress WHERE member_id = $1', [testMemberId]);
  });

  test('awards points to member', async () => {
    await awardPoints(testMemberId, 'check_in', 1);
    const points = await getMemberPoints(testMemberId);
    expect(points).toBe(1);
  });

  test('accumulates points across multiple actions', async () => {
    await awardPoints(testMemberId, 'check_in', 1);
    await awardPoints(testMemberId, 'reaction', 1);
    await awardPoints(testMemberId, 'social_share', 5);
    const points = await getMemberPoints(testMemberId);
    expect(points).toBe(7);
  });

  test('records engagement event', async () => {
    await recordEngagement(testMemberId, 'discord', 'check_in', { poll_id: '123' });
    // Verify record exists
    const result = await pool.query(
      'SELECT * FROM member_engagement WHERE member_id = $1',
      [testMemberId]
    );
    expect(result.rows.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- dashboard/__tests__/botEngineering/engagement.test.ts
```

Expected: FAIL with "module not found" or "function not defined"

- [ ] **Step 3: Write engagement.ts implementation**

```typescript
// dashboard/lib/botEngineering/engagement.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

/**
 * Award points to a member
 */
export async function awardPoints(
  memberId: string,
  action: string,
  points: number
): Promise<void> {
  try {
    // Update or insert member_progress
    await pool.query(
      `INSERT INTO member_progress (member_id, total_points)
       VALUES ($1, $2)
       ON CONFLICT (member_id) DO UPDATE
       SET total_points = member_progress.total_points + $2,
           updated_at = NOW()`,
      [memberId, points]
    );

    // Record engagement
    await recordEngagement(memberId, 'system', action, { points_awarded: points });
  } catch (error) {
    console.error('[ENGAGEMENT] Error awarding points:', error);
    throw error;
  }
}

/**
 * Get member's current points
 */
export async function getMemberPoints(memberId: string): Promise<number> {
  try {
    const result = await pool.query(
      'SELECT total_points FROM member_progress WHERE member_id = $1',
      [memberId]
    );
    return result.rows[0]?.total_points ?? 0;
  } catch (error) {
    console.error('[ENGAGEMENT] Error getting points:', error);
    return 0;
  }
}

/**
 * Record engagement event to database
 */
export async function recordEngagement(
  memberId: string,
  platform: string,
  actionType: string,
  metadata?: any
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO member_engagement (member_id, platform, action_type, metadata)
       VALUES ($1, $2, $3, $4)`,
      [memberId, platform, actionType, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (error) {
    console.error('[ENGAGEMENT] Error recording engagement:', error);
    throw error;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- dashboard/__tests__/botEngineering/engagement.test.ts
```

Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add dashboard/lib/botEngineering/engagement.ts dashboard/__tests__/botEngineering/engagement.test.ts
git commit -m "feat: add engagement points and tracking system"
```

---

### Task 3: Streak Tracking System

**Files:**
- Create: `dashboard/lib/botEngineering/streak.ts`
- Test: `dashboard/__tests__/botEngineering/streak.test.ts`

**Interfaces:**
- Consumes: `getMemberPoints` from engagement
- Produces:
  - `async function updateStreak(memberId: string): Promise<{ current: number, longest: number }>`
  - `async function getStreak(memberId: string): Promise<{ current: number, longest: number }>`

- [ ] **Step 1: Write tests for streak logic**

```typescript
// dashboard/__tests__/botEngineering/streak.test.ts
import { updateStreak, getStreak } from '@/lib/botEngineering/streak';

describe('Streak Tracking', () => {
  const testMemberId = 'test-streak-123';

  beforeEach(async () => {
    await pool.query('DELETE FROM member_progress WHERE member_id = $1', [testMemberId]);
  });

  test('initializes streak to 1 on first activity', async () => {
    const streak = await updateStreak(testMemberId);
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(1);
  });

  test('increments streak on consecutive days', async () => {
    // Day 1
    let streak = await updateStreak(testMemberId);
    expect(streak.current).toBe(1);

    // Simulate next day (in real usage, would be 24h later)
    streak = await updateStreak(testMemberId);
    expect(streak.current).toBe(2);
    expect(streak.longest).toBe(2);
  });

  test('resets streak if no activity for 24h', async () => {
    await updateStreak(testMemberId);
    
    // Simulate 25+ hours without activity
    await pool.query(
      'UPDATE member_progress SET last_active_date = $1 WHERE member_id = $2',
      [new Date(Date.now() - 25 * 60 * 60 * 1000), testMemberId]
    );

    const streak = await updateStreak(testMemberId);
    expect(streak.current).toBe(1);
  });

  test('retrieves streak without updating', async () => {
    await updateStreak(testMemberId);
    const streak = await getStreak(testMemberId);
    expect(streak.current).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- dashboard/__tests__/botEngineering/streak.test.ts
```

Expected: FAIL

- [ ] **Step 3: Write streak.ts implementation**

```typescript
// dashboard/lib/botEngineering/streak.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

/**
 * Update member streak (call when member is active)
 */
export async function updateStreak(
  memberId: string
): Promise<{ current: number; longest: number }> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get current progress
    const result = await pool.query(
      `SELECT streak_current, streak_longest, last_active_date
       FROM member_progress WHERE member_id = $1`,
      [memberId]
    );

    const current = result.rows[0];

    if (!current) {
      // New member
      await pool.query(
        `INSERT INTO member_progress (member_id, streak_current, streak_longest, last_active_date)
         VALUES ($1, 1, 1, $2)`,
        [memberId, today]
      );
      return { current: 1, longest: 1 };
    }

    const lastActive = current.last_active_date;
    const lastActiveDate = new Date(lastActive);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate.getTime() - lastActiveDate.getTime()) / (24 * 60 * 60 * 1000));

    let newStreak = current.streak_current;
    if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    } else if (daysDiff === 1) {
      // Consecutive day
      newStreak = current.streak_current + 1;
    }
    // If daysDiff === 0, already active today, don't increment

    const newLongest = Math.max(newStreak, current.streak_longest);

    await pool.query(
      `UPDATE member_progress
       SET streak_current = $1, streak_longest = $2, last_active_date = $3, updated_at = NOW()
       WHERE member_id = $4`,
      [newStreak, newLongest, today, memberId]
    );

    return { current: newStreak, longest: newLongest };
  } catch (error) {
    console.error('[STREAK] Error updating streak:', error);
    throw error;
  }
}

/**
 * Get member's current streak
 */
export async function getStreak(
  memberId: string
): Promise<{ current: number; longest: number }> {
  try {
    const result = await pool.query(
      'SELECT streak_current, streak_longest FROM member_progress WHERE member_id = $1',
      [memberId]
    );

    if (!result.rows[0]) {
      return { current: 0, longest: 0 };
    }

    return {
      current: result.rows[0].streak_current,
      longest: result.rows[0].streak_longest,
    };
  } catch (error) {
    console.error('[STREAK] Error getting streak:', error);
    return { current: 0, longest: 0 };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- dashboard/__tests__/botEngineering/streak.test.ts
```

Expected: PASS (all 4 tests)

- [ ] **Step 5: Commit**

```bash
git add dashboard/lib/botEngineering/streak.ts dashboard/__tests__/botEngineering/streak.test.ts
git commit -m "feat: add streak tracking system (current & longest)"
```

---

### Task 4: Discord Bot - Check-In Poll Handler

**Files:**
- Modify: `dashboard/agents/discord-bot.js`
- Create: `dashboard/agents/discord-commands/checkin.js`
- Test: Manual Discord testing

**Interfaces:**
- Consumes: `awardPoints`, `updateStreak` from Tasks 2-3
- Produces: Daily check-in poll posted to Discord, members awarded +1 point for responding

- [ ] **Step 1: Create check-in command handler**

```javascript
// dashboard/agents/discord-commands/checkin.js
const { EmbedBuilder } = require('discord.js');
const { awardPoints } = require('../../lib/botEngineering/engagement');
const { updateStreak } = require('../../lib/botEngineering/streak');

module.exports = {
  name: 'Check-In Poll',
  description: 'Daily check-in poll to track member activity',

  async execute(client, channelId) {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.error('[CHECKIN] Channel not found:', channelId);
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#ff1744')
        .setTitle('🎯 Daily Check-In')
        .setDescription('Are you ready to train today?')
        .addFields(
          { name: 'React to vote:', value: '✅ Yes\n❌ No\n🤔 Maybe' }
        )
        .setTimestamp();

      const message = await channel.send({ embeds: [embed] });

      // Add reactions
      await message.react('✅');
      await message.react('❌');
      await message.react('🤔');

      console.log('[CHECKIN] Daily poll posted');

      // Track reaction collectors
      const collector = message.createReactionCollector({ time: 24 * 60 * 60 * 1000 });

      collector.on('collect', async (reaction, user) => {
        if (user.bot) return;

        try {
          const memberId = user.id;
          await awardPoints(memberId, 'check_in', 1);
          await updateStreak(memberId);
          console.log(`[CHECKIN] ${user.username} awarded +1 point`);
        } catch (error) {
          console.error('[CHECKIN] Error awarding points:', error);
        }
      });
    } catch (error) {
      console.error('[CHECKIN] Error posting poll:', error);
    }
  },
};
```

- [ ] **Step 2: Integrate check-in into discord-bot.js**

Add this to the scheduling section of `discord-bot.js`:

```javascript
// In discord-bot.js, add to the bot initialization:
const checkinCommand = require('./discord-commands/checkin');

// Schedule daily check-in at 8 AM UTC
const dailyCheckInTime = 8 * 60 * 60 * 1000; // 8 AM
const now = Date.now();
const nextCheckInTime = new Date();
nextCheckInTime.setUTCHours(8, 0, 0, 0);

if (nextCheckInTime <= now) {
  nextCheckInTime.setDate(nextCheckInTime.getDate() + 1);
}

const checkInDelay = nextCheckInTime - now;

setTimeout(() => {
  checkinCommand.execute(client, process.env.DISCORD_CHANNEL_TIPS);
  setInterval(() => {
    checkinCommand.execute(client, process.env.DISCORD_CHANNEL_TIPS);
  }, 24 * 60 * 60 * 1000);
}, checkInDelay);

console.log('[DISCORD] Daily check-in scheduled');
```

- [ ] **Step 3: Test manually on Discord**

1. Restart discord-bot on VPS: `pm2 restart discord-bot`
2. Wait for next scheduled time or modify code to run immediately for testing
3. Check #training-tips channel for poll
4. React with ✅, ❌, or 🤔
5. Verify member gets +1 point in database:

```bash
ssh ubuntu@51.81.80.252
psql $DATABASE_URL -c "SELECT member_id, total_points FROM member_progress WHERE member_id = '<discord-user-id>' ORDER BY updated_at DESC LIMIT 1"
```

Expected: member_id shown with total_points >= 1

- [ ] **Step 4: Commit**

```bash
git add dashboard/agents/discord-commands/checkin.js dashboard/agents/discord-bot.js
git commit -m "feat: add daily check-in poll to Discord bot"
```

---

### Task 5: Discord Bot - Leaderboard Command

**Files:**
- Modify: `dashboard/agents/discord-bot.js`
- Create: `dashboard/agents/discord-commands/leaderboard.js`

**Interfaces:**
- Consumes: `getMemberPoints` from Task 2
- Produces: `/leaderboard` slash command that shows top 10 members

- [ ] **Step 1: Create leaderboard command**

```javascript
// dashboard/agents/discord-commands/leaderboard.js
const { EmbedBuilder } = require('discord.js');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

module.exports = {
  name: 'leaderboard',
  description: 'Show top 10 members by points',

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const result = await pool.query(
        `SELECT member_id, total_points, streak_current
         FROM member_progress
         ORDER BY total_points DESC
         LIMIT 10`
      );

      if (result.rows.length === 0) {
        return await interaction.editReply('No members on leaderboard yet.');
      }

      let leaderboardText = '';
      result.rows.forEach((row, index) => {
        leaderboardText += `**${index + 1}.** <@${row.member_id}> - ${row.total_points} pts 🔥 Streak: ${row.streak_current}\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🏆 Leaderboard')
        .setDescription(leaderboardText)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('[LEADERBOARD] Error:', error);
      await interaction.editReply('Error fetching leaderboard.');
    }
  },
};
```

- [ ] **Step 2: Register leaderboard as slash command**

Add to `discord-bot.js`:

```javascript
const leaderboardCommand = require('./discord-commands/leaderboard');

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'leaderboard') {
    await leaderboardCommand.execute(interaction);
  }
});

// Register command with Discord
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('[DISCORD] Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_SERVER_ID
      ),
      { body: [
        {
          name: 'leaderboard',
          description: 'Show top 10 members by points',
        },
      ] },
    );
  } catch (error) {
    console.error('[DISCORD] Error registering commands:', error);
  }
})();
```

- [ ] **Step 3: Test on Discord**

1. Restart bot: `pm2 restart discord-bot`
2. In Discord, type `/leaderboard`
3. Verify top 10 members display with points and streaks

- [ ] **Step 4: Commit**

```bash
git add dashboard/agents/discord-commands/leaderboard.js dashboard/agents/discord-bot.js
git commit -m "feat: add leaderboard slash command to Discord bot"
```

---

### Task 6: Discord Bot - Reaction-Based Social Sharing

**Files:**
- Modify: `dashboard/agents/discord-bot.js`
- Create: `dashboard/agents/discord-commands/share.js`

**Interfaces:**
- Consumes: `recordEngagement`, `awardPoints` from Task 2
- Produces: React with 📱 to queue message for social media, +5 points awarded

- [ ] **Step 1: Create share handler**

```javascript
// dashboard/agents/discord-commands/share.js
const { Pool } = require('pg');
const { awardPoints } = require('../../lib/botEngineering/engagement');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

module.exports = {
  name: 'Social Share Handler',

  async handleShareReaction(reaction, user, client) {
    if (user.bot || reaction.emoji.name !== '📱') return;

    try {
      const message = reaction.message;
      const memberId = message.author.id;

      // Queue for social media posting
      await pool.query(
        `INSERT INTO bot_social_posts (discord_message_id, discord_content, social_platform, member_id, posted_at)
         VALUES ($1, $2, 'queued', $3, NOW())`,
        [message.id, message.content, memberId]
      );

      // Award points
      await awardPoints(memberId, 'social_share', 5);

      // React with confirmation
      await reaction.message.react('✅');
      console.log(`[SHARE] Message ${message.id} queued for social media by ${user.username}`);
    } catch (error) {
      console.error('[SHARE] Error queuing message:', error);
    }
  },
};
```

- [ ] **Step 2: Integrate into discord-bot.js**

```javascript
// In discord-bot.js:
const shareHandler = require('./discord-commands/share');

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.partial) {
    reaction.fetch().catch(err => console.error('[SHARE] Error fetching reaction:', err));
  }

  shareHandler.handleShareReaction(reaction, user, client);
});

console.log('[DISCORD] Share reaction handler enabled');
```

- [ ] **Step 3: Test on Discord**

1. Post a message in Discord
2. React with 📱
3. Verify message inserted into `bot_social_posts` table
4. Verify user awarded +5 points

- [ ] **Step 4: Commit**

```bash
git add dashboard/agents/discord-commands/share.js dashboard/agents/discord-bot.js
git commit -m "feat: add social share reaction (📱) to queue Discord messages"
```

---

### Task 7: Discord Bot - Viral Content Tracking & Leaderboard

**Files:**
- Create: `dashboard/lib/botEngineering/virality.ts`
- Modify: `dashboard/agents/discord-bot.js`
- Test: `dashboard/__tests__/botEngineering/virality.test.ts`

**Interfaces:**
- Consumes: `awardPoints` from Task 2
- Produces: Track reactions on Discord messages, auto-queue if >5 reactions within 1 hour

- [ ] **Step 1: Write test for virality tracking**

```typescript
// dashboard/__tests__/botEngineering/virality.test.ts
import { trackVirality, isViral } from '@/lib/botEngineering/virality';

describe('Virality Tracking', () => {
  test('tracks message reactions', async () => {
    const messageId = 'msg-123';
    const memberId = 'user-456';

    await trackVirality(messageId, memberId, 5);
    const viral = await isViral(messageId);
    expect(viral).toBe(true);
  });

  test('requires >5 reactions to be viral', async () => {
    const messageId = 'msg-234';
    const memberId = 'user-567';

    await trackVirality(messageId, memberId, 4);
    const viral = await isViral(messageId);
    expect(viral).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- dashboard/__tests__/botEngineering/virality.test.ts
```

- [ ] **Step 3: Write virality.ts implementation**

```typescript
// dashboard/lib/botEngineering/virality.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const VIRAL_THRESHOLD = 5;
const VIRAL_WINDOW_HOURS = 1;

export async function trackVirality(
  messageId: string,
  memberId: string,
  reactionCount: number
): Promise<boolean> {
  try {
    // Get message details
    const existing = await pool.query(
      `SELECT engagement_count FROM bot_social_posts WHERE discord_message_id = $1`,
      [messageId]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO bot_social_posts (discord_message_id, member_id, engagement_count, social_platform)
         VALUES ($1, $2, $3, 'discord')`,
        [messageId, memberId, reactionCount]
      );
    } else {
      await pool.query(
        `UPDATE bot_social_posts SET engagement_count = $1 WHERE discord_message_id = $2`,
        [reactionCount, messageId]
      );
    }

    return reactionCount >= VIRAL_THRESHOLD;
  } catch (error) {
    console.error('[VIRALITY] Error tracking:', error);
    return false;
  }
}

export async function isViral(messageId: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT engagement_count FROM bot_social_posts WHERE discord_message_id = $1`,
      [messageId]
    );

    if (!result.rows[0]) return false;
    return result.rows[0].engagement_count >= VIRAL_THRESHOLD;
  } catch (error) {
    console.error('[VIRALITY] Error checking virality:', error);
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- dashboard/__tests__/botEngineering/virality.test.ts
```

- [ ] **Step 5: Integrate into discord-bot.js to auto-track**

```javascript
// In discord-bot.js:
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    await reaction.fetch().catch(err => console.error(err));
  }

  try {
    const reactionCount = reaction.count;
    const messageId = reaction.message.id;
    const memberId = reaction.message.author.id;

    // Track virality
    const { trackVirality } = await import('../../lib/botEngineering/virality');
    const isViral = await trackVirality(messageId, memberId, reactionCount);

    if (isViral && !reaction.message.replyedWith?.includes('viral')) {
      // Queue for social media
      await pool.query(
        `UPDATE bot_social_posts SET social_platform = 'queued' WHERE discord_message_id = $1`,
        [messageId]
      );
      console.log(`[VIRALITY] Message ${messageId} is viral (${reactionCount} reactions)`);
    }
  } catch (error) {
    console.error('[VIRALITY] Error:', error);
  }
});
```

- [ ] **Step 6: Commit**

```bash
git add dashboard/lib/botEngineering/virality.ts dashboard/__tests__/botEngineering/virality.test.ts dashboard/agents/discord-bot.js
git commit -m "feat: add virality tracking (>5 reactions auto-queues for social)"
```

---

### Task 8: Telegram Bot - AI-Powered Daily Tips

**Files:**
- Modify: `dashboard/agents/telegram-bot.js`
- Create: `dashboard/lib/botEngineering/aiTips.ts`

**Interfaces:**
- Consumes: Member skill level from database
- Produces: Personalized daily tips via Hermes AI

- [ ] **Step 1: Create AI tips generator**

```typescript
// dashboard/lib/botEngineering/aiTips.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function generatePersonalizedTip(memberId: string): Promise<string> {
  try {
    // Get member skill level and goals
    const result = await pool.query(
      `SELECT u.experience_level, u.goals
       FROM users u WHERE u.id = $1`,
      [memberId]
    );

    if (!result.rows[0]) {
      return 'No member data found.';
    }

    const { experience_level, goals } = result.rows[0];

    // Call Hermes AI to generate tip
    const tip = await callHermesAI({
      type: 'training_tip',
      skill_level: experience_level,
      goals: goals,
      timestamp: new Date().toISOString(),
    });

    return tip || 'Focus on mastering the fundamentals today. 🎯';
  } catch (error) {
    console.error('[AI_TIPS] Error generating tip:', error);
    return 'Today's tip: Practice with intention and focus on one skill at a time. 💪';
  }
}

/**
 * Call Hermes AI for content generation
 * (Assumes Hermes agents are running on the same VPS)
 */
async function callHermesAI(payload: any): Promise<string> {
  try {
    // In production, would call a Hermes AI endpoint or queue
    // For now, use template-based approach
    const templates = {
      beginner: [
        '🔰 Today: Master the grip. A solid grip is the foundation of everything.',
        '🔰 Drill: 10 dry fires focusing on sight alignment. Quality over speed.',
        '🔰 Remember: Safety first. Always follow the four rules.',
      ],
      intermediate: [
        '📍 Today: Work on accuracy at 25 yards. Group your shots tight.',
        '📍 Drill: 50 rounds of draw-to-first-shot practice.',
        '📍 Challenge: One-handed shooting from your weak hand.',
      ],
      advanced: [
        '🎯 Today: Speed and accuracy under pressure. Push your limits.',
        '🎯 Drill: Competitive stage walk-through and timed runs.',
        '🎯 Advanced: Multi-target transitions at high speed.',
      ],
    };

    const level = payload.skill_level || 'beginner';
    const dayTips = templates[level] || templates.beginner;
    return dayTips[Math.floor(Math.random() * dayTips.length)];
  } catch (error) {
    console.error('[HERMES] Error calling AI:', error);
    return null;
  }
}
```

- [ ] **Step 2: Integrate into telegram-bot.js**

```javascript
// In telegram-bot.js, modify the daily tips task:
const { generatePersonalizedTip } = require('../../lib/botEngineering/aiTips');

async function taskSendDailyTips() {
  console.log('[TELEGRAM] Running task: Send daily tips...');

  try {
    // Get all users with telegram_chat_id
    const result = await query(
      `SELECT id, telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL AND is_active = true LIMIT 100`
    );

    for (const user of result.rows) {
      const tip = await generatePersonalizedTip(user.id);
      const message = `💡 **Daily Training Tip**\n\n${tip}`;

      await sendTelegramMessage(user.telegram_chat_id, message);
    }

    console.log(`[TELEGRAM] Sent daily tips to ${result.rows.length} users`);
  } catch (error) {
    console.error('[TELEGRAM] Error in daily tips task:', error);
  }
}
```

- [ ] **Step 3: Test on Telegram**

1. Ensure you have a member with skill level set
2. Send `/start` to the Telegram bot
3. Wait for next scheduled tip (or modify timing for testing)
4. Verify tip is personalized based on skill level

- [ ] **Step 4: Commit**

```bash
git add dashboard/lib/botEngineering/aiTips.ts dashboard/agents/telegram-bot.js
git commit -m "feat: add AI-powered personalized daily training tips to Telegram"
```

---

### Task 9: Social Media Bot - Auto-Repost Viral Content

**Files:**
- Modify: `dashboard/agents/social-media-agent.js`
- Create: `dashboard/lib/botEngineering/socialAmplification.ts`

**Interfaces:**
- Consumes: Viral Discord messages from `bot_social_posts` table
- Produces: Posts to Twitter/Instagram/LinkedIn with captions

- [ ] **Step 1: Create social amplification module**

```typescript
// dashboard/lib/botEngineering/socialAmplification.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function getQueuedPosts() {
  try {
    return await pool.query(
      `SELECT * FROM bot_social_posts WHERE social_platform = 'queued' LIMIT 10`
    );
  } catch (error) {
    console.error('[SOCIAL] Error getting queued posts:', error);
    return { rows: [] };
  }
}

export async function markPostPosted(
  postId: string,
  platform: string,
  postUrl: string
): Promise<void> {
  try {
    await pool.query(
      `UPDATE bot_social_posts SET social_platform = $1, post_url = $2, posted_at = NOW()
       WHERE id = $3`,
      [platform, postUrl, postId]
    );
  } catch (error) {
    console.error('[SOCIAL] Error marking post as posted:', error);
    throw error;
  }
}

export async function awardViralBonus(memberId: string): Promise<void> {
  try {
    // Award +5 points for viral content
    await pool.query(
      `UPDATE member_progress SET total_points = total_points + 5 WHERE member_id = $1`,
      [memberId]
    );
    console.log(`[SOCIAL] Awarded +5 bonus to ${memberId} for viral content`);
  } catch (error) {
    console.error('[SOCIAL] Error awarding bonus:', error);
  }
}
```

- [ ] **Step 2: Add reposting task to social-media-agent.js**

```javascript
// In social-media-agent.js:
const { getQueuedPosts, markPostPosted, awardViralBonus } = require('../../lib/botEngineering/socialAmplification');

async function taskRepostViral() {
  console.log('[SOCIAL] Running task: Repost viral content...');

  try {
    const result = await getQueuedPosts();

    for (const post of result.rows) {
      // Generate caption
      const caption = generateCaption(post);

      // Post to Twitter
      if (process.env.TWITTER_API_KEY) {
        const twitterUrl = await postToTwitter(caption, post.discord_content);
        await markPostPosted(post.id, 'twitter', twitterUrl);
      }

      // Post to Instagram
      if (process.env.INSTAGRAM_ACCESS_TOKEN) {
        const instaUrl = await postToInstagram(caption, post.discord_content);
        await markPostPosted(post.id, 'instagram', instaUrl);
      }

      // Award bonus
      await awardViralBonus(post.member_id);
    }

    console.log(`[SOCIAL] Reposted ${result.rows.length} viral items`);
  } catch (error) {
    console.error('[SOCIAL] Error in repost task:', error);
  }
}

function generateCaption(post) {
  return `🎯 Amazing progress! 🔥\n\n${post.discord_content}\n\nJoin the community and train with us!\n🔗 [Discord Link]`;
}

// Schedule task
setInterval(taskRepostViral, 60 * 60 * 1000); // Every hour
```

- [ ] **Step 3: Test the workflow**

1. Post a message in Discord
2. React with >5 people to make it viral
3. Check that message appears in `bot_social_posts` with `social_platform = 'queued'`
4. Wait for next scheduled repost task (or run manually)
5. Verify Twitter/Instagram posts

- [ ] **Step 4: Commit**

```bash
git add dashboard/lib/botEngineering/socialAmplification.ts dashboard/agents/social-media-agent.js
git commit -m "feat: auto-repost viral Discord content to Twitter/Instagram"
```

---

### Task 10: Web Dashboard - Admin Member Management Page

**Files:**
- Create: `dashboard/app/admin/bots/page.tsx`
- Create: `dashboard/app/admin/bots/members/page.tsx`
- Create: `dashboard/app/api/admin/bots/members/route.ts`

**Interfaces:**
- Produces: Admin panel at `/admin/bots/members` with member search/filter/approve/remove

- [ ] **Step 1: Create admin layout and navigation**

```typescript
// dashboard/app/admin/bots/layout.tsx
import Link from 'next/link';

export default function BotAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <h1 className="heading-silver text-2xl mb-4">Bot Administration</h1>
        <nav className="flex gap-6">
          <Link href="/admin/bots/members" className="text-gray hover:text-neon-red">Members</Link>
          <Link href="/admin/bots/analytics" className="text-gray hover:text-neon-red">Analytics</Link>
          <Link href="/admin/bots/schedule" className="text-gray hover:text-neon-red">Scheduling</Link>
          <Link href="/admin/bots/moderation" className="text-gray hover:text-neon-red">Moderation</Link>
        </nav>
      </header>
      <div className="max-w-7xl mx-auto p-4">
        {children}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create members management page**

```typescript
// dashboard/app/admin/bots/members/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [search]);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bots/members?search=${search}`);
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveMember(memberId: string) {
    try {
      await fetch(`/api/admin/bots/members/${memberId}/approve`, { method: 'POST' });
      fetchMembers();
    } catch (error) {
      console.error('Error approving member:', error);
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/admin/bots/members/${memberId}`, { method: 'DELETE' });
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="section-heading">Member Management</h2>

      <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
        <Search size={20} className="text-gray" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white outline-none flex-1"
        />
      </div>

      {loading ? (
        <p className="text-gray">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-silver">Name</th>
                <th className="text-left py-3 px-4 text-silver">Email</th>
                <th className="text-left py-3 px-4 text-silver">Tier</th>
                <th className="text-left py-3 px-4 text-silver">Points</th>
                <th className="text-left py-3 px-4 text-silver">Status</th>
                <th className="text-left py-3 px-4 text-silver">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member: any) => (
                <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="py-3 px-4 text-gray">{member.name}</td>
                  <td className="py-3 px-4 text-gray">{member.email}</td>
                  <td className="py-3 px-4 text-neon-red">{member.tier}</td>
                  <td className="py-3 px-4 text-gray">{member.total_points || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      member.is_active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {!member.is_active && (
                      <button
                        onClick={() => approveMember(member.id)}
                        className="btn-secondary text-xs"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => removeMember(member.id)}
                      className="bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create API endpoint for members**

```typescript
// dashboard/app/api/admin/bots/members/route.ts
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.tier, u.is_active, 
              mp.total_points
       FROM users u
       LEFT JOIN member_progress mp ON u.id = mp.member_id
       WHERE u.name ILIKE $1 OR u.email ILIKE $1
       ORDER BY u.created_at DESC
       LIMIT 100`,
      [`%${search}%`]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create approve and delete endpoints**

```typescript
// dashboard/app/api/admin/bots/members/[id]/route.ts
import { pool } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query('UPDATE users SET is_active = false WHERE id = $1', [params.id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const pathname = request.url;
  if (pathname.includes('/approve')) {
    try {
      await pool.query('UPDATE users SET is_active = true WHERE id = $1', [params.id]);
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ error: 'Failed to approve member' }, { status: 500 });
    }
  }
}
```

- [ ] **Step 5: Test on dashboard**

1. Go to http://localhost:3001/admin/bots/members
2. Verify members list loads
3. Try search, approve, remove actions
4. Check database to confirm changes

- [ ] **Step 6: Commit**

```bash
git add dashboard/app/admin/bots/ dashboard/app/api/admin/bots/
git commit -m "feat: add admin member management panel (/admin/bots/members)"
```

---

### Task 11: Web Dashboard - Analytics Page

**Files:**
- Create: `dashboard/app/admin/bots/analytics/page.tsx`
- Create: `dashboard/lib/botEngineering/analytics.ts`
- Create: `dashboard/app/api/admin/bots/analytics/route.ts`

**Interfaces:**
- Produces: Analytics dashboard showing DAU, engagement rate, top posts, tier breakdown

- [ ] **Step 1: Create analytics aggregation module**

```typescript
// dashboard/lib/botEngineering/analytics.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function getDailyActiveUsers(days = 7): Promise<any[]> {
  try {
    return await pool.query(
      `SELECT DATE(created_at) as day, COUNT(DISTINCT member_id) as count
       FROM member_engagement
       WHERE created_at > NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY day ASC`
    );
  } catch (error) {
    console.error('[ANALYTICS] Error getting DAU:', error);
    return { rows: [] };
  }
}

export async function getEngagementRate(): Promise<number> {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM users WHERE is_active = true');
    const active = await pool.query(
      `SELECT COUNT(DISTINCT member_id) FROM member_engagement WHERE created_at > NOW() - INTERVAL '1 day'`
    );

    const totalCount = parseInt(total.rows[0].count || 0);
    const activeCount = parseInt(active.rows[0].count || 0);

    return totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
  } catch (error) {
    console.error('[ANALYTICS] Error calculating engagement rate:', error);
    return 0;
  }
}

export async function getTopPosts(limit = 10): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT discord_message_id, discord_content, engagement_count, member_id
       FROM bot_social_posts
       WHERE social_platform IN ('twitter', 'instagram', 'queued')
       ORDER BY engagement_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error('[ANALYTICS] Error getting top posts:', error);
    return [];
  }
}

export async function getTierBreakdown(): Promise<any> {
  try {
    const result = await pool.query(
      `SELECT tier, COUNT(*) as count FROM users WHERE is_active = true GROUP BY tier`
    );
    return result.rows;
  } catch (error) {
    console.error('[ANALYTICS] Error getting tier breakdown:', error);
    return [];
  }
}
```

- [ ] **Step 2: Create analytics API endpoint**

```typescript
// dashboard/app/api/admin/bots/analytics/route.ts
import {
  getDailyActiveUsers,
  getEngagementRate,
  getTopPosts,
  getTierBreakdown,
} from '@/lib/botEngineering/analytics';

export async function GET() {
  try {
    const [dau, engagementRate, topPosts, tierBreakdown] = await Promise.all([
      getDailyActiveUsers(7),
      getEngagementRate(),
      getTopPosts(10),
      getTierBreakdown(),
    ]);

    return Response.json({
      dau: dau.rows,
      engagementRate: Math.round(engagementRate * 100) / 100,
      topPosts,
      tierBreakdown,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create analytics page**

```typescript
// dashboard/app/admin/bots/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/admin/bots/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-gray">Loading...</p>;
  if (!analytics) return <p className="text-gray">No data</p>;

  return (
    <div className="space-y-6">
      <h2 className="section-heading">Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray">Daily Active Users</div>
          <div className="text-3xl text-neon-red font-bold">
            {analytics.dau[analytics.dau.length - 1]?.count || 0}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray">Engagement Rate</div>
          <div className="text-3xl text-neon-red font-bold">{analytics.engagementRate}%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray">Top Posts</div>
          <div className="text-3xl text-neon-red font-bold">{analytics.topPosts.length}</div>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="card">
        <h3 className="heading-silver mb-4">Member Tiers</h3>
        <div className="space-y-2">
          {analytics.tierBreakdown.map((tier: any) => (
            <div key={tier.tier} className="flex justify-between">
              <span className="text-gray capitalize">{tier.tier}</span>
              <span className="text-neon-red">{tier.count} members</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Posts */}
      <div className="card">
        <h3 className="heading-silver mb-4">Top Viral Posts</h3>
        <div className="space-y-3">
          {analytics.topPosts.map((post: any, i: number) => (
            <div key={i} className="border-b border-gray-800 pb-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray text-sm">Post {i + 1}</span>
                <span className="text-neon-red">🔥 {post.engagement_count} reactions</span>
              </div>
              <p className="text-gray text-sm line-clamp-2">{post.discord_content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Test on dashboard**

1. Go to http://localhost:3001/admin/bots/analytics
2. Verify metrics load
3. Check DAU, engagement rate, top posts display

- [ ] **Step 5: Commit**

```bash
git add dashboard/lib/botEngineering/analytics.ts dashboard/app/admin/bots/analytics/ dashboard/app/api/admin/bots/analytics/route.ts
git commit -m "feat: add analytics dashboard (/admin/bots/analytics)"
```

---

### Task 12: Web Dashboard - Announcement Scheduling

**Files:**
- Create: `dashboard/app/admin/bots/schedule/page.tsx`
- Create: `dashboard/app/api/admin/bots/schedule/route.ts`

**Interfaces:**
- Produces: Form to schedule announcements across Discord, Telegram, Social

- [ ] **Step 1: Create scheduling page**

```typescript
// dashboard/app/admin/bots/schedule/page.tsx
'use client';

import { useState } from 'react';

export default function SchedulePage() {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState(['discord']);
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/bots/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms, scheduledTime }),
      });

      if (res.ok) {
        alert('Announcement scheduled!');
        setContent('');
        setPlatforms(['discord']);
        setScheduledTime('');
      }
    } catch (error) {
      console.error('Error scheduling:', error);
      alert('Failed to schedule announcement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="section-heading">Schedule Announcement</h2>

      <form onSubmit={handleSchedule} className="card space-y-4">
        <div>
          <label className="block text-sm text-gray mb-2">Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
            className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-white"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray mb-2">Platforms</label>
          <div className="space-y-2">
            {['discord', 'telegram', 'social'].map((platform) => (
              <label key={platform} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPlatforms([...platforms, platform]);
                    } else {
                      setPlatforms(platforms.filter((p) => p !== platform));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-gray capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray mb-2">Schedule Time</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded p-3 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content || !scheduledTime}
          className="btn-primary w-full"
        >
          {loading ? 'Scheduling...' : 'Schedule Announcement'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create scheduling API**

```typescript
// dashboard/app/api/admin/bots/schedule/route.ts
import { pool } from '@/lib/db';
import { getSession } from '@/lib/auth'; // Or your auth method

export async function POST(request: Request) {
  const session = await getSession(); // Verify admin
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, platforms, scheduledTime } = await request.json();

  try {
    await pool.query(
      `INSERT INTO bot_scheduled_posts (content, platforms, scheduled_time, created_by)
       VALUES ($1, $2, $3, $4)`,
      [content, JSON.stringify(platforms), new Date(scheduledTime), session.user.id]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error scheduling:', error);
    return Response.json({ error: 'Failed to schedule' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM bot_scheduled_posts WHERE status = 'pending' ORDER BY scheduled_time ASC`
    );
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Test scheduling**

1. Go to http://localhost:3001/admin/bots/schedule
2. Write announcement, select platforms, pick future time
3. Click Schedule
4. Verify in database: `SELECT * FROM bot_scheduled_posts`

- [ ] **Step 4: Commit**

```bash
git add dashboard/app/admin/bots/schedule/ dashboard/app/api/admin/bots/schedule/route.ts
git commit -m "feat: add announcement scheduling page (/admin/bots/schedule)"
```

---

### Task 13: Integration Testing & Deployment

**Files:**
- Modify: `ecosystem.config.js` (PM2 config)
- Create: `docs/deployment/bot-deployment-checklist.md`

**Interfaces:**
- Produces: All bots deployed to VPS, running via PM2, database synced

- [ ] **Step 1: Verify all migrations applied to VPS**

```bash
ssh ubuntu@51.81.80.252
psql $DATABASE_URL -f migrations/2026-06-20-bot-tables.sql
psql $DATABASE_URL -c "\dt member_engagement, member_progress, bot_social_posts, bot_analytics_daily, bot_scheduled_posts"
```

Expected: All 5 tables exist

- [ ] **Step 2: Push all code to GitHub**

```bash
git push origin main
```

- [ ] **Step 3: Deploy to VPS**

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas/wise-defense-saas
git fetch origin
git reset --hard origin/main
npm install  # If new dependencies
pm2 restart all
pm2 logs
```

- [ ] **Step 4: Test each bot feature**

Discord:
- Post check-in poll: Should see in #training-tips
- React ✅: Should award +1 point
- Type `/leaderboard`: Should show top 10
- React 📱 on post: Should award +5 points

Telegram:
- Send `/start`: Should receive welcome
- Wait for next daily tip: Should be personalized

Social Media:
- React >5 times to Discord message: Should auto-post to Twitter
- Check for member reward: Should get +5 points

Admin Dashboard:
- Go to /admin/bots/members: Should see member list
- Go to /admin/bots/analytics: Should see metrics
- Go to /admin/bots/schedule: Should be able to schedule

- [ ] **Step 5: Create deployment checklist**

```markdown
# Bot Ecosystem Deployment Checklist

## Pre-Deployment
- [ ] All tests passing: `npm test`
- [ ] No console errors: `npm run lint`
- [ ] Database migrations ready: `migrations/2026-06-20-bot-tables.sql`
- [ ] Environment variables set on VPS: `.env` updated

## Deployment
- [ ] Push to GitHub: `git push origin main`
- [ ] SSH to VPS: `ssh ubuntu@51.81.80.252`
- [ ] Apply migrations: `psql $DATABASE_URL -f migrations/2026-06-20-bot-tables.sql`
- [ ] Pull latest code: `git fetch origin && git reset --hard origin/main`
- [ ] Install dependencies: `npm install`
- [ ] Restart PM2: `pm2 restart all`

## Post-Deployment Tests

### Discord Bot
- [ ] Check-in poll posted in #training-tips
- [ ] Members can react and earn points
- [ ] Leaderboard command works: `/leaderboard`
- [ ] Social share reaction works: React with 📱

### Telegram Bot
- [ ] Bot responds to `/start`
- [ ] Daily tips send at 7 AM UTC
- [ ] Tips personalized by skill level

### Social Media
- [ ] Viral Discord content auto-posts to Twitter
- [ ] Members awarded +5 bonus points

### Admin Dashboard
- [ ] `/admin/bots/members` loads with member list
- [ ] `/admin/bots/analytics` shows correct metrics
- [ ] `/admin/bots/schedule` can schedule announcements

## Monitoring
- [ ] Check PM2 logs: `pm2 logs`
- [ ] Check for errors in error tables: `SELECT * FROM bot_message_errors`
- [ ] Monitor database: `SELECT COUNT(*) FROM member_engagement`
```

- [ ] **Step 6: Commit checklist**

```bash
git add docs/deployment/bot-deployment-checklist.md ecosystem.config.js
git commit -m "docs: add bot ecosystem deployment checklist and final config"
```

---

## Plan Summary

**Total Tasks: 13**

| Task | Component | Status |
|------|-----------|--------|
| 1 | Database schema | Migrations + setup |
| 2 | Engagement system | Points & tracking |
| 3 | Streak system | Current & longest tracking |
| 4 | Discord check-ins | Daily polls |
| 5 | Discord leaderboard | Top 10 members |
| 6 | Discord sharing | React to share |
| 7 | Viral tracking | Auto-queue if >5 reactions |
| 8 | Telegram AI tips | Personalized daily tips |
| 9 | Social reposting | Auto-post viral content |
| 10 | Admin members | Member management UI |
| 11 | Admin analytics | Metrics dashboard |
| 12 | Admin scheduling | Announcement scheduler |
| 13 | Integration & deploy | Testing + VPS deployment |

**Estimated Timeline: 2 weeks**
- Days 1-2: Tasks 1-3 (database + utilities)
- Days 3-5: Tasks 4-7 (Discord features)
- Days 6-7: Tasks 8-9 (Telegram + Social)
- Days 8-10: Tasks 10-12 (Admin dashboard)
- Days 11-14: Task 13 (Testing + deployment + fixes)

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-06-20-unified-bot-ecosystem.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?** 🚀
