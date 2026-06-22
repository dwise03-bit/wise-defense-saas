# Wise Defense Monitoring System - Architecture & Implementation

## 🎯 Quick Overview

| Aspect | Details |
|--------|---------|
| **Pattern** | Supervisor (1 orchestrator + 5 specialists) |
| **Agents** | 6 total |
| **Update Cycle** | Every 15 minutes |
| **Cycle Time** | 5 minutes (parallel execution) |
| **Concurrent Tasks** | 6 agents run in parallel |
| **Data Sources** | PostgreSQL, Chat Logs, Analytics, Redis |
| **Outputs** | Discord alerts, monitoring_cycles table, recommendations |

---

## 🏗️ System Design (Mermaid Diagram)

```
graph TB
    subgraph "Orchestrator (Central Hub)"
        orch["🎯 Orchestrator<br/>- Coordinate agents<br/>- Aggregate reports<br/>- Detect anomalies<br/>- Generate recommendations"]
    end

    subgraph "Parallel Agents (Specialists)"
        perf["📊 Performance Monitor<br/>- Uptime<br/>- Core Web Vitals<br/>- API Latency"]
        engage["📈 Engagement Analyzer<br/>- Chat sessions<br/>- Conversion funnel<br/>- Button clicks"]
        chat["💬 Chat Analyst<br/>- Trending questions<br/>- Escalation rate<br/>- Sentiment"]
        quality["⭐ Quality Monitor<br/>- Response quality<br/>- User satisfaction<br/>- Knowledge gaps"]
        business["💰 Business Metrics<br/>- MRR/ARR<br/>- Churn rate<br/>- Adoption"]
    end

    subgraph "Data Sources"
        db[("🗄️ PostgreSQL")]
        logs[("📝 Chat Logs")]
        analytics[("📊 Analytics")]
        redis[("⚡ Redis Cache")]
    end

    subgraph "Outputs"
        discord["🤖 Discord Alerts<br/>#monitoring-alerts<br/>#urgent<br/>#critical"]
        monitoring[("📈 Monitoring Table")]
        dashboard["🎛️ Dashboard<br/>academy.wisedefense.store<br/>/admin/monitoring"]
    end

    perf --> db
    perf --> analytics
    engage --> db
    engage --> analytics
    chat --> logs
    chat --> db
    quality --> logs
    business --> db

    perf --> orch
    engage --> orch
    chat --> orch
    quality --> orch
    business --> orch

    orch --> redis
    orch --> monitoring
    orch --> discord
    orch --> dashboard

    monitoring --> dashboard
    redis --> dashboard

    style orch fill:#ff1744,color:#fff
    style perf fill:#42a5f5,color:#fff
    style engage fill:#66bb6a,color:#fff
    style chat fill:#ffa726,color:#fff
    style quality fill:#ab47bc,color:#fff
    style business fill:#ec407a,color:#fff
    style discord fill:#ffb300,color:#000
    style dashboard fill:#29b6f6,color:#fff
```

---

## 📊 Execution Timeline (Per Cycle)

```
Cycle Timeline (Every 15 minutes)
═════════════════════════════════════════════════════════════

T+0:00 ─────────────────────────────────────────────── START
  │
  ├─ [PARALLEL] Performance Monitor starts
  ├─ [PARALLEL] Engagement Analyzer starts
  ├─ [PARALLEL] Chat Analyst starts
  ├─ [PARALLEL] Quality Monitor starts
  └─ [PARALLEL] Business Metrics starts
  │
  │  (All 5 agents run concurrently)
  │
T+3:00 ────────────────────────────────────────── COLLECT DATA
  │
  └─ All agents complete (~2m 45s average)
     Orchestrator receives 5 reports
  │
T+3:30 ────────────────────────────────────── ANOMALY DETECTION
  │
  └─ Compare metrics vs:
     ├─ Previous week average
     ├─ Previous month average
     └─ Baseline threshold
  │
T+4:00 ───────────────────────── GENERATE RECOMMENDATIONS
  │
  └─ For each anomaly:
     ├─ Estimate impact
     ├─ Estimate effort
     ├─ Calculate priority
     └─ Sort top 10
  │
T+4:30 ──────────────────────────── SEND DISCORD ALERT
  │
  └─ Format and post to #monitoring-alerts
     (or #urgent / #critical if severe)
  │
T+5:00 ────────────────────────────────────────── COMPLETE
  │
  └─ Log cycle to monitoring_cycles table
     Update Redis cache for dashboard
     Wait for next trigger (T+20:00)
```

---

## 🔄 Data Flow Example

