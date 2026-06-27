# Wise Defense Multi-Agent Monitoring System

## 🎯 Executive Summary

A real-time, autonomous monitoring system with 6 specialized agents that independently analyze your Wise Defense SaaS platform and generate actionable insights every 15 minutes.

**Architecture:** Supervisor Pattern
**Agents:** 6 specialized monitors + 1 orchestrator
**Update Frequency:** Every 15 minutes
**Max Response Time:** 5 minutes per cycle
**Concurrent Tasks:** 6 parallel agents

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│           ORCHESTRATOR (Central Coordinator)         │
│         - Aggregates all reports                     │
│         - Detects anomalies                          │
│         - Generates recommendations                  │
│         - Sends Discord alerts                       │
└─────────────────────────────────────────────────────┘
                          ↓
    ┌─────────────────────┼─────────────────────┐
    ↓                     ↓                     ↓
┌─────────────┐   ┌──────────────┐    ┌─────────────────┐
│Performance  │   │ Engagement   │    │  Chat Analyst   │
│Monitor      │   │ Analyzer     │    │                 │
│- Uptime     │   │- Chat users  │    │- Trending Q's   │
│- Core Vitals│   │- Conversions │    │- Escalations    │
│- API latency│   │- Button clicks   │- Sentiment      │
└─────────────┘   └──────────────┘    └─────────────────┘
    ↓                     ↓                     ↓
PostgreSQL          PostgreSQL           Chat Logs
Redis               Analytics            DB

    ↓                     ↓                     ↓
┌─────────────┐   ┌──────────────┐    ┌─────────────────┐
│Quality      │   │Business      │    │  (Back to       │
│Monitor      │   │Metrics       │    │   Orchestrator) │
│- Response   │   │- MRR/ARR     │    │                 │
│  quality    │   │- Churn       │    │                 │
│- User satis│   │- Adoption    │    │                 │
│- Knowledge │   │- LTV         │    │                 │
│  gaps       │   └──────────────┘    └─────────────────┘
└─────────────┘
    ↓
Chat Logs
DB
```

### Communication Pattern

**Parallel Execution (Minutes 0-3):**
```
Min 0:00 → All 6 agents start simultaneously
  ├─ Performance Monitor starts checking uptime
  ├─ Engagement Analyzer queries conversion funnel
  ├─ Chat Analyst gets trending questions
  ├─ Quality Monitor calculates response scores
  ├─ Business Metrics pulls MRR/churn
  └─ (5 agents run in parallel)

