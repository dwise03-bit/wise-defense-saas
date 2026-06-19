# Wise Defense Premium Training Platform — Design Spec

**Date:** 2026-06-19  
**Owner:** Wise Defense (NRA Certified Instructor)  
**Status:** Ready for Implementation Plan  
**Scope:** Complete redesign of academy site + business model + agent infrastructure

---

## Executive Summary

Wise Defense will transition from a generic academy site to a **premium, instructor-led training platform** that positions the owner as a top-tier NRA firearms training provider in the local area.

**Key Differentiators:**
- High-touch, personalized learning (you-focused, not generic)
- Mobile-friendly, professional presence
- Recurring revenue (membership tiers + à la carte bookings)
- Automated backend (agents handle scheduling, engagement, social growth)
- Fast local growth (agent-powered social media + lead generation)

**Success Metrics:**
- Student retention rate (target: >70% monthly)
- Monthly recurring revenue (target: $5K+ from memberships)
- Social media followers (target: 500+ on Instagram, 1K+ on TikTok within 3 months)
- Session bookings per student (target: 2-4 per month for Pro/VIP tiers)

---

## Part 1: Platform Architecture & Student Journey

### Homepage & Brand Presence

**Purpose:** First impression. Establish credibility and differentiation.

**Content:**
- Hero section: You (professional photo/video), NRA credentials, years of experience
- Your training philosophy: Why you're different, what results students get
- Social proof: Student testimonials, progress photos, certificates earned
- Course preview: Overview of beginner → advanced → specialized tracks
- Pricing transparency: Clear membership tiers and à la carte rates
- CTA: "Book Your First Session" or "Take Training Assessment"

### Student Enrollment Journey

**Stage 1: Discovery → Assessment**
- Student lands on homepage → browses course options
- Takes quick assessment quiz (3-5 questions):
  - "What are your training goals?" (self-defense, sport, hunting, concealed carry, etc.)
  - "What's your experience level?" (beginner, intermediate, advanced)
  - "How often can you train?" (weekly, bi-weekly, monthly)
  - "Preferred learning style?" (hands-on range, video, 1-on-1)
  - "Any specific concerns?" (fear, accuracy, technique)

**Stage 2: Personalized Path**
- Assessment results → Agent recommends a learning path
- Example: "6-week Concealed Carry Fundamentals" or "3-month Competitive Shooting Prep"
- Path includes: expected sessions, cost, timeline, learning milestones
- Student can customize (adjust schedule, add sessions, select tier)

**Stage 3: Membership Selection**
- Student chooses tier:
  - **Starter ($99/mo):** 2 group sessions/month, video library, community access
  - **Pro ($199/mo):** 4 sessions/month (mix of group + 1-on-1), personalized drills, priority booking
  - **VIP ($399/mo):** Unlimited sessions, dedicated 1-on-1 coaching, custom path, priority support
- Payment via Stripe (monthly recurring)
- Welcome email from you: Personal note, next steps, tech setup

**Stage 4: Learning & Progress**
- Student logs into dashboard → sees their calendar, upcoming drills, progress
- Books sessions from your availability (agent manages calendar)
- Completes drills between sessions (videos, quizzes, homework)
- Attends live session (at range or video call) → you give feedback
- Progress tracked: drills completed, sessions attended, quiz scores

**Stage 5: Community & Engagement**
- Student joins private forum → sees other students, success stories
- Posts progress photos, asks questions, encourages peers
- Receives weekly email from agent: "Here's your next drill," "You've completed X, ready for Y?"
- Milestone celebrations: Certificates, achievements, tier upgrade suggestions

**Stage 6: Retention & Upsell**
- After 4 weeks: Agent suggests upgrade if active (Starter → Pro, Pro → VIP)
- After 12 weeks: Offer advanced course or specialty training
- Inactive students get re-engagement emails (personalized, not spam)
- Annual certification renewal (keeps credentials valid)

---

## Part 2: Personalization Engine & Live Sessions

### How Personalization Works

**Assessment-Driven Paths**
- Student assessment quiz generates a profile: goals, experience, learning style, constraints
- Agent matches profile to pre-built paths (beginner concealed carry, advanced accuracy, competition prep, etc.)
- You can customize the path per student (add sessions, swap drills, adjust timeline)
- Path is visible to student: "Week 1: Fundamentals (2 sessions), Drill A, Drill B. Week 2: Accuracy (1 session), Drill C, etc."