### Scenario: Escalation Rate Spike

**T+3:00 - Chat Analyst reports:**
```json
{
  "escalation_rate": 14.2,
  "previous_week_avg": 9.4,
  "change": "+22%",
  "trend": "🔴 CRITICAL"
}
```

**T+3:30 - Orchestrator detects anomaly:**
```
Escalation rate UP 22% vs baseline
├─ Correlate with Quality Monitor: "Quality DOWN 8%"
├─ Correlate with Trending Questions: "Group pricing mentions UP 45%"
└─ Hypothesis: Knowledge gap causing escalations
```

**T+4:00 - Orchestrator generates recommendation:**
```
Priority: 1 (HIGH)
Action: "Add group pricing FAQ to knowledge base"
Impact: "Reduce escalations by ~7% (8-10 fewer per day)"
Effort: "Low - 2 hours"
Expected ROI: "Save 2-3 support hours per day"
```

**T+4:30 - Discord alert:**
```
⚠️  ALERT: Escalation Rate +22%
├─ Current: 14.2% (was 9.4%)
├─ Root cause: Knowledge gap (group pricing)
├─ Recommendation: Add FAQ (2 hours, saves 2-3h/day)
└─ Quality also down 8% - related issue
```

**Result:** Ops team sees alert → Creates ticket → Dev adds FAQ → Next cycle shows improvement

---

## 🎯 Key Metrics per Agent

### Performance Monitor (Infra Health)

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Uptime | > 99.9% | 99.0-99.9% | < 99.0% |
| LCP | < 2.5s | 2.5-4s | > 4s |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| API p99 | < 500ms | 500-1000ms | > 1000ms |

### Engagement Analyzer (User Behavior)

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Chat sessions (daily) | > 250 | 150-250 | < 150 |
| Bounce rate | < 20% | 20-40% | > 40% |
| Booking conversion | > 5% | 3-5% | < 3% |
| Payment completion | > 85% | 70-85% | < 70% |

### Chat Analyst (User Support)

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Escalation rate | < 10% | 10-15% | > 15% |
| Negative sentiment | < 15% | 15-30% | > 30% |
| Knowledge gaps | 0-2 new | 3-5 new | > 5 new |

### Quality Monitor (AI Quality)

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Response quality | > 85 | 75-85 | < 75 |
| User satisfaction | > 85% | 75-85% | < 75% |
| Resolution rate | > 90% | 75-90% | < 75% |

### Business Metrics (Revenue & Health)

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| MRR growth | > 0% | -5-0% | < -5% |
| Churn rate | < 3% | 3-5% | > 5% |
| Chat adoption | > 60% | 40-60% | < 40% |
| LTV/CAC | > 3:1 | 2-3:1 | < 2:1 |

---

## 💾 Database Schema

```sql
-- Main monitoring cycle table
CREATE TABLE monitoring_cycles (
  id SERIAL PRIMARY KEY,
  cycle_number INT,
  cycle_timestamp TIMESTAMP,
  cycle_duration_seconds INT,
  
  -- Performance metrics
  uptime_percentage FLOAT,
  uptime_status VARCHAR(20),
  web_vitals_lcp FLOAT,
  web_vitals_fid FLOAT,
  web_vitals_cls FLOAT,
  api_latency_p50 INT,
  api_latency_p95 INT,
  api_latency_p99 INT,
  
  -- Engagement metrics
  chat_sessions INT,
  chat_bounce_rate FLOAT,
  active_users INT,
  visitor_to_signup_conversion FLOAT,
  signup_to_booking_conversion FLOAT,
  booking_to_payment_conversion FLOAT,
  popular_buttons JSONB,
  
  -- Chat analysis
  escalation_rate FLOAT,
  escalation_count INT,
  negative_sentiment_pct FLOAT,
  trending_questions JSONB,
  new_knowledge_gaps JSONB,
  
  -- Quality metrics
  response_quality_score INT,
  user_satisfaction_pct FLOAT,
  
  -- Business metrics
  mrr FLOAT,
  arr FLOAT,
  daily_revenue FLOAT,
  churn_rate FLOAT,
  ltv FLOAT,
  chat_adoption FLOAT,
  course_adoption FLOAT,
  booking_adoption FLOAT,
  shop_adoption FLOAT,
  
  -- Anomalies & recommendations
  anomalies_detected INT,
  anomalies_data JSONB,
  recommendations_count INT,
  recommendations_data JSONB,
  
  -- Status
  cycle_status VARCHAR(50),
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_monitoring_cycles_timestamp ON monitoring_cycles(cycle_timestamp DESC);
CREATE INDEX idx_monitoring_cycles_status ON monitoring_cycles(cycle_status);
```

