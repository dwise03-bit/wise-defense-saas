# AI-Powered Content Quality Scoring System
**Design Spec** | June 21, 2026

## Overview

Implement an Ollama-powered quality scoring system that evaluates content across 6 dimensions at 4 pipeline gates, with automatic filtering and human feedback loops that continuously improve the AI model.

**Goal:** Improve content quality across all aspects (relevance, credibility, engagement, brand alignment, fact-checking, uniqueness) with zero cost, starting as solo operation but designed to scale to a team.

---

## 1. Scoring System Architecture

### Scoring Dimensions (0-100 each)

Content is evaluated on:

1. **Relevance Score** — How directly does this connect to 2A rights, gun policy, constitutional issues?
2. **Source Credibility** — Is the source reputable? Does it cite credible sources? Any red flags?
3. **Engagement Potential** — Would the audience find this interesting, shareable, discussion-worthy?
4. **Brand Alignment** — Does tone/messaging match Wise Defense values and voice?
5. **Fact-Check Score** — Are claims verifiable? Any misinformation or sensationalism?
6. **Uniqueness Score** — Is this new analysis, or repackaged content everyone's already seen?

### Scoring Points in Pipeline

Scores are generated at four gates:

- **Gate 1: Article Submission** — Initial quality assessment of incoming content
- **Gate 2: Content Review Enhancement** — Ollama suggests improvements; content is re-scored
- **Gate 3: Social Post Generation** — Platform-specific optimization (Twitter/Discord/Telegram)
- **Gate 4: Video Production** — Viability check before YouTube generation

---

## 2. Quality Gate Filtering (Moderate Thresholds)

Moderate thresholds balance quality and volume. Content below thresholds is auto-filtered.

### Recommended Thresholds

| Dimension | Minimum Score | Rationale |
|-----------|--------------|-----------|
| Relevance | 70 | Must be clearly on-topic |
| Credibility | 75 | Source must be trustworthy |
| Fact-Check | 75 | Core claims must be verifiable |
| Brand Alignment | 65 | Some flexibility for diverse voices |
| Engagement | 60 | Allow niche but quality content |
| Uniqueness | 50 | Minimal — allow some reference content |

**Combined threshold:** Average score must be ≥68 to proceed

### Override Capability

You can force-approve low-scoring content if needed, with notes explaining why (trains the model that your judgment sometimes differs from the scoring).

### Auto-Filtering Behavior

- **Gate 1 fails** → Article rejected, reason logged
- **Gate 2 fails** → Content not posted to social media
- **Gate 4 fails** → Article flagged but you can override for video production

---

## 3. Human Feedback Loop

### What Gets Captured

Every decision you make trains the model:

- **Decision:** Approve / Reject / Modify
- **What changed:** Rewrote headline, fact-checked claim, removed sensationalism, etc.
- **Original vs. new scores:** How your edit changed quality metrics
- **Notes:** Why you made the change ("source is biased", "headline is clickbait", etc.)

### Training Cycle

**Monthly retraining:**
- Ollama analyzes your decisions to find patterns
- Updates scoring weights based on your behavior
- New model deployed automatically

**Example patterns learned:**
- You always reject articles with sensationalist headlines → Ollama learns to penalize those
- You approve low-engagement content that's highly credible → Ollama adjusts engagement weight
- You flag specific sources as unreliable → Model learns to distrust them

### Metrics Tracked

- **Override rate** — How often you disagree with Ollama (healthy if 10-30%)
- **Score accuracy** — Do high-scoring content perform better (measured by engagement)?
- **Model drift** — Are thresholds still appropriate, or should they change?

---

## 4. Scaling to Team

### Solo Phase (Current)

- You're the sole decision-maker
- Model trains on your preferences
- No coordination overhead

### Team Phase (Future)

**New components:**
- **Quality Review Dashboard** showing articles with scores and your previous decisions
- **Team decision log** — all approvals/rejections/edits visible
- **Threshold management** — team can adjust scoring weights together

**Team workflows:**

1. **Specialization possible:**
   - Person A: Fact-checking focus
   - Person B: Engagement optimization
   - Person C: Social media tuning

