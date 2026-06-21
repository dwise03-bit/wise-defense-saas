# Tier Discovery Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 3-question guided modal that helps users discover their ideal membership tier before committing to a purchase, reducing confusion and increasing conversion.

**Architecture:** Modal-based flow with React state management. Users answer experience level, time commitment, and goal across 3 screens. Scoring logic recommends a tier, displays personalized explanation, and pre-fills signup form. Modal is dismissible at all points and integrates into homepage and pricing page.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, React Portal (for modal overlay)

## Global Constraints

- No Phase 2 features (analytics, A/B testing, refinements)
- Use existing Tailwind + component patterns from `dashboard/components/`
- Follow brand colors: black background, chrome text, neon-red accents
- Mobile-first responsive design
- WCAG AA accessibility compliance (keyboard nav, screen reader ready)
- All 3 questions must flow smoothly; state must persist through modal navigation
- Must support query param `?tier=` in signup form to pre-select tier

---

## File Structure

**Files to create:**
- `dashboard/components/TierDiscovery/types.ts` — TypeScript interfaces
- `dashboard/components/TierDiscovery/TierDiscoveryModal.tsx` — Parent component
- `dashboard/components/TierDiscovery/QuestionScreen.tsx` — Reusable question component
- `dashboard/components/TierDiscovery/RecommendationScreen.tsx` — Final recommendation display
- `dashboard/components/TierDiscovery/ModalContainer.tsx` — Modal wrapper with overlay
- `dashboard/lib/tierRecommendation.ts` — Scoring logic + types
- `dashboard/__tests__/tierRecommendation.test.ts` — Unit tests for scoring

**Files to modify:**
- `dashboard/app/page.tsx` — Add "Find Your Tier" CTA to homepage
- `dashboard/app/pricing/page.tsx` — Add "Not sure which tier?" link
- `dashboard/app/auth/signup/page.tsx` — Handle `?tier=` query param

---

## Task Breakdown

### Task 1: Set Up Types & Scoring Logic

**Files:**
- Create: `dashboard/lib/tierRecommendation.ts`
- Create: `dashboard/__tests__/tierRecommendation.test.ts`

**Interfaces:**
- Produces: `type Experience = 'beginner' | 'some' | 'competitive'`
- Produces: `type TimeCommitment = 'casual' | '2-3hrs' | 'serious'`
- Produces: `type Goal = 'safe' | 'self-defense' | 'competition' | 'improve'`
- Produces: `type Tier = 'starter' | 'pro' | 'vip'`
- Produces: `function getRecommendedTier(experience, timeCommitment, goal): Tier`

- [ ] **Step 1: Write failing tests for scoring logic**

Create `dashboard/__tests__/tierRecommendation.test.ts`:

```typescript
import { getRecommendedTier } from '../lib/tierRecommendation';

describe('getRecommendedTier', () => {
  test('recommends Starter for beginners regardless of time/goal', () => {
    expect(getRecommendedTier('beginner', 'casual', 'safe')).toBe('starter');
    expect(getRecommendedTier('beginner', '2-3hrs', 'self-defense')).toBe('starter');
    expect(getRecommendedTier('beginner', 'serious', 'competition')).toBe('starter');
  });

  test('recommends VIP for serious commitment regardless of experience', () => {
    expect(getRecommendedTier('some', 'serious', 'safe')).toBe('vip');
    expect(getRecommendedTier('competitive', 'serious', 'improve')).toBe('vip');
  });

  test('recommends VIP for competitive shooters', () => {
    expect(getRecommendedTier('competitive', 'casual', 'competition')).toBe('vip');
    expect(getRecommendedTier('competitive', '2-3hrs', 'improve')).toBe('vip');
  });

  test('recommends Pro for some experience + 2-3hrs + (self-defense or improve)', () => {
    expect(getRecommendedTier('some', '2-3hrs', 'self-defense')).toBe('pro');
    expect(getRecommendedTier('some', '2-3hrs', 'improve')).toBe('pro');
  });

  test('recommends Starter for some experience + casual time', () => {
    expect(getRecommendedTier('some', 'casual', 'safe')).toBe('starter');
    expect(getRecommendedTier('some', 'casual', 'improve')).toBe('starter');
  });

  test('defaults to Starter for edge cases', () => {
    expect(getRecommendedTier('some', '2-3hrs', 'safe')).toBe('starter');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd dashboard && npm test -- __tests__/tierRecommendation.test.ts
```

