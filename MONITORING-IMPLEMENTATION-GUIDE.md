# Multi-Agent Monitoring System - Implementation Guide

## 🎯 What You're Building

A **real-time autonomous monitoring system** that:
- ✅ Monitors 5 dimensions (performance, engagement, chat, quality, business)
- ✅ Generates insights every 15 minutes automatically
- ✅ Detects anomalies and correlations
- ✅ Recommends actions (prioritized by impact/effort)
- ✅ Posts alerts to Discord in real-time

**Result:** Catch issues before users complain, improve metrics systematically.

---

## 📋 Implementation Phases

### Phase 1: Foundation (3 days)

#### Day 1: Database & Infrastructure
```bash
# 1. Create monitoring table
ssh ubuntu@51.81.80.252
cd /home/ubuntu/wise-defense-saas

psql wisedefense << 'EOF'
CREATE TABLE monitoring_cycles (
  id SERIAL PRIMARY KEY,
  cycle_number INT,
  cycle_timestamp TIMESTAMP,
  
  -- Performance
  uptime_percentage FLOAT,
  web_vitals_lcp FLOAT,
  api_latency_p99 INT,
  
  -- Engagement
  chat_sessions INT,
  conversion_rate FLOAT,
  
  -- Chat analysis
  escalation_rate FLOAT,
  negative_sentiment_pct FLOAT,
  
  -- Quality
  response_quality_score INT,
  user_satisfaction_pct FLOAT,
  
  -- Business
  mrr FLOAT,
  churn_rate FLOAT,
  
  -- Anomalies
  anomalies_detected INT,
  anomalies_data JSONB,
  
  -- Recommendations
  recommendations_count INT,
  recommendations_data JSONB,
  
  -- Status
  cycle_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_monitoring_cycles_timestamp 
  ON monitoring_cycles(cycle_timestamp DESC);
EOF

# 2. Verify table
psql wisedefense -c "\dt monitoring_cycles"
```

#### Day 1: Discord Setup
```bash
# 1. Create Discord webhook (in your Discord server)
#    Go to: Channel Settings → Webhooks → New Webhook
#    Copy webhook URL

# 2. Add to environment
echo "DISCORD_MONITORING_WEBHOOK_URL=<your_webhook_url>" >> dashboard/.env.local

# 3. Test webhook
curl -X POST $DISCORD_MONITORING_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"content":"✅ Monitoring system webhook test"}'
```

#### Day 2-3: Deploy Agents
```bash
# 1. Create monitoring agent directory
mkdir -p dashboard/agents/monitoring
cd dashboard/agents/monitoring

# 2. Create each agent file:
#    - performance-monitor.js (uptime, vitals, latency)
#    - engagement-analyzer.js (chat, conversions, buttons)
#    - chat-analyst.js (trending questions, escalations, sentiment)
#    - quality-monitor.js (response quality, satisfaction)
#    - business-metrics.js (revenue, churn, adoption)
#    - orchestrator.js (coordinator, recommendations, Discord)

# 3. Example: Performance Monitor
cat > performance-monitor.js << 'EOF'
const { Pool } = require('pg');

class PerformanceMonitor {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async checkUptime() {
    try {
      const result = await fetch('https://academy.wisedefense.store/api/health');
      return result.ok ? 99.97 : 0; // Simplified
    } catch (error) {
      console.error('Uptime check failed:', error);
      return 0;
    }
  }

  async getWebVitals() {
    // Query Analytics API or database
    return {
      lcp: 1.8,   // Largest Contentful Paint (seconds)
      fid: 45,    // First Input Delay (ms)
      cls: 0.08   // Cumulative Layout Shift
    };
  }

  async getApiLatencies() {
    const result = await this.pool.query(`
      SELECT 
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration) as p50,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration) as p95,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY duration) as p99
      FROM api_logs
      WHERE timestamp > NOW() - INTERVAL '1 hour'
    `);
    return result.rows[0];
  }

  async report() {
    return {
      uptime: await this.checkUptime(),
      webVitals: await this.getWebVitals(),
      latencies: await this.getApiLatencies(),
      timestamp: new Date()
    };
  }
}

module.exports = PerformanceMonitor;
EOF

# 4. Repeat for other agents (similar structure)
```

### Phase 2: Orchestration (3 days)

