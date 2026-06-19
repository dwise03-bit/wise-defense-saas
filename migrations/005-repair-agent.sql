-- Repair Agent tables for system monitoring and auto-recovery

-- Agent health tracking
CREATE TABLE IF NOT EXISTS agent_health (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(255) NOT NULL,
  status JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System health monitoring
CREATE TABLE IF NOT EXISTS system_health (
  id SERIAL PRIMARY KEY,
  component VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('healthy', 'unhealthy', 'warning')),
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Repair log for tracking auto-recovery actions
CREATE TABLE IF NOT EXISTS repair_log (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Health reports - regular summaries
CREATE TABLE IF NOT EXISTS health_reports (
  id SERIAL PRIMARY KEY,
  report_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_agent_health_agent ON agent_health(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_health_created ON agent_health(created_at);
CREATE INDEX IF NOT EXISTS idx_system_health_component ON system_health(component);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health(timestamp);
CREATE INDEX IF NOT EXISTS idx_repair_log_agent ON repair_log(agent_name);
CREATE INDEX IF NOT EXISTS idx_repair_log_created ON repair_log(created_at);
CREATE INDEX IF NOT EXISTS idx_repair_log_status ON repair_log(status);
CREATE INDEX IF NOT EXISTS idx_health_reports_created ON health_reports(created_at);

-- Set retention policy (keep 30 days of data)
-- Tables will auto-cleanup via the repair agent's cleanup task