---

## 🚀 Deployment Checklist

- [ ] Create `monitoring_cycles` table in PostgreSQL
- [ ] Set up Discord webhook URL in `.env`
- [ ] Deploy Performance Monitor agent
- [ ] Deploy Engagement Analyzer agent
- [ ] Deploy Chat Analyst agent
- [ ] Deploy Quality Monitor agent
- [ ] Deploy Business Metrics agent
- [ ] Deploy Orchestrator agent
- [ ] Configure 15-minute scheduler (PM2 or Cron)
- [ ] Test single cycle (run manually)
- [ ] Verify Discord alert posts
- [ ] Create monitoring dashboard
- [ ] Set up alert routing (#monitoring, #urgent, #critical)
- [ ] Document runbooks per recommendation type
- [ ] Train team on interpreting alerts
- [ ] Monitor for 1 week, tune thresholds
- [ ] Enable full automation

---

## 📈 Expected Impact

### Before Multi-Agent Monitoring
- Issues discovered by user complaints ❌
- No systematic performance tracking ❌
- Ad-hoc quality assessments ❌
- Missed opportunities for improvement ❌
- Manual data collection (hours/week) ❌

### After Multi-Agent Monitoring
- Issues detected automatically ✅
- Real-time performance visibility ✅
- Continuous quality scoring ✅
- Automated recommendations ✅
- Zero manual data collection ✅

**Expected Benefits:**
- **50% faster** issue detection (automated vs user-reported)
- **30% more** recommendations implemented (prioritized list)
- **40% reduction** in mean time to resolution (context-aware alerts)
- **10+ hours/week** saved on manual monitoring

---

## 🔧 Configuration Examples

### Alert Sensitivity

```env
# Low: Only critical issues
ANOMALY_SENSITIVITY=low

# Medium: Warnings + critical (recommended)
ANOMALY_SENSITIVITY=medium

# High: All changes > 10% threshold
ANOMALY_SENSITIVITY=high
```

### Threshold Customization

```json
{
  "thresholds": {
    "performance": {
      "uptime_warning": 99.5,
      "uptime_critical": 99.0,
      "lcp_warning": 3.0,
      "api_p99_warning": 750
    },
    "engagement": {
      "bounce_rate_warning": 30,
      "conversion_warning": 4.0
    },
    "quality": {
      "quality_score_warning": 80,
      "satisfaction_warning": 80
    },
    "escalations": {
      "rate_warning": 12,
      "rate_critical": 20
    }
  }
}
```

---

## 📞 Troubleshooting

### Agent Timeout (> 3 minutes)

**Symptom:** Agent doesn't report on time
```json
{
  "agent": "engagement_analyzer",
  "status": "TIMEOUT",
  "duration_seconds": 187
}
```

**Solution:**
1. Check database query performance: `EXPLAIN ANALYZE`
2. Add indexes if needed
3. Increase timeout to 4 minutes
4. Use cached data from previous cycle as fallback

### Missing Data

**Symptom:** Agent returns incomplete report
```json
{
  "agent": "quality_monitor",
  "error": "Insufficient samples for quality score"
}
```

**Solution:**
1. Increase minimum sample size threshold
2. Extend look-back window (24h → 48h)
3. Use rolling average instead of point estimate

### Discord Delivery Failure

**Symptom:** Alert doesn't post to Discord
```
Error: Webhook URL invalid or rate limited
```

**Solution:**
1. Verify webhook URL: `grep DISCORD_MONITORING_WEBHOOK_URL .env`
2. Recreate webhook if expired
3. Add exponential backoff retry (1s, 2s, 4s)
4. Log failed alerts to database for manual review

---

## 🎯 Next Phase Ideas

**Phase 2 (Future):**
- [ ] ML-powered anomaly detection (learns normal patterns)
- [ ] Predictive alerts (forecast issues before they occur)
- [ ] Custom alert routing rules (team-specific channels)
- [ ] Automated remediation (run fixes via Discord reactions)
- [ ] Historical analysis dashboard (drill into past cycles)
- [ ] Integration with incident management (Pagerduty/Opsgenie)
- [ ] Slack integration (in addition to Discord)
- [ ] Mobile notifications (critical alerts only)

---

## 📚 Related Documentation

- `MULTI-AGENT-MONITORING-SYSTEM.md` — Full system design
- `DISCORD-CHAT-ALERTS.md` — Discord integration guide
- Agent Designer skill — For architecture patterns & schema validation
- Engineering Advanced Skills → SLO Architect — For defining SLOs