**Your Feedback Loop**
- You review student profiles before first session
- During session: Note observations (form issues, confidence level, progress)
- After session: Give written feedback → student sees it in their dashboard
- Feedback informs next session and drills (if student struggles with grip, send grip drills)

**Agent Support**
- **Scheduling Agent:** Manages your calendar, prevents double-bookings, sends reminders to student
- **Content Agent:** Sends drills + videos between sessions (e.g., "Before your Saturday session, watch this grip technique video")
- **Progress Agent:** Logs session outcomes, tracks quiz/drill completion, identifies struggles
- **Personalization Agent:** Analyzes student performance → recommends next drills, flags students who need extra help

### Live Session System

**Session Types:**
1. **Range Training** (in-person at your location)
   - Group sessions (4-6 students, same level)
   - 1-on-1 coaching (personalized feedback)
   - Duration: 1-2 hours

2. **Video Sessions** (remote via Zoom or custom platform)
   - Form review (student shoots video, you give feedback)
   - Technique Q&A
   - Accountability check-in
   - Duration: 30-60 min

3. **Hybrid** (range training + follow-up video)
   - Range session → you record key moments
   - Video follow-up: Review footage, correct form, drill assignments

**Booking System**
- You set available time slots (e.g., Tue/Thu 6pm, Sat 9am, Sun 2pm)
- Students book from available slots (auto-filled based on tier: Starter gets 2 slots/mo, Pro gets priority, VIP unlimited)
- Agent sends confirmation + prep materials to student
- Agent sends you roster: who's attending, what they're working on

**Session Recording & Follow-Up**
- Range sessions: Notes on form, progress, next focus area
- Video sessions: Auto-record (for you to review, not shared without permission)
- You write feedback → student sees it + gets next week's drills
- Agent logs: attendance, outcomes, certificates earned

---

## Part 3: Community, Content & Business Model

### Student Community

**Private Forum**
- Members-only by tier (Starter users see public threads, Pro/VIP see private coaching threads)
- You participate: Answer questions, celebrate wins, share tips
- Students help each other: "How do I improve my accuracy?" → peer answers + your confirmation

**Success Stories & Testimonials**
- Dedicated section: Before/after progress photos, certificates, student testimonials
- Monthly "Student Spotlight": Feature one student's journey
- Leaderboards (optional): Fastest improvement, most consistent, highest accuracy (friendly, non-competitive)

**Community Guidelines**
- Safe space for all skill levels
- Focus on technique, not ego
- Celebrate effort and improvement
- You (instructor) are moderator + expert voice

### Content Library

**Video Drills** (you record once, students access forever)
- Stance & positioning (proper grip, stance, sight alignment)
- Safety protocols (range setup, weapon handling, safe practices)
- Accuracy techniques (trigger control, breathing, follow-through)
- Specialty topics (concealed carry, competition, hunting, defensive scenarios)
- Format: 5-15 min videos, clear instruction, slow-motion breakdowns

