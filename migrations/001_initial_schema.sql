-- Wise Defense Premium Platform - Initial Schema
-- Defines all core tables: users, memberships, sessions, payments, analytics, premium_features, notifications, audit_logs

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Membership tiers: "free", "pro", "enterprise"
-- Each user can have one active membership; price_cents stores the normalized tier cost
CREATE TABLE IF NOT EXISTS memberships (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  price_cents INTEGER NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  renewal_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- Training sessions: each session can have 1..N student IDs (stored as PostgreSQL BIGINT array)
-- Each student is a user_id who joined this session
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  instructor_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  student_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  recording_url VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_instructor_id ON sessions(instructor_id);
CREATE INDEX idx_sessions_status ON sessions(status);

-- Payment transactions linked to memberships
-- Can represent: new memberships, renewals, upgrades, or manual payments
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  membership_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  external_transaction_id VARCHAR(255),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_membership_id ON payments(membership_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Premium features: per-user feature access, tied to membership tier
-- Example rows: "advanced_analytics", "priority_support", "multi_user_accounts", etc.
CREATE TABLE IF NOT EXISTS premium_features (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_premium_features_user_id ON premium_features(user_id);
CREATE INDEX idx_premium_features_feature_name ON premium_features(feature_name);

-- Analytics: track key metrics per user
-- Examples: courses_completed, sessions_attended, login_count, api_calls, etc.
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value INTEGER DEFAULT 0,
  recorded_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_metric_name ON analytics(metric_name);

-- Notifications: in-app or email notifications sent to users
-- Status: "sent", "failed", "pending", "read"
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'sent',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Audit logs: immutable record of sensitive operations
-- Examples: "LOGIN", "MEMBERSHIP_UPGRADE", "PAYMENT_PROCESSED", "USER_CREATED", etc.
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id BIGINT,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
