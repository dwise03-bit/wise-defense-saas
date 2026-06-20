# Tier Discovery Modal: Design Spec

**Date:** 2026-06-20  
**Project:** Wise Defense Academy  
**Goal:** Reduce confusion when selecting membership tier; guide users to the right plan based on their goals and experience  
**Success Metric:** Increase signup conversion rate by clarifying tier value before commitment  

---

## Problem Statement

Users landing on the pricing page face three tier options (Starter, Pro, VIP) and struggle to choose because:
- They don't know their own learning goals (beginner? competitive? part-time?)
- Tier benefits aren't contextualized to their needs
- Fear of wrong choice → abandonment or post-signup regret

**Impact:** Lost signups + potential churn from mismatched tier selection

---

## Solution: Lightweight Tier Discovery Flow

A **3-question modal** that guides users to their ideal tier before they reach pricing. Non-blocking, dismissible, personalized.

---

## User Experience Flow

### **Entry Points**
1. **Homepage Hero:** "Find Your Tier" button (secondary CTA below main "Start Training")
2. **Pricing Page:** "Not sure which tier?" link above tier cards
3. Both trigger the same modal

### **Question Sequence**

Users answer one question per screen:

**Q1: Experience Level**
> "What's your background?"
- 🔰 Beginner (never shot before)
- 📍 Some experience (taken a course or two)
- 🎯 Competitive shooter (looking to improve)

**Q2: Time Commitment**
> "How much time can you dedicate?"
- 😌 Casual (learn at my own pace, no schedule)
- ⏰ 2-3 hours/week (want to build momentum)
- 💪 Serious (1+ hour coaching weekly)

**Q3: Primary Goal**
> "What's your main goal?"
- 🛡️ Learn safely (foundational skills)
- 🎯 Self-defense (real-world readiness)
- 🏆 Competition (master advanced techniques)
- 📈 Improve skills (already know basics)

### **Recommendation Logic**

Simple scoring based on experience + commitment:

| Experience | Time | Goal | Recommendation |
|------------|------|------|-----------------|
| Beginner | Any | Any | **Starter** (build foundation) |
| Some exp | Casual | Learn/Skills | **Starter** (maintain flexibility) |
| Some exp | 2-3 hrs | Self-defense/Skills | **Pro** (structured coaching) |
| Any | Serious | Any | **VIP** (dedicated coaching) |
| Competitive | Any | Competition | **VIP** (advanced program) |

### **Recommendation Screen**

Displays personalized tier card:

```
┌─────────────────────────────────┐
│  Your Perfect Fit: PRO TIER     │ ← Gold border, checkmark
├─────────────────────────────────┤
│  $199/month                     │
│                                 │
│  Based on your profile:         │
│  ✓ Some shooting experience     │
│  ✓ Can commit 2-3 hours/week    │
│  ✓ Focused on self-defense      │
│                                 │
│  Why Pro?                       │
│  • Concealed carry course       │
│  • 2 personalized coaching/mo   │
│  • Priority support             │
│                                 │
│  [Start with Pro] [View All]    │
└─────────────────────────────────┘
```

### **User Flow Summary**

```
Landing Page / Pricing Page
         ↓
    Click CTA
         ↓
  Modal Opens
         ↓
  Q1: Experience → Q2: Time → Q3: Goal
         ↓
  Recommendation Display
         ↓
  [Start with Tier] → /auth/signup?tier=pro
         ↓
  Signup Form (tier pre-selected)
```

**Always-available escape:** 
- Close button (X) → Returns to where they came from
- "Skip" link on any screen → Goes to pricing page (no recommendation)
- "View All" button on recommendation → Opens pricing for comparison

---

## Technical Architecture

### **Components**

```
TierDiscoveryModal (parent)
├── QuestionScreen (reusable)
│   ├── Question text
│   ├── Radio options (3 per screen)
│   └── Navigation (Next, Skip, Close)
├── RecommendationScreen
│   ├── Recommended tier card
│   ├── Personalized explanation
│   └── CTA buttons
└── ModalContainer (wrapper)
    ├── Close button
    └── Progress indicator (1/3, 2/3, 3/3)
```

### **State Management**

Store in React state:

```typescript
interface DiscoveryState {
  experience: 'beginner' | 'some' | 'competitive' | null;
  timeCommitment: 'casual' | '2-3hrs' | 'serious' | null;
  goal: 'safe' | 'self-defense' | 'competition' | 'improve' | null;
  recommendedTier: 'starter' | 'pro' | 'vip' | null;
  currentStep: 1 | 2 | 3 | 'result';
}
```

### **Scoring Algorithm**

```
function getRecommendedTier(state: DiscoveryState): Tier {
  if (state.experience === 'beginner') return 'starter';
  if (state.timeCommitment === 'serious') return 'vip';
  if (state.experience === 'competitive') return 'vip';
  if (state.timeCommitment === '2-3hrs' && 
      (state.goal === 'self-defense' || state.goal === 'improve')) 
    return 'pro';
  return 'starter';
}
```

### **Navigation & Routing**

- Modal is a portal (renders outside normal DOM tree)
- "Start with [Tier]" button → `/auth/signup?tier=pro`
- Signup form reads `tier` param and pre-selects membership
- "Skip" or Close → Back to original page (homepage or pricing)