Expected: All 6 tests FAIL with "getRecommendedTier is not defined"

- [ ] **Step 3: Implement scoring logic**

Create `dashboard/lib/tierRecommendation.ts`:

```typescript
export type Experience = 'beginner' | 'some' | 'competitive';
export type TimeCommitment = 'casual' | '2-3hrs' | 'serious';
export type Goal = 'safe' | 'self-defense' | 'competition' | 'improve';
export type Tier = 'starter' | 'pro' | 'vip';

export interface DiscoveryState {
  experience: Experience | null;
  timeCommitment: TimeCommitment | null;
  goal: Goal | null;
}

export interface TierInfo {
  tier: Tier;
  price: number;
  description: string;
  benefits: string[];
}

export const TIER_RECOMMENDATIONS: Record<Tier, TierInfo> = {
  starter: {
    tier: 'starter',
    price: 99,
    description: 'Build your foundation safely',
    benefits: [
      'Beginner Fundamentals course',
      'Community forum access',
      'Performance tracking',
      'Certificates upon completion',
    ],
  },
  pro: {
    tier: 'pro',
    price: 199,
    description: 'Structured learning with personal guidance',
    benefits: [
      'Everything in Starter, plus:',
      'Concealed Carry course',
      '2 personalized coaching sessions/month',
      'Priority email support',
    ],
  },
  vip: {
    tier: 'vip',
    price: 399,
    description: 'Dedicated mastery and professional coaching',
    benefits: [
      'Everything in Pro, plus:',
      'Competitive Shooting course',
      'Weekly 1-on-1 coaching',
      '24/7 phone support',
      'Custom training programs',
    ],
  },
};

export function getRecommendedTier(
  experience: Experience,
  timeCommitment: TimeCommitment,
  goal: Goal
): Tier {
  // Rule 1: Beginners always get Starter
  if (experience === 'beginner') {
    return 'starter';
  }

  // Rule 2: Serious commitment always gets VIP
  if (timeCommitment === 'serious') {
    return 'vip';
  }

  // Rule 3: Competitive shooters get VIP
  if (experience === 'competitive') {
    return 'vip';
  }

  // Rule 4: Some experience + 2-3 hrs/week + (self-defense or improve) = Pro
  if (
    experience === 'some' &&
    timeCommitment === '2-3hrs' &&
    (goal === 'self-defense' || goal === 'improve')
  ) {
    return 'pro';
  }

  // Default: Starter
  return 'starter';
}

export function getRecommendationExplanation(
  experience: Experience,
  timeCommitment: TimeCommitment,
  goal: Goal,
  recommendedTier: Tier
): {
  profilePoints: string[];
  explanation: string;
} {
  const experienceLabel = {
    beginner: 'You\'re a beginner looking to learn safely',
    some: 'You have some shooting experience',
    competitive: 'You\'re a competitive shooter',
  }[experience];

  const timeLabel = {
    casual: 'You want flexible, self-paced learning',
    '2-3hrs': 'You can commit 2-3 hours per week',
    serious: 'You want dedicated weekly coaching',
  }[timeCommitment];

  const goalLabel = {
    safe: 'focusing on safety fundamentals',
    'self-defense': 'focused on self-defense readiness',
    competition: 'aiming for competitive excellence',
    improve: 'looking to improve existing skills',
  }[goal];

  const profilePoints = [
    experienceLabel,
    timeLabel,
    goalLabel,
  ];

  const explanationMap: Record<Tier, string> = {
    starter: 'Starter gives you everything you need to build a strong foundation with flexibility.',
    pro: 'Pro tier provides structured coaching and deeper training to level up your skills.',
    vip: 'VIP is the full commitment: dedicated coaching, all courses, and priority support.',
  };

  return {
    profilePoints,
    explanation: explanationMap[recommendedTier],
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd dashboard && npm test -- __tests__/tierRecommendation.test.ts
```

Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add dashboard/lib/tierRecommendation.ts dashboard/__tests__/tierRecommendation.test.ts
git commit -m "feat: add tier recommendation scoring logic with tests"
```

---

### Task 2: Create QuestionScreen Component

**Files:**
- Create: `dashboard/components/TierDiscovery/QuestionScreen.tsx`

**Interfaces:**
- Consumes: `type Experience | TimeCommitment | Goal` from Task 1
- Produces: `QuestionScreenProps { question: string; options: Option[]; selected: string | null; onSelect: (value: string) => void; onNext: () => void; onSkip: () => void; stepNumber: number; totalSteps: number; }`

- [ ] **Step 1: Create QuestionScreen component**

Create `dashboard/components/TierDiscovery/QuestionScreen.tsx`:

```typescript
'use client';