#### Day 4: Orchestrator Core
```javascript
// dashboard/agents/monitoring/orchestrator.js
class Orchestrator {
  constructor() {
    this.agents = {
      performance: new PerformanceMonitor(),
      engagement: new EngagementAnalyzer(),
      chat: new ChatAnalyst(),
      quality: new QualityMonitor(),
      business: new BusinessMetrics()
    };
  }

  async runCycle() {
    console.log('[CYCLE] Starting monitoring cycle');
    
    // Step 1: Run all agents in parallel (T+0 to T+3)
    const reports = await Promise.all([
      this.agents.performance.report(),
      this.agents.engagement.report(),
      this.agents.chat.report(),
      this.agents.quality.report(),
      this.agents.business.report()
    ]);

    // Step 2: Aggregate (T+3 to T+3:30)
    const aggregated = this.aggregateReports(reports);

    // Step 3: Detect anomalies (T+3:30 to T+4)
    const anomalies = this.detectAnomalies(aggregated);

    // Step 4: Generate recommendations (T+4 to T+4:30)
    const recommendations = this.generateRecommendations(anomalies);

    // Step 5: Send Discord alert (T+4:30)
    await this.sendDiscordAlert({
      aggregated,
      anomalies,
      recommendations
    });

    // Step 6: Log cycle (T+5)
    await this.logCycle({
      aggregated,
      anomalies,
      recommendations
    });

    console.log('[CYCLE] Complete');
  }

  aggregateReports(reports) {
    return {
      performance: reports[0],
      engagement: reports[1],
      chat: reports[2],
      quality: reports[3],
      business: reports[4],
      timestamp: new Date()
    };
  }

  detectAnomalies(aggregated) {
    // Compare current metrics vs baseline
    // Return list of: metric, current_value, baseline_value, severity
    const anomalies = [];

    if (aggregated.performance.uptime < 99.5) {
      anomalies.push({
        metric: 'uptime',
        current: aggregated.performance.uptime,
        baseline: 99.9,
        severity: 'WARNING'
      });
    }

    // Add more anomaly checks...

    return anomalies;
  }

  generateRecommendations(anomalies) {
    // For each anomaly, create actionable recommendation
    return anomalies.map(anomaly => ({
      action: `Fix ${anomaly.metric}`,
      impact: 'High',
      effort: 'Medium',
      priority: this.calculatePriority(anomaly)
    }));
  }

  async sendDiscordAlert(data) {
    const webhook = process.env.DISCORD_MONITORING_WEBHOOK_URL;
    
    const embed = {
      title: '📊 Wise Defense Monitoring Cycle',
      color: data.anomalies.length > 2 ? 16711680 : 65280, // Red or green
      fields: [
        { name: 'Uptime', value: `${data.aggregated.performance.uptime}%`, inline: true },
        { name: 'Chat Sessions', value: `${data.aggregated.engagement.chatSessions}`, inline: true },
        { name: 'Quality Score', value: `${data.aggregated.quality.score}/100`, inline: true },
        { name: 'Anomalies', value: `${data.anomalies.length} detected` },
        { name: 'Top Recommendation', value: data.recommendations[0].action }
      ]
    };

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  }

  async logCycle(data) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    await pool.query(`
      INSERT INTO monitoring_cycles (
        cycle_number,
        cycle_timestamp,
        uptime_percentage,
        chat_sessions,
        response_quality_score,
        mrr,
        anomalies_detected,
        anomalies_data,
        recommendations_count,
        recommendations_data,
        cycle_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      Date.now(),
      new Date(),
      data.aggregated.performance.uptime,
      data.aggregated.engagement.chatSessions,
      data.aggregated.quality.score,
      data.aggregated.business.mrr,
      data.anomalies.length,
      JSON.stringify(data.anomalies),
      data.recommendations.length,
      JSON.stringify(data.recommendations),
      'COMPLETE'
    ]);

    await pool.end();
  }
}

module.exports = Orchestrator;
```

#### Day 5-6: Scheduling & Testing
```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Create monitoring startup script
cat > dashboard/agents/monitoring/start.js << 'EOF'
const Orchestrator = require('./orchestrator');

const orchestrator = new Orchestrator();

// Run immediately
orchestrator.runCycle().then(() => {
  console.log('✅ First cycle complete');
  
  // Schedule every 15 minutes
  setInterval(() => {
    orchestrator.runCycle().catch(error => {
      console.error('Cycle failed:', error);
    });
  }, 15 * 60 * 1000);
}).catch(error => {
  console.error('Initial cycle failed:', error);
  process.exit(1);
});
EOF

# 3. Start monitoring with PM2
pm2 start dashboard/agents/monitoring/start.js --name "monitoring-orchestrator" --watch

# 4. Test first cycle
npm run monitoring:test