**Assessments**
- Quizzes (5-10 questions on technique concepts)
- Video submissions (student shoots short video, you grade form)
- Range drills (specific exercises, pass/fail criteria)
- Peer review (students critique each other's form, with your feedback)

**Downloadable Resources**
- Checklists (pre-range checklist, form checklist, safety checklist)
- Range protocols (what to bring, how sessions run, expectations)
- Goal-setting worksheets (where you are, where you want to be, how to get there)
- Progress tracking sheet (track accuracy, speed, form over time)

**Content Organization**
- By skill level: Beginner, Intermediate, Advanced
- By specialty: Concealed carry, sport shooting, hunting, self-defense, defensive scenarios
- By topic: Stance, grip, accuracy, speed, safety, competition rules
- Progression: Students can't unlock advanced drills until completing prerequisites

### Membership Tiers & Pricing

**Starter Tier ($99/month)**
- 2 group sessions per month (group class size 4-6 students)
- Access to video library (all beginner + some intermediate content)
- Community forum (read-only, can post questions)
- Monthly progress email from agent
- Goal: Entry-level, low commitment, good trial for new students

**Pro Tier ($199/month)**
- 4 sessions per month (mix of group and 1-on-1, student chooses)
- Full video library (beginner + intermediate + some advanced)
- Priority booking (sessions available before Starter tier)
- Personalized weekly drills (agent recommends drills based on your feedback)
- Private 1-on-1 coaching thread (you + student discuss their specific goals)
- Goal: Serious students, measurable progress, personalized attention

**VIP Tier ($399/month)**
- Unlimited sessions (book as much as you have availability)
- Full video library + exclusive VIP-only advanced content
- Dedicated 1-on-1 coaching (your direct focus)
- Custom learning plan (you design path specific to their goals)
- Priority support (fastest response time, dedicated email)
- Monthly 1-on-1 review call (progress, adjust plan, celebrate wins)
- Goal: Premium experience, maximum progress, personal relationship

**À la Carte Options**
- Single session (non-members): $75 (group), $150 (1-on-1)
- Drop-in group class (members can attend extra groups): $25/class
- Membership gift cards: Discounted packages for gifting

**Revenue Model Example (100 students)**
- 40 Starter @ $99 = $3,960
- 40 Pro @ $199 = $7,960
- 20 VIP @ $399 = $7,980
- À la carte/gifts: ~$2,000
- **Total monthly: ~$21,900** (20% goes to platform/agents, 80% to you)

### Business Metrics

**Key Performance Indicators:**
- **Retention:** % of students still active after 1/3/6/12 months
- **Tier mix:** % of students at each tier (target: 40% Starter, 40% Pro, 20% VIP)
- **Session bookings:** Average sessions per student per month (target: 2 for Starter, 4 for Pro, 8+ for VIP)
- **Upgrade rate:** % of Starter students who upgrade to Pro/VIP (target: 20-30% after 4 weeks)
- **Course completion:** % of students who complete a full learning path (target: 60%)
- **Testimonials/proof:** # of success stories, certificates earned, social media mentions
- **Revenue per student:** Average monthly value (Starter $99, Pro $199, VIP $399; target: $180-200/student)

---

## Part 4: Technical Architecture & Agents

### Site Architecture (Next.js)

**Public Pages** (anyone can access)
- Homepage (brand, credentials, philosophy)
- Course preview (overview of training paths)
- Pricing (membership tiers, à la carte rates)
- Testimonials (student results, social proof)
- Blog (optional: training tips, safety articles)
- Contact (inquiry form)

**Student Authenticated Pages**
- Dashboard (my sessions, progress, drills, certificates)
- Booking (calendar of your availability, book sessions)
- Content library (video drills, assessments, downloads)
- Community forum (student discussions)
- Settings (profile, preferences, billing)

**Instructor Dashboard (You)**
- Student roster (view all students, filter by tier/path)
- Student profiles (individual progress, feedback history, upcoming sessions)
- Session calendar (view/manage bookings, send reminders, record notes)
- Feedback system (give feedback after sessions, students see it in dashboard)
- Content management (upload/manage videos, drills, assessments)
- Analytics (monthly reports: retention, revenue, top performers, testimonials)
- Broadcast messaging (send announcements to all/specific tier students)

**Community Forum**
- Discussion threads (by topic, skill level, or open)
- Success story submissions (student posts progress, you can feature)
- Q&A section (students ask, you and peers answer)
- Moderation tools (for you: pin important posts, remove spam)

### Database Schema

**Core Entities:**
- `Users` (email, name, tier, goals, experience level, assessment results)
- `Sessions` (date, time, type, student list, outcome notes, recording)
- `Content` (videos, quizzes, drills — metadata: title, level, topic, duration)
- `Progress` (per student: drills completed, quizzes passed, sessions attended, certificates)
- `Memberships` (tier, start date, renewal date, billing status)
- `Community Posts` (threads, replies, likes, flagged content)
- `Feedback` (session feedback from you to student)

**Key Relationships:**
- User → Membership (one student, one active membership)
- User → Sessions (many sessions)
- User → Progress (tracks completion of content)
- Session → Content (drills assigned before session)
- Post → User (student posts in forum)

### Integrations

**Payments:** Stripe
- Subscription management (monthly recurring)
- Invoice generation
- Refund processing
- Webhook: payment success/failure

**Email Service:** Resend
- Transactional emails (confirmation, reminder, feedback)
- Marketing emails (weekly drills, re-engagement, promotions)
- Templated emails (you control messaging)

**Video Hosting:** Vimeo or YouTube (private/unlisted videos)
- Students watch drills from dashboard
- Auto-play next video in sequence
- Captions + timestamps

**Calendar:** Embedded booking calendar (Calendly or custom)
- Shows your availability
- Students book slots
- Auto-sync with your Google/Outlook calendar

**Analytics:** Custom dashboard + optional Google Analytics
- Track page views, student behavior, conversion funnel
- Agent generates monthly summary

### Agent Infrastructure (Hermes Orchestration)

**5 Core Agents:**

**1. Scheduler Agent**
- Responsibility: Manage your booking calendar, prevent conflicts
- Triggers:
  - Student books a session → confirm, send reminder to both
  - 24 hours before session → send reminder email to student
  - After session → prompt you to log notes, collect attendance
  - Session cancellation → update calendar, offer alternative slots
- Outcomes: No double-bookings, students never miss sessions, you have clear schedule

**2. Engagement Agent**
- Responsibility: Send personalized emails, track student activity
- Triggers:
  - Weekly: Send "here's your next drill" email (customized per tier)
  - After first session: Congratulations email + next steps
  - After 2 weeks inactive: "We miss you! Book your next session"
  - After 4 weeks active in Starter tier: "You're doing great! Ready to upgrade to Pro?"
  - Monthly: Progress summary (drills completed, sessions attended, next milestones)
- Outcomes: Students stay engaged, high retention, natural tier upgrades

**3. Progress Agent**
- Responsibility: Track student completion, identify who needs help
- Triggers:
  - You log session feedback → agent saves it to student record
  - Student completes drill → agent marks it done, suggests next step
  - Student scores <70% on quiz → flag for you (this student may struggle)
  - Student attends 5+ sessions → eligible for certification test
  - Student completes a full path → generate certificate + celebration email
- Outcomes: Complete audit trail, you know who's struggling, easy certification tracking

**4. Content Recommendation Agent**
- Responsibility: Suggest next drills based on student progress
- Triggers:
  - After session: Based on your feedback, recommend drills to work on
  - After quiz: If student gets <70%, recommend foundational drills
  - Weekly: "Based on your progress, try this advanced drill next"
  - Personalization: Different recommendations per tier, goal, learning style
- Outcomes: Students always know what to do next, continuous progression

**5. Social Media Agent** (new, for rapid growth)
- Responsibility: Auto-post content, engage followers, drive leads
- Triggers:
  - You upload a new video drill → agent creates 3-5 short clips (TikTok, Instagram Reels, YouTube Shorts)
  - Agent posts on schedule: 3x/week Instagram, 5x/week TikTok, 2x/week YouTube, daily Facebook
  - Monitors comments on all platforms → responds to questions, engagement opportunities
  - Finds local people searching for NRA training → engages relevant posts
  - Tracks which posts drive traffic to your platform → reports to you
  - Repurposes student testimonials for social (with permission)
- Outcomes: Consistent social presence, rapid follower growth, local visibility, lead generation

### Agent Data Flow

**Example: Student Enrolls & Completes First Week**

1. Student takes assessment → Progress Agent stores results
2. Agent recommends path → Student selects Starter tier, pays via Stripe
3. Stripe webhook → Scheduler Agent creates welcome appointment
4. Engagement Agent sends welcome email (you, + setup instructions)
5. Student books first session (Saturday 10am) → Scheduler confirms
6. Friday 5pm → Scheduler sends reminder to student
7. Saturday 10am → You teach session, take notes (form, feedback, areas to improve)
8. Saturday 11am → You log session notes in instructor dashboard
9. Progress Agent saves notes, marks "Session 1 Complete" in student record
10. Content Recommendation Agent analyzes your feedback → suggests drill for grip improvement
11. Sunday 9am → Engagement Agent sends: "Great work Saturday! Here's your drill for this week: Grip Fundamentals (video 5 min, then 100 dry-fire reps at home)"
12. Wednesday → Student completes drill, Engagement Agent sends next drill
13. Friday → Engagement Agent: "You're doing great! Your next session is Saturday. Here's what we'll work on..."
14. Social Media Agent (daily): Posts a short training tip on Instagram/TikTok, engages followers

**Key Insight:** You teach. Agents handle everything else (scheduling, reminders, drills, engagement, growth). You review analytics monthly and make strategic decisions.

---

## Part 5: Social Media Strategy & Rapid Growth

### Platforms & Content Strategy

**Instagram** (visual, testimonials, community)
- 3 posts per week
- Content: Progress photos (before/after with permission), training tips, student testimonials, behind-the-scenes
- Stories: Daily updates, Q&A, polls
- Reels: Short clips from your training videos (30-60 sec)
- Goal: Build your personal brand, showcase results, community engagement

**TikTok** (reach, viral potential, younger audience)
- 5 posts per week (short-form is king)
- Content: Training tips (30-60 sec), quick drills, "day in the life," challenges, mistakes to avoid
- Trending sounds/trends (adapt to fitness/safety content)
- Goal: Rapid growth (TikTok rewards consistency), reach people searching for training

**YouTube** (authority, long-form, searchability)
- 2 posts per week (uploaded videos, shorts)
- Content: Full technique tutorials (5-15 min), session recordings (with student permission), Q&A, student spotlights
- Playlists: "Beginner Fundamentals," "Accuracy Techniques," "Concealed Carry," etc.
- Goal: Authority, evergreen SEO (people search YouTube for training), drive students to platform

**Facebook** (local community, events, engagement)
- Daily posts
- Content: Events (free intro sessions), community announcements, testimonials, resources
- Local targeting: Promote to people in your area searching for NRA training
- Goal: Local visibility, lead generation, event promotion

### Agent Responsibilities (Social Media)

**Content Creation Agent**
- You record training videos → agent auto-cuts clips (30-60 sec for TikTok/Reels, 2-3 min for YouTube)
- Agent adds: captions, trending music (where appropriate), on-screen text ("Tip #1: Grip"), branding
- Creates variations: Same 2-min video → 6 different clips (different angles, captions, music) for maximum reach
- Uploads to all platforms on schedule

**Engagement Agent**
- Monitors comments/DMs on all platforms → responds to questions (friendly, informative)
- Engages with local fitness, safety, NRA communities (like relevant posts, comment helpfully)
- Searches hashtags (#NRAtraining, #ConcealedCarry, etc.) → finds people interested → engages
- Collects user-generated content (students posting training videos) → reposts with credit + encouragement

**Lead Generation Agent**
- Tracks which posts drive clicks to your platform (UTM parameters)
- Identifies top-performing content (most saves, shares, comments) → double down on that style
- Creates lookalike audiences (Facebook/Instagram) based on people who clicked your platform
- Suggests timing (what time gets most engagement) → Content Agent posts at optimal times

**Reporting Agent**
- Monthly social media report: followers gained, engagement rate, clicks to platform, new signups from social
- Identifies trends: Which content style performs best, which platform converts best
- Recommends next month's strategy based on data

### Content Repurposing Calendar

**Example Week:**

**Monday:**
- You record a 10-min video on "Grip Fundamentals"
- Content Agent extracts 6 clips:
  - TikTok #1: "Common grip mistake" (30 sec)
  - TikTok #2: "How to fix your grip" (45 sec)
  - Instagram Reel: "Grip 101" (60 sec, music)
  - YouTube Short: "Grip mistake to avoid" (45 sec)
  - Facebook: "New grip video on YouTube" (link + thumbnail)
  - YouTube main: "Complete Grip Fundamentals Tutorial" (10 min)

**Tuesday:**
- Engagement Agent responds to comments from Monday posts
- Student posts training video on Instagram → Agent reposts to your story with credit

**Wednesday:**
- Content Agent posts 2 TikToks (different times for reach)
- Agent engages: Comments on 10 local fitness accounts, responds to DMs

**Thursday:**
- Engagement Agent: "Weekly tip" post across platforms

**Friday:**
- Content Agent posts weekend reminder (free intro session Saturday?)

**Ongoing:**
- Daily Facebook engagement (respond to comments, engage local community)
- 3-5x/week Instagram engagement (like/comment on local accounts, follower accounts)
- Collect testimonials from students for next week's social

### Lead Generation & Conversion

**Social → Platform Funnel**
1. Person sees your TikTok ("Concealed Carry Tips") → interested
2. Clicks link in bio → lands on your homepage
3. Sees your credentials, testimonials → builds trust
4. Takes assessment quiz → sees personalized path + pricing
5. Books first session or signs up for Starter tier
6. Engagement Agent tracks: "This person came from TikTok post #X on date Y"
7. You can see which posts actually convert → adjust strategy

**Paid Ads (Optional, Later)**
- Once you have 500+ followers on Instagram, 1K+ on TikTok
- Use best-performing organic content → promote to similar audiences
- Target: Local people searching for NRA training, fitness, safety
- Goal: Accelerate growth once you know what works

### Success Metrics (Social Media)

**Month 1-2:**
- Instagram: 100-200 followers
- TikTok: 200-500 followers
- Facebook: 100-300 followers
- Engagement rate: 3-5% (likes, comments, shares)

**Month 3-6:**
- Instagram: 500-1K followers
- TikTok: 1K-3K followers
- Facebook: 500-1K followers
- Engagement rate: 5-8%
- Lead source: 5-10 students per month from social

**By Month 12:**
- Instagram: 1K-2K followers
- TikTok: 3K-10K followers
- Facebook: 1K-2K followers
- Engagement rate: 5-10%
- Lead source: 20-50 students per month from social
- Brand awareness: Local searches for "NRA training near me" → you show up

---

## Implementation Notes

### Technology Stack

**Frontend:** Next.js 16, React 19, Tailwind CSS, TypeScript (same as current academy site, for consistency)

**Backend:** Express.js (API), PostgreSQL (database), Redis (caching for real-time notifications)

**Video:** Vimeo or YouTube (private/embedded)

**Payments:** Stripe (subscriptions, invoicing)

**Email:** Resend (transactional + marketing)

**Hosting:** Vercel (frontend), DigitalOcean or AWS (backend/database)

**Agents:** Hermes orchestration (Node.js agents running on PM2)

### Phased Rollout

**Phase 1 (Weeks 1-4):** Core platform
- Homepage redesign, membership tiers, booking system
- Basic student dashboard
- Payment integration
- First 2 agents (Scheduler, Engagement)

**Phase 2 (Weeks 5-8):** Community & Content
- Video library upload
- Community forum
- Assessment system
- Progress tracking
- Add 3 more agents (Progress, Content Rec, Social Media)

**Phase 3 (Weeks 9-12):** Launch & Growth
- Social media ramp-up (post consistently, build followers)
- Email campaigns (welcome series, engagement drips)
- Testimonial collection
- Analytics & optimization

### Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Students don't upgrade from Starter | Engagement Agent sends personalized upgrade messages; offer trial of Pro features |
| Social media content gets no engagement | Content Agent A/B tests formats; Engagement Agent analyzes what works locally |
| Scheduling conflicts (double-booking) | Scheduler Agent prevents this; calendar sync validated before launch |
| Difficult to manage student feedback | Dashboard for you to log notes; Progress Agent surfaces patterns |
| Low initial traffic | Pre-launch buzz via email/word-of-mouth; social media ramp-up Phase 1-2 |

---

## Success Definition

**You will know this is working when:**
- 50+ students signed up within first month
- 70%+ retention month-over-month (students stay active)
- $3K-5K monthly recurring revenue from memberships
- 500+ social media followers by month 3
- 5-10 student testimonials/success stories in first quarter
- You're teaching 10+ sessions per week (full calendar)
- Agents handle all scheduling, drills, follow-up (you only teach & give feedback)

**You will know this needs adjustment when:**
- <30% of Starter students convert to Pro (engagement isn't working)
- Retention <60% (students leaving too early)
- Social media not growing (content isn't resonating locally)
- Students booking but not completing drills (path too hard or confusing)

---

## Design Approval Checklist

- [x] Platform architecture (site, bookings, dashboard) 
- [x] Personalization engine (assessments, paths, feedback)
- [x] Community & content strategy (forum, drills, library)
- [x] Business model (tiers, pricing, revenue)
- [x] Technical architecture (Next.js, database, integrations)
- [x] Agent ecosystem (5 agents, responsibilities, workflows)
- [x] Social media strategy (platforms, content, lead generation)
- [x] Success metrics & KPIs
- [x] Phased rollout & risk mitigation

**All sections approved by user. Ready for implementation planning.**

---

## Next Steps

1. ✅ Design approved (this document)
2. ⏳ User reviews written spec
3. ⏳ Invoke writing-plans skill to create detailed implementation plan
4. ⏳ Begin Phase 1 implementation
