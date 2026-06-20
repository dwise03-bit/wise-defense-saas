# Wise Defense Brand Awareness Strategy - Automation Design

**Date**: 2026-06-20  
**Project**: Wise Defense Academy (51.81.80.252:3001)  
**Goal**: Build brand awareness for new/potential gun owners seeking education  
**Constraint**: Solo operator, 2-5 hrs/week, all free tools  
**Success Metrics**: Website traffic + social engagement + real-world inquiries  

---

## 1. Strategy Overview

**Content-First Approach**: Create educational blog content for new gun owners, repurpose into social media posts across all platforms using automation.

**Monthly Cadence**:
- 1-2 blog posts (educational, targeting new gun owners)
- 6 social post variants per blog post
- 2-3 posts/week scheduled across platforms
- Consistent presence without daily manual work

---

## 2. Target Audience

**Primary**: New/potential gun owners seeking education and safety information  
**Positioning**: NRA-certified academy focused on education-first, safety-first training  
**Content Themes**: 
- Firearms safety fundamentals
- How to choose your first gun
- Training mindsets and philosophy
- Common beginner questions answered
- Real training stories from academy

---

## 3. Platform Strategy

| Platform | Purpose | Frequency | Format |
|----------|---------|-----------|--------|
| **Blog (WordPress/Medium)** | Authority, SEO, long-form education | 1-2x/month | 1000-1500 word guides |
| **Instagram** | Visual storytelling, community | 2-3x/week | Photos + captions, carousels, reels |
| **Facebook** | Community engagement, groups | 2-3x/week | Long-form discussions, links |
| **TikTok** | Short education, trending | 2-3x/week | 30-60 sec clips, trends |
| **YouTube** | Authority, search, long-form | Monthly | 5-10 min educational videos |
| **Twitter/X** | Thought leadership, threads | 2-3x/week | Quote threads, quick tips |
| **Email** | Direct audience, conversions | Monthly digest | Blog roundup, exclusive updates |

**Investment**: All platforms, but automated scheduling means consistent presence without daily manual posting.

---

## 4. Content Production Workflow

### Phase 1: Blog Content Creation (Weeks 1-2, ~1.5 hrs)
**Owner**: Dwise (you)  
**Tool**: Google Docs + Claude Code  
**Output**: 1 blog post (1000-1500 words)

**Topics** (monthly rotation):
- Month 1: "Firearms Safety 101 for First-Time Buyers"
- Month 2: "How to Choose Your First Firearm"
- Month 3: "Training Mindsets: Why Consistency Matters"
- Month 4: "Common Beginner Questions Answered"
- Rotate through TRAIN · TEACH · PROTECT pillars

**Process**:
1. Outline in Google Docs (15 min)
2. Write draft (45 min)
3. Add photos from training sessions (15 min)
4. Review + publish to blog (15 min)

### Phase 2: Social Post Generation (Week 3, ~30 min)
**Owner**: Claude Code (automated)  
**Tool**: Claude via brainstorming/writing-skills  
**Input**: Blog post  
**Output**: 6 social post variants

**Variants Generated**:
1. **Quote Graphic** (Instagram) — Extract key quote + visual
2. **Discussion Post** (Facebook) — Question format to spark comments
3. **Short Tip** (TikTok) — 30-60 sec hook + advice
4. **Thread Starter** (Twitter) — "5 things new gun owners should know..."
5. **Educational Carousel** (Instagram) — Multi-slide breakdown
6. **Video Script** (YouTube) — Outline for short video version

**Format**: Markdown file with 6 posts, ready to copy-paste into schedulers.

### Phase 3: Scheduling & Distribution (Week 4, ~30 min)
**Owner**: Dwise  
**Tool**: Buffer Free / Meta Business Suite  
**Process**:
1. Copy social posts from generated file
2. Add to Buffer (images, captions, best time)
3. Schedule 2-3 posts/week over next 4 weeks
4. Buffer auto-publishes to: Instagram, Facebook, Twitter, TikTok, LinkedIn
5. Manual: YouTube (monthly video upload), Email (monthly digest)

