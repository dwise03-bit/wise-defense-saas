-- migrations/2026-06-20-bot-tables.sql
-- Bot Ecosystem Database Tables

-- Member engagement tracking
CREATE TABLE IF NOT EXISTS member_engagement (
  id BIGSERIAL PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  points_awarded INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_member_engagement_member_action ON member_engagement(member_id, action_type);
CREATE INDEX IF NOT EXISTS idx_member_engagement_created ON member_engagement(created_at);

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
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_member_progress_streak ON member_progress(streak_current);
CREATE INDEX IF NOT EXISTS idx_member_progress_points ON member_progress(total_points);

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
  caption TEXT
);
CREATE INDEX IF NOT EXISTS idx_bot_social_posts_member ON bot_social_posts(member_id);
CREATE INDEX IF NOT EXISTS idx_bot_social_posts_platform ON bot_social_posts(social_platform);

-- Daily analytics snapshot
CREATE TABLE IF NOT EXISTS bot_analytics_daily (
  id BIGSERIAL PRIMARY KEY,
  day DATE UNIQUE,
  dau_count INT,
  engagement_rate DECIMAL(5,2),
  top_post_id VARCHAR(100),
  tier_breakdown JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bot_analytics_daily_day ON bot_analytics_daily(day);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS bot_scheduled_posts (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  platforms JSONB NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  posted_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bot_scheduled_posts_scheduled_time ON bot_scheduled_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_bot_scheduled_posts_status ON bot_scheduled_posts(status);