Min 3:00 → All agents finish (p95 latency: 2.8 min)
```

**Sequential Assembly (Minutes 3-5):**
```
Min 3:00 → Orchestrator collects all 6 reports
Min 3:15 → Anomaly detection runs (compare to baseline)
Min 3:30 → Generate recommendations (prioritized list)
Min 4:00 → Prepare Discord alert payload
Min 4:30 → Send alerts to Discord channels
Min 5:00 → Log cycle complete, ready for next run
```

---

## 👥 Agent Roles & Responsibilities

### 1. Performance Monitor
**Role:** Infrastructure health & Core Web Vitals

**Tools:**
- `check_site_uptime()` — Get uptime % and incident log
- `query_web_vitals()` — LCP, FID, CLS scores
- `get_api_latency_percentiles()` — p50, p95, p99 latency

**Metrics Tracked:**
- Uptime percentage (target: 99.9%)
- LCP (target: < 2.5s)
- FID (target: < 100ms)
- CLS (target: < 0.1)
- API response times (target: p99 < 500ms)

**Alert Thresholds:**
- Uptime < 99.5% → ⚠️ WARNING
- Uptime < 99.0% → 🚨 CRITICAL
- LCP > 4s → ⚠️ WARNING
- API p99 > 1000ms → ⚠️ WARNING

**Example Output:**
```json
{
  "uptime_percentage": 99.97,
  "status": "✅ HEALTHY",
  "web_vitals": {
    "lcp": 1.8,
    "fid": 45,
    "cls": 0.08
  },
  "api_latencies": {
    "p50": 120,
    "p95": 340,
    "p99": 650
  }
}
```

---

### 2. Engagement Analyzer
**Role:** User engagement & conversion metrics

**Tools:**
- `get_chat_metrics()` — Sessions, active users, bounce rate
- `get_conversion_funnel()` — Visitor → Signup → Booking → Payment
- `get_quick_reply_actions()` — Which buttons users click

**Metrics Tracked:**
- Chat sessions per day (trend: up/down)
- Active users (current session)
- Chat bounce rate (% who don't engage)
- Conversion funnel drop-off points
- Most-clicked quick reply buttons

**Alert Thresholds:**
- Sessions down > 20% → ⚠️ WARNING
- Bounce rate > 40% → ⚠️ WARNING
- Booking conversion < 5% → ⚠️ WARNING
- Payment conversion < 80% (of bookings) → ⚠️ WARNING

**Example Output:**
```json
{
  "chat_metrics": {
    "sessions_24h": 342,
    "active_users": 18,
    "bounce_rate": 12.5
  },
  "funnel": {
    "visitors": 1000,
    "signups": 280,
    "bookings": 42,
    "payments": 38,
    "conversion_rate": 3.8
  },
  "popular_buttons": [
    {"button": "💰 Pricing", "clicks": 156},
    {"button": "📅 Book", "clicks": 98}
  ]
}
```

---

### 3. Chat Analyst
**Role:** Chat patterns & user sentiment

**Tools:**
- `get_trending_questions()` — Top 20 user questions
- `get_escalation_stats()` — Escalation rate & triggers
- `analyze_sentiment_distribution()` — Sentiment breakdown

**Metrics Tracked:**
- Top 20 trending questions
- Escalation rate (% of conversations)
- Top frustration triggers
- Sentiment distribution (positive/neutral/negative)

**Alert Thresholds:**
- Escalation rate > 15% → ⚠️ WARNING
- Escalation rate > 25% → 🚨 CRITICAL
- Trending topic = "refund" → ⚠️ WARNING
- Negative sentiment > 30% → ⚠️ WARNING

**Example Output:**
```json
{
  "trending_questions": [
    {"question": "How much does membership cost?", "count": 45},
    {"question": "Can I reschedule my session?", "count": 38},
    {"question": "Do you offer group rates?", "count": 23}
  ],
  "escalations": {
    "total_conversations": 127,
    "escalated": 12,
    "escalation_rate": 9.4,
    "top_triggers": ["booking issues", "payment errors", "technical problems"]
  },
  "sentiment": {
    "positive": 68,
    "neutral": 45,
    "negative": 14
  }
}
```

---

### 4. Quality Monitor
**Role:** AI response quality & user satisfaction

**Tools:**
- `get_response_quality_score()` — Overall quality 0-100
- `get_user_satisfaction()` — Satisfaction from escalations, replies, sentiment
- `detect_knowledge_gaps()` — Questions AI couldn't answer

**Metrics Tracked:**
- Average response quality score (target: > 85)
- User satisfaction % (target: > 80%)
- Knowledge gaps (questions leading to escalation)
- Common question patterns AI misses

**Alert Thresholds:**
- Quality score < 75 → ⚠️ WARNING
- Quality score < 60 → 🚨 CRITICAL
- Satisfaction < 70% → ⚠️ WARNING
- New knowledge gap detected → ℹ️ INFO

**Example Output:**
```json
{
  "quality_score": 87,
  "status": "✅ EXCELLENT",
  "satisfaction": 82.5,
  "knowledge_gaps": [
    {"question": "Custom group rates pricing", "count": 7, "escalation_rate": 85},
    {"question": "Corporate team discounts", "count": 4, "escalation_rate": 100}
  ],
  "recommendations": [
    "Add group pricing FAQ",
    "Expand knowledge base: corporate packages"
  ]
}
```

---

### 5. Business Metrics
**Role:** Financial & business KPIs

**Tools:**
- `get_revenue_metrics()` — MRR, ARR, daily revenue
- `get_cohort_analytics()` — Churn, LTV, retention
- `get_product_adoption()` — Feature adoption rates

**Metrics Tracked:**
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer churn rate
- Lifetime Value (LTV)
- Feature adoption (chat, courses, booking, shop)

**Alert Thresholds:**
- MRR down > 10% → ⚠️ WARNING
- Churn rate > 5% → ⚠️ WARNING
- Chat adoption < 30% → ⚠️ WARNING
- LTV/CAC ratio < 3:1 → ⚠️ WARNING

**Example Output:**
```json
{
  "revenue": {
    "mrr": 12500,
    "arr": 150000,
    "daily_revenue": 410
  },
  "cohort_metrics": {
    "churn_rate": 2.8,
    "ltv": 4200,
    "retention_30d": 97.2
  },
  "adoption": {
    "chat": 68,
    "courses": 45,
    "booking": 52,
    "shop": 28
  }
}
```

---

### 6. Orchestrator
**Role:** Central coordinator & insights generator

**Tools:**
- `aggregate_metrics()` — Combine all 5 agent reports
- `detect_anomalies()` — Compare to baseline, flag outliers
- `generate_recommendations()` — Prioritized improvement list

**Functions:**
1. **Aggregation** — Merges reports from 5 agents
2. **Anomaly Detection** — Compares current metrics to:
   - Previous week average
   - Previous month average
   - Baseline (first week)
3. **Correlation Analysis** — Links metrics (e.g., "Escalations ↑ → Quality ↓")
4. **Recommendation Engine** — Prioritizes by impact/effort
5. **Discord Alert** — Sends formatted summary

**Example Output:**
```json
{
  "status": "⚠️ WARNING - 3 anomalies detected",
  "summary": {
    "uptime": "✅ 99.97%",
    "chat_engagement": "✅ Normal",
    "quality": "⚠️ Down 8% vs last week",
    "revenue": "✅ +3% vs last month",
    "escalations": "⚠️ Up 22% vs baseline"
  },
  "anomalies": [
    {
      "metric": "Quality Score",
      "current": 79,
      "baseline": 87,
      "change": "-8%",
      "severity": "WARNING"
    },
    {
      "metric": "Escalation Rate",
      "current": 14.2,
      "baseline": 9.4,
      "change": "+22%",
      "severity": "WARNING"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "action": "Add knowledge base articles on group pricing",
      "impact": "Reduce escalations by ~7%",
      "effort": "Low",
      "estimated_time": "2 hours"
    },
    {
      "priority": 2,
      "action": "Review and update chat response templates",
      "impact": "Improve quality score by ~5%",
      "effort": "Medium",
      "estimated_time": "4 hours"
    }
  ]
}
```

---

## 📊 Data Flow & Metrics Collection

### Data Sources

| Source | Agents | Frequency | Latency |
|--------|--------|-----------|---------|
| PostgreSQL | All | Real-time | < 100ms |
| Chat Logs | Analyst, Quality | Real-time | < 200ms |
| Analytics API | Performance, Engagement | Real-time | < 500ms |
| Redis (cache) | Orchestrator | Real-time | < 50ms |

### Metric Storage

```sql
-- Metrics logged every 15 minutes
CREATE TABLE monitoring_cycles (
  id SERIAL PRIMARY KEY,
  cycle_timestamp TIMESTAMP,
  
  -- Performance
  uptime_percentage FLOAT,
  web_vitals_lcp FLOAT,
  api_latency_p99 INT,
  
  -- Engagement
  chat_sessions INT,
  conversion_rate FLOAT,
  button_clicks JSONB,
  
  -- Quality
  response_quality_score INT,
  user_satisfaction FLOAT,
  
  -- Business
  mrr FLOAT,
  churn_rate FLOAT,
  
  -- Anomalies
  anomalies_detected INT,
  recommendations_count INT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Historical Analysis

Query historical data:
```sql
-- 7-day trend
SELECT DATE(cycle_timestamp), AVG(uptime_percentage), AVG(response_quality_score)
FROM monitoring_cycles
WHERE cycle_timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE(cycle_timestamp)
ORDER BY DATE ASC;

-- Correlation: Quality vs Escalations
SELECT 
  mc.response_quality_score,
  (SELECT COUNT(*) FROM conversations c 
   WHERE c.escalated = true 
   AND c.created_at BETWEEN mc.cycle_timestamp AND mc.cycle_timestamp + INTERVAL '15 min') as escalation_count
FROM monitoring_cycles mc
ORDER BY mc.cycle_timestamp DESC
LIMIT 100;
```

---

## 🔄 Orchestration Cycle

### Every 15 Minutes (Automated)

**T+0:00** — Cycle Starts
```
Orchestrator triggers all 6 agents in parallel
├─ Performance Monitor begins uptime/Web Vitals check
├─ Engagement Analyzer queries chat sessions + funnel
├─ Chat Analyst fetches trending questions + sentiment
├─ Quality Monitor calculates response quality
├─ Business Metrics pulls MRR/churn/adoption
└─ Timeout: 3 minutes per agent
```

**T+3:00** — Data Aggregation
```
Orchestrator collects reports from all agents
├─ Validates data completeness (all 5 agents)
├─ Normalizes metrics to common scale (0-100)
├─ Merges into unified view
└─ If any agent timeouts: use cached previous data
```

**T+3:30** — Anomaly Detection
```
Orchestrator compares current metrics to:
├─ Previous week average (7-day)
├─ Previous month average (30-day)
├─ Rolling baseline (first 7 days of month)
└─ Flags any metric that:
   ├─ Changed > 15% vs baseline
   ├─ Below safe threshold
   └─ Shows negative correlation (e.g., quality ↓ + escalations ↑)
```

**T+4:00** — Recommendation Generation
```
Orchestrator analyzes anomalies:
├─ For each anomaly, generate:
│  ├─ Root cause hypothesis
│  ├─ Impact estimate (users/revenue affected)
│  ├─ Effort estimate (engineering hours)
│  └─ Priority score (impact / effort)
├─ Sort by priority (highest first)
└─ Cap at top 10 recommendations
```

**T+4:30** — Discord Alert
```
Orchestrator formats and sends to Discord:
├─ Channel: #monitoring-alerts
├─ Color: Green (healthy) / Yellow (warning) / Red (critical)
├─ Sections:
│  ├─ Summary (emoji status + key metrics)
│  ├─ Anomalies (what changed, by how much)
│  ├─ Top 3 recommendations
│  └─ Historical trend (sparkline ASCII chart)
└─ Mentions: @ops-team if CRITICAL
```

**T+5:00** — Cycle Complete
```
Orchestrator:
├─ Logs cycle results to monitoring_cycles table
├─ Updates Redis cache for dashboard
├─ Calculates next cycle (T+20:00)
└─ Waits for next trigger
```

---

## 🎯 Discord Integration

### Alert Format

```
📊 Wise Defense Monitoring Cycle #1242
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ⚠️  WARNING (2 anomalies)

✅ Performance: HEALTHY
   • Uptime: 99.97% ↑
   • Core Vitals: All green ✓
   • API Latency p99: 650ms ⚠️ (↑12% vs last week)

✅ Engagement: NORMAL
   • Chat sessions: 342 (↑5%)
   • Booking conversion: 3.8% ↓ (down from 4.2%)

⚠️  Quality: DEGRADED
   • Response quality: 79/100 ↓ (down from 87)
   • User satisfaction: 82.5% ✓
   • New gap: "Group pricing" (7 escalations)

✅ Business: GROWING
   • MRR: $12,500 ↑ +3% vs last month
   • Churn: 2.8% ✓
   • Chat adoption: 68% ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Top Recommendations:

1. 🔴 Add group pricing FAQ
   └─ Reduce escalations 7% / Effort: 2 hours

2. 🟡 Improve pricing response templates
   └─ Fix quality gap / Effort: 4 hours

3. 🟡 Add courses to knowledge base
   └─ Increase adoption to 60% / Effort: 6 hours

📈 7-Day Trend: ▁▂▃▄▅▄▃ (mostly up)
⏱️  Cycle completed in 4m 32s
🔄 Next cycle: 2026-06-22 09:15 UTC
```

### Alert Channels

| Threshold | Channel | Mention | Action |
|-----------|---------|---------|--------|
| ✅ All green | #monitoring-alerts | — | Info only |
| ⚠️  1-2 warnings | #monitoring-alerts | — | Review & plan |
| 🚨 3+ warnings | #urgent | @ops-team | Immediate action |
| 🚨 CRITICAL | #critical-incidents | @ops-team @cto | Page on-call |

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Set up monitoring_cycles table
- [ ] Deploy Performance Monitor agent
- [ ] Deploy Engagement Analyzer agent
- [ ] Create Discord webhook integration
- [ ] Test cycle (run manual test)

### Phase 2: Core Agents (Week 2)
- [ ] Deploy Chat Analyst agent
- [ ] Deploy Quality Monitor agent
- [ ] Deploy Business Metrics agent
- [ ] Set up anomaly detection logic
- [ ] Automate 15-minute scheduling

### Phase 3: Intelligence (Week 3)
- [ ] Deploy Orchestrator agent
- [ ] Build recommendation engine
- [ ] Set up historical tracking
- [ ] Create dashboard for cycle results
- [ ] Enable correlation analysis

### Phase 4: Refinement (Week 4)
- [ ] Tune anomaly thresholds based on real data
- [ ] Add custom alert rules per team
- [ ] Set up escalation automation
- [ ] Train team on interpreting recommendations
- [ ] Document runbooks per recommendation type

---

## 📈 Success Metrics

### System Health

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Cycle completion rate | > 95% | TBD | — |
| Cycle latency (p95) | < 4 min | TBD | — |
| Agent uptime | > 99% | TBD | — |
| Discord delivery | 100% | TBD | — |

### Data Quality

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Data completeness | > 99% | TBD | — |
| Anomaly precision | > 80% | TBD | — |
| Recommendation accuracy | > 70% | TBD | — |

### Business Impact

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Issues found before user complaint | > 80% | TBD | — |
| Recommendations implemented | > 60% | TBD | — |
| Time to incident resolution | ↓ 50% | TBD | — |

---

## 🔧 Deployment

### Prerequisites

```bash
# 1. Create monitoring table
psql wisedefense << EOF
CREATE TABLE IF NOT EXISTS monitoring_cycles (
  id SERIAL PRIMARY KEY,
  cycle_timestamp TIMESTAMP,
  uptime_percentage FLOAT,
  web_vitals_lcp FLOAT,
  api_latency_p99 INT,
  chat_sessions INT,
  conversion_rate FLOAT,
  response_quality_score INT,
  mrr FLOAT,
  churn_rate FLOAT,
  anomalies_detected INT,
  recommendations_count INT,
  anomalies_data JSONB,
  recommendations_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
EOF

# 2. Set environment variables
export DISCORD_MONITORING_WEBHOOK_URL="https://discord.com/api/webhooks/..."
export MONITORING_INTERVAL_MINUTES=15
export ANOMALY_SENSITIVITY="medium"

# 3. Enable scheduler
pm2 start monitoring-orchestrator --name "monitoring-cycle"
```

### Docker Compose Service

```yaml
monitoring:
  build: ./monitoring
  environment:
    DATABASE_URL: postgresql://user:pass@postgres:5432/wisedefense
    REDIS_URL: redis://redis:6379
    DISCORD_WEBHOOK: ${DISCORD_MONITORING_WEBHOOK_URL}
    INTERVAL_MINUTES: 15
  depends_on:
    - postgres
    - redis
  ports:
    - "3200:3200"  # Monitoring API
  command: node orchestrator.js
```

---

## 📊 Dashboard View

Access monitoring dashboard at: `https://academy.wisedefense.store/admin/monitoring`

**Shows:**
- Current cycle status (in progress / complete / error)
- Historical metrics (7-day trend chart)
- All anomalies (sortable, filterable)
- Recommendations (with implementation status)
- Alert history (last 30 cycles)

---

## 🎯 Next Steps

1. **Deploy Foundation** — Run Phase 1 (1 week)
2. **Validate Data** — Verify agents collect correctly
3. **Tune Thresholds** — Adjust alert sensitivity based on baseline
4. **Enable Automation** — Schedule 15-minute cycles
5. **Train Team** — Show ops team how to use alerts
6. **Measure Impact** — Track issues found/resolved

---

## 📞 Support

**Questions about:**
- Agent architecture? → See Agent Designer skill
- Tool schemas? → See `wise_defense_monitoring_tools.json`
- Discord integration? → See `DISCORD-CHAT-ALERTS.md`
- Database? → See schema above or run `psql wisedefense \dt`