### **Integration Points**

**1. Homepage (`dashboard/app/page.tsx`)**
- Add button in hero section or below testimonials
- Import `TierDiscoveryModal` and trigger on click

**2. Pricing Page (`dashboard/app/pricing/page.tsx`)**
- Add "Not sure which tier?" link above tier cards
- Same modal trigger

**3. Signup Form (`dashboard/app/auth/signup/page.tsx`)**
- Read `tier` query param
- Pre-select radio button if present
- Allow user to change if they want

**4. Analytics (Phase 2)**
- Track modal engagement: opened, completed, skipped
- Track recommended vs. chosen tier
- Track signup completion rate by recommended tier

---

## Design & Styling

### **Visual Hierarchy**

- **Modal background:** Semi-transparent dark overlay (existing pattern)
- **Question screens:** Clean white card, single question per screen, large readable text
- **Recommendation screen:** Highlight recommended tier with gold/chrome border + ✓ checkmark
- **Buttons:** Use existing brand CTA styles (neon-red for primary, chrome for secondary)

### **Responsive Design**

- **Desktop:** Centered modal, ~500px wide
- **Tablet:** Slightly narrower, remains centered
- **Mobile:** Full-width modal with padding, touch-friendly buttons (48px min height)

### **Accessibility**

- All radio groups labeled properly (`<label htmlFor>`)
- Keyboard navigation: Tab through options, Enter to select, Esc to close
- Screen reader: Clear question text, option descriptions read correctly
- High contrast: Use existing brand colors (tested for WCAG AA compliance)

### **Animations**

- Smooth fade-in/fade-out between screens (200ms)
- Progress indicator updates with question number
- Recommendation screen has subtle scale-up (premium feel)

---

## Implementation Phases

### **Phase 1: MVP (Week 1)**

**Must-have:**
- ✅ Build 3-question modal
- ✅ Implement scoring logic
- ✅ Connect to signup with `?tier=` param
- ✅ Add CTA to homepage + pricing
- ✅ Test on mobile

**Optional but nice:**
- Analytics tracking (can add in Phase 2)
- A/B testing framework (Phase 2)

### **Phase 2: Refinement (Week 2+)**

**Based on real user data:**
- Adjust question wording if users don't understand options
- Refine scoring based on actual tier choices vs. recommendations
- Add animations and visual polish
- Implement analytics dashboard

### **Phase 3: Expansion (Future)**

- Add personalized testimonials ("See what other beginners think of Pro")
- Show sample drills from each tier
- Live chat for "help me choose" scenarios

---

## Success Metrics

**Measure 30 days post-launch:**

1. **Engagement Rate**
   - % of users who see the CTA and click
   - Target: >20% of homepage/pricing visitors

2. **Completion Rate**
   - % who complete all 3 questions (vs. skip/close)
   - Target: >70% of those who open modal

3. **Conversion Impact**
   - Signup completion rate (users clicking "Start with [Tier]")
   - Compare to pre-modal baseline
   - Target: +10% increase in pricing → signup conversion

4. **Tier Selection**
   - % of users who select recommended tier vs. different tier
   - Target: >60% adoption of recommendation

5. **Churn Indicator** (after 7 days)
   - Do users recommended to Starter stay longer than random picks?
   - Do Pro/VIP recommendations have higher engagement?
   - Target: 15% improvement in week-1 retention by tier match

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Modal feels like a gate (discourages signups) | Make it dismissible; always offer "Skip" option |
| Scoring logic is wrong (recommends wrong tier) | Start simple, refine based on A/B data; always show "View All" |
| Mobile modal is cramped | Test extensively on small screens; use full-width layout |
| Users ignore recommendation | Track adoption; adjust messaging if <50% follow recommendation |

---

## Out of Scope (Phase 2+)

- Integration with other discovery flows (email campaigns, blog)
- Detailed quiz (keep it to 3 questions for this phase)
- Machine learning / dynamic scoring
- A/B testing infrastructure (Phase 2)

---

## Dependencies & Assumptions

**Dependencies:**
- Existing signup form with tier selection (`/auth/signup`)
- Working routing and query params
- Existing Tailwind + component library

**Assumptions:**
- Users will engage with a 3-question flow (validated: high completion rates on simple flows)
- Simple rules-based scoring is accurate enough for MVP (refined later with data)
- Homepage/pricing traffic is significant enough to measure impact in 30 days

---

## Definition of Done

✅ Modal displays on homepage + pricing page  
✅ All 3 questions flow smoothly (no bugs, proper state management)  
✅ Scoring logic works for all 9 combinations (3×3 matrix)  
✅ Recommendation screen displays personalized tier + explanation  
✅ "Start with Tier" button pre-fills signup form correctly  
✅ Modal is dismissible at all points  
✅ Mobile responsive (tested on iPhone + Android)  
✅ Accessibility checked (keyboard nav, screen reader, color contrast)  
✅ No console errors or type warnings  
✅ Merged to main and deployed to staging  

---

## Questions for Review

Before implementation:
1. Should we track which tier users ignore (recommendation vs. actual choice)?
2. Any preference for where the CTA button sits on homepage (hero vs. below testimonials)?
3. Should we add a "help me decide" support link on the modal?
