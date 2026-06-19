-- AI Customer Service Assistant Tables

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL DEFAULT 'web' CHECK (channel IN ('web', 'discord', 'telegram', 'api')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'resolved', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversation messages
CREATE TABLE IF NOT EXISTS conversation_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets (for escalated conversations)
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Ticket responses from support agents
CREATE TABLE IF NOT EXISTS ticket_responses (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  responder_type VARCHAR(50) NOT NULL CHECK (responder_type IN ('ai', 'human', 'system')),
  responder_id INTEGER REFERENCES users(id),
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge base for AI training
CREATE TABLE IF NOT EXISTS knowledge_base (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer feedback on AI responses
CREATE TABLE IF NOT EXISTS chat_feedback (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  message_id INTEGER REFERENCES conversation_messages(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics view
CREATE TABLE IF NOT EXISTS chat_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  escalation_rate DECIMAL(5, 2) DEFAULT 0,
  avg_rating DECIMAL(3, 2),
  peak_hour INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conv ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_role ON conversation_messages(role);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created ON conversation_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket ON ticket_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_topic ON knowledge_base(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_conversation ON chat_feedback(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_date ON chat_analytics(date);

-- Initial knowledge base entries
INSERT INTO knowledge_base (category, topic, content, source) VALUES
('Pricing', 'Membership Tiers', 'Starter: $99/month - Beginner fundamentals course with access to community forum. Pro: $199/month - Includes all Starter features plus Concealed Carry course and personalized coaching. VIP: $399/month - Premium package with all courses, 1-on-1 coaching sessions, priority support, and certification programs.', 'platform'),
('Booking', 'How to Book Sessions', 'Navigate to the Booking section from your dashboard. Select your desired date and time. Choose the session type (Beginner, Intermediate, Advanced). Click "Book Session". You''ll receive a confirmation email with session details.', 'platform'),
('Training', 'Beginner Fundamentals', 'Our foundational course covers safety protocols, grip and stance, sight alignment, trigger control, and range drills. Ideal for first-time shooters. 4-6 weeks, 8 sessions. Topics: gun safety, proper grip, stance, sight picture, trigger press, clearing malfunctions.', 'platform'),
('Training', 'Concealed Carry', 'Advanced course on self-defense techniques, carry methods, situational awareness, and tactical scenarios. 6-8 weeks, 12 sessions. Prerequisite: Beginner Fundamentals or instructor approval.', 'platform'),
('Membership', 'Cancellation Policy', 'You can cancel anytime with 7 days notice. No questions asked. You''ll retain access through the end of your billing cycle. Refunds are not issued for partial months.', 'platform'),
('Features', 'Leaderboards', 'Compete with other students on our real-time leaderboards. Rankings based on drill scores. Compete all-time, monthly, or weekly. Top performers featured on homepage.', 'platform'),
('Features', 'Achievements', 'Earn achievements by completing milestones: First Shot, Perfect Accuracy (100% score), Speedster (10 drills), Dedicated (50 drills), Week Warrior (7-day streak), Unstoppable (30-day streak), Influencer (social share), Recruiter (5 referrals).', 'platform'),
('Support', 'Getting Help', 'Contact support via this chat widget, Discord, Telegram, or email support@wisedefense.com. Average response time: 2 hours during business hours (8am-6pm EST, Mon-Fri). For urgent issues, call 1-800-WISE-DEF.', 'platform');