2. **Consensus on standards:**
   - When Person A and Person B disagree on a score, it surfaces for team discussion
   - Shared model ensures consistency
   - Team refines thresholds together

3. **Model ownership:**
   - Team feedback trains the same model
   - No conflicting standards — one shared quality bar
   - Onboarding new people is faster (they inherit team's learned preferences)

---

## 5. Database Schema

### New Tables

**quality_scores** — Stores all scores for all content

```
id (PK)
article_id (FK → news_articles)
gate_number (1-4)
relevance_score (0-100)
credibility_score (0-100)
engagement_score (0-100)
brand_alignment_score (0-100)
fact_check_score (0-100)
uniqueness_score (0-100)
average_score (computed)
meets_threshold (boolean)
created_at
updated_at
```

**human_feedback** — Tracks your decisions and why

```
id (PK)
score_id (FK → quality_scores)
decision (approve/reject/modify)
notes (text — why you made this decision)
changes_made (json — what you edited)
old_scores (json — original scores)
new_scores (json — updated scores after edit)
created_at
```

### Modified Tables

**news_articles** — Add columns

```
current_quality_score (numeric)
is_filtered (boolean — blocked by quality gate)
filter_reason (text — why it was filtered)
override_reason (text — if you force-approved low-scoring content)
```

---

## 6. Implementation Phases

### Phase 1: Core Scoring (Week 1)
- Create quality_scores table
- Build Ollama prompts for 6-dimensional scoring
- Integrate scoring at Gate 1 (article submission)
- Add filtering logic

### Phase 2: Feedback Loop (Week 2)
- Create human_feedback table
- Build decision capture (when you approve/reject, log it)
- Build monthly retraining process
- Dashboard showing your score accuracy

### Phase 3: Gates 2-4 (Week 3)
- Integrate scoring into content review enhancement
- Optimize scores for social media platforms
- Add video viability checks
- Quality dashboard

### Phase 4: Team Readiness (Week 4)
- Quality Review Dashboard for multiple users
- Threshold management UI
- Team decision logs and consensus tools
- Documentation for onboarding

---

## 7. Error Handling & Edge Cases

**What if Ollama fails to score?**
- Retry logic (3x with exponential backoff)
- If still failing, default to "pending manual review" (don't auto-reject)
- Alert you so you know scoring is degraded

**What if scores contradict?** (e.g., high credibility but low fact-check)
- This is valid — source is reputable but made unverified claims
- Flag for your attention but allow to proceed

**What if you override a lot?** (override rate > 50%)
- Model isn't learning your standards well
- Alert: "Consider adjusting thresholds or Ollama settings"

---

## 8. Success Metrics

Track these to validate the system works:

- **Quality gate accuracy** — % of filtered articles you would have rejected anyway
- **Model improvement** — Do scores predict your decisions better over time?
- **Pipeline efficiency** — % of content that makes it through (should be 40-70%)
- **Team consensus** — When team joins, do they agree with filtering decisions?
- **Engagement correlation** — Do high-scoring posts/videos actually perform better?

---

## 9. Rollback Plan

If quality scoring breaks the pipeline:

1. Disable auto-filtering immediately (all content proceeds)
2. Keep score calculation running (for feedback collection)
3. Investigate what went wrong
4. Adjust thresholds and redeploy

No data loss, full audit trail in human_feedback table.

---

## Open Questions / TBD

- **Ollama model choice:** Which model (mistral, neural-chat, etc.) balances quality vs. speed for scoring?
- **Retraining frequency:** Monthly is baseline; should it be more/less frequent?
- **Override visibility:** When you force-approve low-scoring content, should it be flagged in social media/video (so team knows)?

---

## Summary

This design delivers:

✅ **Quality improvements** across all 6 dimensions (solo operation)
✅ **Auto-filtering** with moderate thresholds to reduce manual review
✅ **Continuous learning** from your decisions
✅ **Team-ready architecture** for scaling without redesign
✅ **Zero cost** (uses existing Ollama + PostgreSQL + Node agents)
✅ **Transparent** (full audit trail of decisions and feedback)