import React from 'react';

interface Option {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface QuestionScreenProps {
  question: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  stepNumber: number;
  totalSteps: number;
  onClose: () => void;
}

export function QuestionScreen({
  question,
  options,
  selected,
  onSelect,
  onNext,
  onSkip,
  stepNumber,
  totalSteps,
  onClose,
}: QuestionScreenProps) {
  const handleSubmit = () => {
    if (selected) {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header with close and progress */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            Question {stepNumber} of {totalSteps}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question}</h2>

          {/* Radio options */}
          <fieldset className="space-y-3">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: selected === option.value ? '#ff1744' : '#e5e7eb',
                  backgroundColor:
                    selected === option.value ? '#fff3f4' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="question"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={(e) => onSelect(e.target.value)}
                  className="mt-1 mr-3"
                  aria-label={option.label}
                />
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-900">
                    {option.icon} {option.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </div>
              </label>
            ))}
          </fieldset>
        </div>

        {/* Buttons */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test QuestionScreen renders and responds to interactions**

Manually test in browser by importing into a test page:
- Verify radio buttons render correctly
- Verify onSelect fires when clicking option
- Verify onNext fires when clicking Next with selection
- Verify onSkip fires when clicking Skip
- Verify onClose fires when clicking X
- Verify progress bar fills correctly for each step

- [ ] **Step 3: Commit**

```bash
git add dashboard/components/TierDiscovery/QuestionScreen.tsx
git commit -m "feat: create QuestionScreen component for tier discovery flow"
```

---

### Task 3: Create RecommendationScreen Component

**Files:**
- Create: `dashboard/components/TierDiscovery/RecommendationScreen.tsx`
- Modify: `dashboard/components/TierDiscovery/types.ts` (new file for shared types)

**Interfaces:**
- Consumes: `Tier, TierInfo, DiscoveryState` from Task 1
- Produces: `RecommendationScreenProps { tier: Tier; tierInfo: TierInfo; profilePoints: string[]; explanation: string; onStart: () => void; onViewAll: () => void; onClose: () => void; }`

- [ ] **Step 1: Create RecommendationScreen component**

Create `dashboard/components/TierDiscovery/RecommendationScreen.tsx`:

```typescript
'use client';

import React from 'react';
import { Tier, TierInfo } from '../../lib/tierRecommendation';

interface RecommendationScreenProps {
  tier: Tier;
  tierInfo: TierInfo;
  profilePoints: string[];
  explanation: string;
  onStart: (tier: Tier) => void;
  onViewAll: () => void;
  onClose: () => void;
}

export function RecommendationScreen({
  tier,
  tierInfo,
  profilePoints,
  explanation,
  onStart,
  onViewAll,
  onClose,
}: RecommendationScreenProps) {
  const tierColors: Record<Tier, string> = {
    starter: 'bg-blue-50 border-blue-200',
    pro: 'bg-yellow-50 border-yellow-300',
    vip: 'bg-red-50 border-red-300',
  };

  const tierTextColors: Record<Tier, string> = {
    starter: 'text-blue-900',
    pro: 'text-yellow-900',
    vip: 'text-red-900',
  };

  const tierButtonColors: Record<Tier, string> = {
    starter: 'bg-blue-600 hover:bg-blue-700',
    pro: 'bg-yellow-600 hover:bg-yellow-700',
    vip: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header with close */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="text-sm text-gray-600">Your Perfect Fit</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Recommended tier card */}
        <div className={`p-6 ${tierColors[tier]} border-2 rounded-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold uppercase ${tierTextColors[tier]}`}>
              {tier} Tier
            </h2>
            <span className="text-2xl">✓</span>
          </div>
          <div className={`text-lg font-semibold ${tierTextColors[tier]}`}>
            ${tierInfo.price}/month
          </div>
          <p className={`text-sm mt-2 ${tierTextColors[tier]}`}>{tierInfo.description}</p>
        </div>

        {/* Profile points */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Based on your profile:</h3>
          <ul className="space-y-2">
            {profilePoints.map((point, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <span className="text-red-500 mr-2">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why this tier */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Why {tier}?</h3>
          <ul className="space-y-2">
            {tierInfo.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <span className="text-red-500 mr-2">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-4">{explanation}</p>
        </div>

        {/* Buttons */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onViewAll}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            View All
          </button>
          <button
            onClick={() => onStart(tier)}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition ${tierButtonColors[tier]}`}
          >
            Start with {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test RecommendationScreen renders correctly**

Manually test:
- Verify tier card displays with correct styling
- Verify profile points render as list
- Verify benefits render as list
- Verify "Start with [Tier]" button shows correct tier name
- Verify onStart is called with tier when button clicked
- Verify onViewAll is called when "View All" clicked
- Verify onClose is called when X clicked

- [ ] **Step 3: Commit**

```bash
git add dashboard/components/TierDiscovery/RecommendationScreen.tsx
git commit -m "feat: create RecommendationScreen component for personalized tier recommendation"
```

---

### Task 4: Create TierDiscoveryModal Parent Component

**Files:**
- Create: `dashboard/components/TierDiscovery/TierDiscoveryModal.tsx`

**Interfaces:**
- Consumes: `QuestionScreen`, `RecommendationScreen`, `getRecommendedTier`, `TIER_RECOMMENDATIONS` from Tasks 1-3
- Produces: `TierDiscoveryModalProps { isOpen: boolean; onClose: () => void; onTierSelect: (tier: Tier) => void; }`

- [ ] **Step 1: Create parent component with state management**

Create `dashboard/components/TierDiscovery/TierDiscoveryModal.tsx`:

```typescript
'use client';

import React, { useState } from 'react';
import { QuestionScreen } from './QuestionScreen';
import { RecommendationScreen } from './RecommendationScreen';
import {
  Experience,
  TimeCommitment,
  Goal,
  getRecommendedTier,
  getRecommendationExplanation,
  TIER_RECOMMENDATIONS,
} from '../../lib/tierRecommendation';

interface TierDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTierSelect: (tier: string) => void;
}

export function TierDiscoveryModal({
  isOpen,
  onClose,
  onTierSelect,
}: TierDiscoveryModalProps) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'result'>(1);

  if (!isOpen) return null;

  const handleExperienceSelect = (value: string) => {
    setExperience(value as Experience);
  };

  const handleTimeSelect = (value: string) => {
    setTimeCommitment(value as TimeCommitment);
  };

  const handleGoalSelect = (value: string) => {
    setGoal(value as Goal);
  };

  const handleSkip = () => {
    onClose();
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3 && experience && timeCommitment && goal) {
      setCurrentStep('result');
    }
  };

  const handleStartTier = (tier: string) => {
    onTierSelect(tier);
    onClose();
  };

  const handleViewAll = () => {
    onClose();
    // User can view pricing page; they can navigate there after closing
  };

  if (currentStep === 'result' && experience && timeCommitment && goal) {
    const recommendedTier = getRecommendedTier(experience, timeCommitment, goal);
    const tierInfo = TIER_RECOMMENDATIONS[recommendedTier];
    const { profilePoints, explanation } = getRecommendationExplanation(
      experience,
      timeCommitment,
      goal,
      recommendedTier
    );

    return (
      <RecommendationScreen
        tier={recommendedTier}
        tierInfo={tierInfo}
        profilePoints={profilePoints}
        explanation={explanation}
        onStart={handleStartTier}
        onViewAll={handleViewAll}
        onClose={onClose}
      />
    );
  }

  if (currentStep === 1) {
    return (
      <QuestionScreen
        question="What's your background?"
        options={[
          {
            value: 'beginner',
            label: 'Beginner',
            icon: '🔰',
            description: 'Never shot before',
          },
          {
            value: 'some',
            label: 'Some experience',
            icon: '📍',
            description: 'Taken a course or two',
          },
          {
            value: 'competitive',
            label: 'Competitive shooter',
            icon: '🎯',
            description: 'Looking to improve',
          },
        ]}
        selected={experience}
        onSelect={handleExperienceSelect}
        onNext={handleNext}
        onSkip={handleSkip}
        stepNumber={1}
        totalSteps={3}
        onClose={onClose}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <QuestionScreen
        question="How much time can you dedicate?"
        options={[
          {
            value: 'casual',
            label: 'Casual',
            icon: '😌',
            description: 'Learn at my own pace, no schedule',
          },
          {
            value: '2-3hrs',
            label: '2-3 hours/week',
            icon: '⏰',
            description: 'Want to build momentum',
          },
          {
            value: 'serious',
            label: 'Serious',
            icon: '💪',
            description: '1+ hour coaching weekly',
          },
        ]}
        selected={timeCommitment}
        onSelect={handleTimeSelect}
        onNext={handleNext}
        onSkip={handleSkip}
        stepNumber={2}
        totalSteps={3}
        onClose={onClose}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <QuestionScreen
        question="What's your main goal?"
        options={[
          {
            value: 'safe',
            label: 'Learn safely',
            icon: '🛡️',
            description: 'Foundational skills',
          },
          {
            value: 'self-defense',
            label: 'Self-defense',
            icon: '🎯',
            description: 'Real-world readiness',
          },
          {
            value: 'competition',
            label: 'Competition',
            icon: '🏆',
            description: 'Master advanced techniques',
          },
          {
            value: 'improve',
            label: 'Improve skills',
            icon: '📈',
            description: 'Already know basics',
          },
        ]}
        selected={goal}
        onSelect={handleGoalSelect}
        onNext={handleNext}
        onSkip={handleSkip}
        stepNumber={3}
        totalSteps={3}
        onClose={onClose}
      />
    );
  }

  return null;
}
```

- [ ] **Step 2: Test parent component flow**

Manually test in browser:
- Verify modal opens when isOpen=true
- Verify clicking Next progresses through all 3 questions
- Verify final screen shows recommendation
- Verify clicking "Start with [Tier]" calls onTierSelect with correct tier
- Verify onClose is called when X is clicked
- Verify Skip at any point calls onClose
- Verify all selections are captured correctly

- [ ] **Step 3: Commit**

```bash
git add dashboard/components/TierDiscovery/TierDiscoveryModal.tsx
git commit -m "feat: create TierDiscoveryModal parent component with full flow"
```

---

### Task 5: Integrate into Homepage

**Files:**
- Modify: `dashboard/app/page.tsx`

**Interfaces:**
- Consumes: `TierDiscoveryModal` from Task 4
- Produces: "Find Your Tier" CTA button that triggers modal and navigates to signup on tier selection

- [ ] **Step 1: Add state and modal to homepage**

Modify `dashboard/app/page.tsx`:

Find the hero section and update it:

```typescript
'use client';

import { useState } from 'react';
import { TierDiscoveryModal } from '@/components/TierDiscovery/TierDiscoveryModal';
import { useRouter } from 'next/navigation';

// ... existing imports and code

export default function Home() {
  const [showTierModal, setShowTierModal] = useState(false);
  const router = useRouter();

  const handleTierSelect = (tier: string) => {
    setShowTierModal(false);
    router.push(`/auth/signup?tier=${tier}`);
  };

  return (
    <main className="bg-black min-h-screen">
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        {/* ... existing header code ... */}
      </header>

      <section className="relative bg-black py-24 px-4 overflow-hidden">
        {/* ... existing hero content ... */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="heading-silver text-6xl mb-6">
            Premium Firearms Training
          </h1>
          {/* ... existing content ... */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a href="/auth/signup">
              <button className="btn-primary">Start Training</button>
            </a>
            <button
              onClick={() => setShowTierModal(true)}
              className="btn-secondary"
            >
              Find Your Tier
            </button>
          </div>
        </div>
      </section>

      {/* ... rest of homepage ... */}

      <TierDiscoveryModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        onTierSelect={handleTierSelect}
      />
    </main>
  );
}
```

- [ ] **Step 2: Test on homepage**

Manually test:
- Button is visible and clickable
- Clicking opens modal
- Going through flow and selecting tier navigates to /auth/signup?tier=starter (or pro/vip)
- Close button returns to homepage without navigation

- [ ] **Step 3: Commit**

```bash
git add dashboard/app/page.tsx
git commit -m "feat: add tier discovery CTA to homepage"
```

---

### Task 6: Integrate into Pricing Page

**Files:**
- Modify: `dashboard/app/pricing/page.tsx`

**Interfaces:**
- Consumes: `TierDiscoveryModal` from Task 4
- Produces: "Not sure which tier?" link above tier cards

- [ ] **Step 1: Add modal to pricing page**

Modify `dashboard/app/pricing/page.tsx`:

Find the pricing section and add before the tier cards:

```typescript
'use client';

import { useState } from 'react';
import { TierDiscoveryModal } from '@/components/TierDiscovery/TierDiscoveryModal';
import { useRouter } from 'next/navigation';

// ... existing imports and code

export default function PricingPage() {
  const [showTierModal, setShowTierModal] = useState(false);
  const router = useRouter();

  const handleTierSelect = (tier: string) => {
    setShowTierModal(false);
    router.push(`/auth/signup?tier=${tier}`);
  };

  return (
    <main className="bg-black min-h-screen">
      {/* ... existing pricing header ... */}

      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-6">Membership Tiers</h2>
          
          {/* Add this helper text */}
          <div className="text-center mb-12">
            <button
              onClick={() => setShowTierModal(true)}
              className="text-red-500 hover:text-red-400 text-sm font-medium underline"
            >
              Not sure which tier is right for you? Take our quick quiz.
            </button>
          </div>

          {/* ... existing tier cards ... */}
        </div>
      </section>

      {/* ... rest of pricing page ... */}

      <TierDiscoveryModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        onTierSelect={handleTierSelect}
      />
    </main>
  );
}
```

- [ ] **Step 2: Test on pricing page**

Manually test:
- Link is visible above tier cards
- Clicking opens modal
- Flow works end-to-end
- Closing modal returns to pricing page

- [ ] **Step 3: Commit**

```bash
git add dashboard/app/pricing/page.tsx
git commit -m "feat: add tier discovery link to pricing page"
```

---

### Task 7: Update Signup Form to Handle ?tier= Parameter

**Files:**
- Modify: `dashboard/app/auth/signup/page.tsx`

**Interfaces:**
- Consumes: `?tier=` query param
- Produces: Pre-selected membership tier radio button

- [ ] **Step 1: Update signup form to read and use tier param**

Modify `dashboard/app/auth/signup/page.tsx`:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// ... existing imports and code

export default function SignupPage() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier');
  
  // Pre-fill tier if provided
  const [selectedTier, setSelectedTier] = useState<string>(
    tierParam && ['starter', 'pro', 'vip'].includes(tierParam)
      ? tierParam
      : 'starter' // default to starter
  );

  // ... existing signup form code ...

  // Find the tier selection radio buttons and update:
  return (
    <div>
      {/* ... form header ... */}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Choose Your Plan
        </label>
        <div className="space-y-3">
          {/* Starter tier */}
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" 
            style={{
              borderColor: selectedTier === 'starter' ? '#ff1744' : '#e5e7eb',
              backgroundColor: selectedTier === 'starter' ? '#fff3f4' : '#ffffff'
            }}
          >
            <input
              type="radio"
              name="tier"
              value="starter"
              checked={selectedTier === 'starter'}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Starter - $99/month</div>
              <div className="text-sm text-gray-600">Beginner Fundamentals + community</div>
            </div>
          </label>

          {/* Pro tier */}
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer"
            style={{
              borderColor: selectedTier === 'pro' ? '#ff1744' : '#e5e7eb',
              backgroundColor: selectedTier === 'pro' ? '#fff3f4' : '#ffffff'
            }}
          >
            <input
              type="radio"
              name="tier"
              value="pro"
              checked={selectedTier === 'pro'}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Pro - $199/month</div>
              <div className="text-sm text-gray-600">Concealed Carry + 2 coaching sessions/month</div>
            </div>
          </label>

          {/* VIP tier */}
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer"
            style={{
              borderColor: selectedTier === 'vip' ? '#ff1744' : '#e5e7eb',
              backgroundColor: selectedTier === 'vip' ? '#fff3f4' : '#ffffff'
            }}
          >
            <input
              type="radio"
              name="tier"
              value="vip"
              checked={selectedTier === 'vip'}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">VIP - $399/month</div>
              <div className="text-sm text-gray-600">All courses + weekly coaching + 24/7 support</div>
            </div>
          </label>
        </div>
      </div>

      {/* ... rest of form ... */}
    </div>
  );
}
```

- [ ] **Step 2: Test signup with and without tier param**

Manually test:
- Navigate to `/auth/signup` (no param) — Starter should be pre-selected
- Navigate to `/auth/signup?tier=pro` — Pro should be pre-selected
- Navigate to `/auth/signup?tier=vip` — VIP should be pre-selected
- Navigate to `/auth/signup?tier=invalid` — Starter should be default
- Verify user can still change selection after pre-fill

- [ ] **Step 3: Commit**

```bash
git add dashboard/app/auth/signup/page.tsx
git commit -m "feat: add tier parameter pre-fill to signup form"
```

---

### Task 8: Mobile Responsiveness & Accessibility Testing

**Files:**
- No files created; testing & small tweaks to existing components

**Interfaces:**
- Tests: Mobile layout, keyboard navigation, screen reader behavior, touch targets

- [ ] **Step 1: Test on mobile devices (iPhone 12, iPad)**

Manual testing:
- Open modal on mobile; verify it's full-width with proper padding
- Verify text is readable (not too small)
- Verify buttons have 48px minimum touch targets
- Verify radio buttons are easy to tap
- Verify smooth scrolling if content exceeds viewport

If issues found, update QuestionScreen/RecommendationScreen styles to use:
```typescript
// Mobile-first responsive classes
<div className="w-full sm:w-96 max-h-[90vh] overflow-y-auto">
  {/* Content */}
</div>
```

- [ ] **Step 2: Test keyboard navigation**

Manual testing:
- Press Tab through all interactive elements
- Press Enter to select options
- Press Escape to close modal
- Verify focus states are visible (use outline or border)

If needed, add to QuestionScreen:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onClose]);
```

- [ ] **Step 3: Test screen reader**

Manual testing with VoiceOver (Mac) or TalkBack (Android):
- Verify modal title is announced
- Verify question text is read
- Verify radio options are announced with labels
- Verify button purposes are clear

Verify all inputs have proper labels:
```typescript
<label htmlFor="experience-beginner">
  <input id="experience-beginner" type="radio" ... />
  Beginner
</label>
```

- [ ] **Step 4: Commit accessibility fixes (if any)**

```bash
git add dashboard/components/TierDiscovery/
git commit -m "refactor: improve mobile responsiveness and accessibility"
```

---

### Task 9: Browser Testing & Final QA

**Files:**
- No files changed; comprehensive QA

**Interfaces:**
- Tests: Full end-to-end flow on multiple browsers

- [ ] **Step 1: Test full flow on desktop (Chrome, Safari)**

- [ ] **Step 2: Verify no console errors**

- [ ] **Step 3: Verify no TypeScript warnings**

Run:
```bash
cd dashboard && npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 4: Check component file structure**

Run:
```bash
ls -la dashboard/components/TierDiscovery/
```

Expected:
```
TierDiscoveryModal.tsx
QuestionScreen.tsx
RecommendationScreen.tsx
types.ts (optional, can be combined in TierDiscoveryModal.tsx)
```

- [ ] **Step 5: Verify all tests still pass**

```bash
cd dashboard && npm test -- __tests__/tierRecommendation.test.ts
```

Expected: All tests PASS

- [ ] **Step 6: Commit if any fixes were made**

```bash
git add .
git commit -m "test: final QA and browser testing complete"
```

---

### Task 10: Final Integration & Deployment Prep

**Files:**
- No code changes; final verification

**Interfaces:**
- Verifies: All integration points work, no regressions

- [ ] **Step 1: Verify homepage renders**

- [ ] **Step 2: Verify pricing page renders**

- [ ] **Step 3: Verify signup form renders**

- [ ] **Step 4: Full end-to-end test**

- Start at homepage
- Click "Find Your Tier"
- Answer all 3 questions
- Get recommendation
- Click "Start with [Tier]"
- Verify /auth/signup?tier=X loads with tier pre-selected
- Verify user can change tier selection
- Verify form submission still works

- [ ] **Step 5: Final commit & summary**

```bash
git status
```

Expected: Clean working tree (all changes committed)

Run:
```bash
git log --oneline -10
```

Expected: All tier-discovery commits visible

---

## Self-Review Checklist

✅ **Spec Coverage:**
- Scoring logic ✓ (Task 1)
- 3-question flow ✓ (Tasks 2-4)
- Homepage integration ✓ (Task 5)
- Pricing integration ✓ (Task 6)
- Signup pre-fill ✓ (Task 7)
- Mobile responsiveness ✓ (Task 8)
- Accessibility ✓ (Task 8)

✅ **No Placeholders:**
- All code is complete and concrete
- All test cases are fully written
- All steps have exact file paths and commands
- No "TBD" or "implement later"

✅ **Type Consistency:**
- Experience, TimeCommitment, Goal types consistent across all components
- Tier type consistent everywhere
- Component props match between parent and children

✅ **Scope Aligned with MVP:**
- No Phase 2 features (analytics, A/B testing, refinements)
- Simple rules-based scoring (no ML)
- Basic styling (no premium animations yet)

---

## Execution Notes

- Each task is independently testable
- Tasks build on each other but can be reviewed separately
- Frequent commits allow for easy rollback if needed
- Focus on clean, readable code over clever optimizations
- Mobile testing should happen during Task 8, not after deployment

---

**Estimated timeline:** 5-7 days (1 developer, 2-3 hours/day)

Plan complete and saved to `docs/superpowers/plans/2026-06-20-tier-discovery-modal.md`.

## Execution Options

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using superpowers:executing-plans, batch execution with checkpoints

**Which approach would you prefer?**