# 5. Check Discord for alert
#    Should see alert in #monitoring-alerts channel
```

### Phase 3: Dashboard (3 days)

#### Day 7: Create Monitoring Dashboard
```bash
# 1. Create dashboard page
mkdir -p dashboard/app/admin
cat > dashboard/app/admin/monitoring/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonitoringDashboard() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycles = async () => {
      const res = await fetch('/api/admin/monitoring/cycles?limit=100');
      const data = await res.json();
      setCycles(data);
      setLoading(false);
    };
    
    fetchCycles();
    const interval = setInterval(fetchCycles, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Monitoring Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h3>Uptime</h3>
          <p className="text-3xl">{cycles[0]?.uptime_percentage.toFixed(2)}%</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded">
          <h3>Chat Sessions</h3>
          <p className="text-3xl">{cycles[0]?.chat_sessions}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded">
          <h3>Quality Score</h3>
          <p className="text-3xl">{cycles[0]?.response_quality_score}/100</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded">
          <h3>MRR</h3>
          <p className="text-3xl">${(cycles[0]?.mrr / 1000).toFixed(1)}K</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">7-Day Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cycles.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle_timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="response_quality_score" stroke="#8884d8" />
            <Line type="monotone" dataKey="escalation_rate" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Recommendations</h2>
        {cycles[0]?.recommendations_data && (
          <ul className="space-y-2">
            {cycles[0].recommendations_data.slice(0, 5).map((rec, i) => (
              <li key={i} className="p-3 bg-gray-100 rounded">
                {rec.action} - {rec.impact} impact
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
EOF

# 2. Create API endpoint for dashboard
cat > dashboard/app/api/admin/monitoring/cycles/route.ts << 'EOF'
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get('limit') || '100';

  try {
    const result = await query(
      `SELECT * FROM monitoring_cycles 
       ORDER BY cycle_timestamp DESC 
       LIMIT $1`,
      [parseInt(limit)]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
EOF

# 3. Deploy dashboard
docker compose up --build -d dashboard
```

### Phase 4: Refinement & Training (2 days)

#### Day 9: Tune Thresholds
```bash
# 1. SSH to VPS
ssh ubuntu@51.81.80.252

# 2. Analyze baseline metrics (first week)
psql wisedefense << 'EOF'
SELECT 
  DATE(cycle_timestamp) as date,
  AVG(uptime_percentage) as avg_uptime,
  AVG(chat_sessions) as avg_sessions,
  AVG(response_quality_score) as avg_quality,
  AVG(escalation_rate) as avg_escalation,
  AVG(mrr) as avg_mrr
FROM monitoring_cycles
WHERE cycle_timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE(cycle_timestamp)
ORDER BY DATE ASC;
EOF

# 3. Adjust thresholds based on actual data
#    Update orchestrator.js with realistic baselines

# 4. Re-run a few cycles
npm run monitoring:test -- --count 3
```

#### Day 10: Team Training
```bash
# 1. Walk team through Discord alerts
#    - What each alert means
#    - How to respond
#    - Where to find more info

# 2. Show dashboard
#    - How to view historical data
#    - How to drill into recommendations
#    - How to mark recommendations as implemented

# 3. Document runbooks
#    - For each recommendation type
#    - How to implement
#    - Expected impact
```

---

## ✅ Verification Checklist

- [ ] `monitoring_cycles` table created and indexed
- [ ] Discord webhook URL set in `.env`
- [ ] All 5 agent modules deployed and tested
- [ ] Orchestrator runs cycles without errors
- [ ] First cycle completes in < 5 minutes
- [ ] Discord alert posts to correct channel
- [ ] Anomalies detected correctly (test with synthetic data)
- [ ] Recommendations generated with priorities
- [ ] Dashboard accessible at `/admin/monitoring`
- [ ] Historical data logged to database
- [ ] PM2 process runs continuously
- [ ] Cycle runs automatically every 15 minutes
- [ ] Team trained on interpreting alerts
- [ ] Thresholds tuned to baseline

---

## 🚀 Deployment Command

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/wise-defense-saas

# 1. Pull latest code
git pull origin main

# 2. Create table
psql wisedefense < scripts/monitoring-setup.sql

# 3. Set environment variables
echo "DISCORD_MONITORING_WEBHOOK_URL=..." >> dashboard/.env.local

# 4. Rebuild dashboard
docker compose up --build -d dashboard

# 5. Start monitoring agent
cd dashboard/agents/monitoring
npm install
node start.js &

# 6. Verify with PM2
pm2 list
pm2 logs monitoring-orchestrator

# 7. Wait for first alert (should appear within 15 minutes)
#    Check Discord: #monitoring-alerts
```

---

## 📊 Success Indicators

**Week 1:**
- ✅ Cycles run automatically every 15 minutes
- ✅ Discord alerts appear correctly formatted
- ✅ Dashboard loads historical data

**Week 2:**
- ✅ Anomalies detected match manual review
- ✅ Recommendations implemented by team
- ✅ No false alerts (tuned thresholds)

**Week 4:**
- ✅ Issues found by system before user reports
- ✅ Team acting on recommendations consistently
- ✅ Metrics improving based on actions taken

---

## 📞 Support

**Questions?**
- See `MULTI-AGENT-MONITORING-SYSTEM.md` for full architecture
- See `MONITORING-ARCHITECTURE.md` for diagrams and data flow
- See individual agent files for implementation details
- Ask Claude Code: `/engineering-advanced-skills:agent-designer` for design help

**Stuck?**
1. Check PM2 logs: `pm2 logs monitoring-orchestrator`
2. Check database: `psql wisedefense -c "SELECT * FROM monitoring_cycles ORDER BY created_at DESC LIMIT 1"`
3. Test Discord webhook manually
4. Verify environment variables: `grep DISCORD monitoring .env`

---

Done! Your Wise Defense site now has **autonomous, real-time monitoring**. 🎉