**Scheduling Logic**:
- Monday, Wednesday, Friday: Main posts (carousel, discussion, tip)
- Tuesday, Thursday: Reposts of high-engagement content
- Weekend: Community engagement posts (respond to comments)

### Phase 4: Analytics & Optimization (Ongoing, ~1 hr/month)
**Owner**: Dwise  
**Tools**: Google Analytics (blog traffic) + platform native insights  
**Metrics Tracked**:
- Blog: Page views, scroll depth, time on page, bounce rate
- Instagram: Likes, comments, saves, shares, reach
- Facebook: Engagement rate, reach, click-through rate
- TikTok: Views, completion rate, shares
- YouTube: Watch time, subscriber growth
- Email: Open rate, click rate, unsubscribe rate
- Real-world: Inquiry count, course signups, inquiries mentioning "saw you on..."

**Review Cadence**: Monthly dashboard review, quarterly strategy adjustment.

---

## 5. Automation Architecture

### Tools Stack (All Free)

```
Writing & Drafting
├── Google Docs (outline + draft)
├── Claude Code (expansion, refinement)
└── Grammarly Free (spell check)

Blog Publishing
├── WordPress (self-hosted on VPS)
└── Medium (cross-posting, reach)

Social Content Generation
├── Claude Code (post variants)
└── Canva Free (image templates)

Social Scheduling
├── Buffer Free (6 platforms)
├── Meta Business Suite (Facebook, Instagram, LinkedIn)
└── TweetDeck (Twitter scheduling)

Analytics & Email
├── Google Analytics (blog traffic)
├── Platform native dashboards (Instagram Insights, etc.)
└── Substack Free or Mailchimp Free (email capture)

Workflow Automation (Optional)
├── Make (free tier) — connect blog → Buffer → email
└── IFTTT (free) — cross-platform automation
```

### Workflow Integration

```
Blog Post Published
    ↓
[Manual] Extract quotes, images, key points
    ↓
Claude Code generates 6 social variants
    ↓
[Manual] Paste into Buffer + schedule
    ↓
[Automated] Buffer posts to 6 platforms
    ↓
[Manual] Monitor analytics, respond to comments
    ↓
[Monthly] Email digest to subscribers
```

---

## 6. Time Investment Breakdown

**Monthly Time Budget: ~5 hours**

| Task | Frequency | Time | Owner |
|------|-----------|------|-------|
| Write blog post | 2x/month | 1.5 hrs each = 3 hrs | Dwise |
| Generate social variants | After each post | 0.5 hrs each = 1 hr | Claude |
| Schedule posts | After variants | 0.5 hrs | Dwise |
| Monitor & respond | Ongoing | 0.5 hrs/week = 2 hrs | Dwise |
| Review metrics | Monthly | 1 hr | Dwise |
| **Total** | | **~5 hours/month** | |

**Fits 2-5 hrs/week commitment ✓**

---

## 7. Success Criteria & Metrics

### 6-Month Target (October 2026)

| Metric | Current | Target | Source |
|--------|---------|--------|--------|
| Blog monthly traffic | 0 | 500+ unique visitors | Google Analytics |
| Email subscribers | 0 | 100+ | Substack/Mailchimp |
| Instagram followers | Low | 500+ engaged followers | Instagram Insights |
| Facebook engagement rate | Low | 3-5% engagement | Facebook Insights |
| TikTok views (monthly) | 0 | 5K+ views | TikTok Analytics |
| Website inquiries mentioning social | 0 | 5-10/month | Manual tracking |
| Course signups attributed to content | 0 | 2-3/month | Survey + UTM tracking |

### 12-Month Target (June 2027)

- Blog: 1500+ monthly visitors
- Email list: 300+ subscribers
- Instagram: 1500+ followers
- Real-world: 10+ course signups/month attributed to content
- Brand awareness: Wise Defense name appearing in firearms training communities

---

## 8. Content Calendar (First 3 Months)

| Month | Blog Post | Social Focus | Key Dates |
|-------|-----------|--------------|-----------|
| **July** | "Firearms Safety 101 for Beginners" | Education + Safety | Independence Day (patriotic angle) |
| **August** | "How to Choose Your First Firearm" | Buyer's guide + Tips | Back-to-school (training season) |
| **September** | "Training Mindsets: Why Consistency Matters" | Philosophy + Psychology | Fall training season ramp |

---

## 9. Risk Mitigation

**Risk**: Solo operator burns out or misses deadlines  
**Mitigation**: 
- Buffer keeps posts going even if you skip a week (build 2-week buffer)
- Seasonal content templates ready (reuse structure)
- Delegate social monitoring to assistant later (scalable)

**Risk**: Social algorithm changes reduce reach  
**Mitigation**:
- Blog traffic is organic (not algorithm-dependent)
- Email list is owned audience (no platform risk)
- Diverse platform strategy (not all-in on one)

**Risk**: Low initial engagement  
**Mitigation**:
- Educational content has long tail (evergreen)
- 6-month runway before expecting results
- Engage in communities (not just broadcast)

---

## 10. Implementation Sequence

**Week 1**: Set up tools (WordPress blog, Buffer, Google Analytics, email signup)  
**Week 2-3**: Write first blog post + generate social variants  
**Week 4**: Schedule posts + start monitoring  
**Month 2+**: Sustain rhythm (1-2 posts/month + schedule)

---

## 11. Deliverables

### Phase 1: Setup (by end of June 2026)
- [ ] Blog platform live (WordPress or Medium)
- [ ] Buffer account connected to all platforms
- [ ] Google Analytics installed on blog
- [ ] Email signup form on website
- [ ] Content calendar created

### Phase 2: Content Launch (July 2026)
- [ ] First blog post published
- [ ] Social variants generated
- [ ] Posts scheduled for next 4 weeks
- [ ] Analytics dashboard set up

### Phase 3: Scaling (August+)
- [ ] Second blog post + variants
- [ ] Monthly email digest started
- [ ] Metrics reviewed + strategy adjusted
- [ ] Community engagement (Reddit/Facebook groups)

---

## 12. Tools Comparison (Why These?)

### Blog Platform
- **WordPress (Self-hosted)**: Full control, SEO-friendly, fits on VPS ✓
- **Medium**: Simpler, built-in audience, but less brand control

### Social Scheduler
- **Buffer Free**: 6 platforms, scheduling, analytics, free tier sufficient ✓
- **Meta Business Suite**: Only Facebook/Instagram, but native
- **Later**: TikTok focus, but more limited free tier

### Email
- **Substack Free**: Simple, free, good for writers ✓
- **Mailchimp Free**: More features, but more complex

### Design
- **Canva Free**: Quick image templates, no design skills needed ✓
- **Figma Free**: Overkill for this project

---

## 13. Budget

**Total Cost**: $0 (all free tools)  
**Optional Paid Upgrades** (if needed later):
- WordPress hosting on VPS: Already paid (part of Wise Defense infrastructure)
- Buffer Pro ($15/mo): For better scheduling + analytics
- Canva Pro ($13/mo): For unlimited templates
- Email service (Klaviyo, ConvertKit): If list grows beyond free tier limits

**Recommendation**: Start free, upgrade only if metrics prove ROI.

---

## 14. Success Definition

**You'll know this is working when:**
1. ✅ Blog posts consistently get 100+ views within first week
2. ✅ Social posts get 5-10% engagement rate (comments + shares)
3. ✅ Email list grows to 50+ subscribers in first 2 months
4. ✅ Website gets 5-10 inquiries/month mentioning "saw you on social"
5. ✅ At least 1-2 course signups/month attributed to content
6. ✅ Wise Defense name appearing in firearms training communities
7. ✅ You're able to sustain 1-2 posts/month without burnout

---

## Next Steps

1. **You review this spec** — Does it cover everything? Adjustments needed?
2. **Implementation plan** — Detail out Week 1 setup, content calendar templates, tool guides
3. **Execution** — Start with first blog post, first social variants, first scheduling

**Questions before we proceed?**
