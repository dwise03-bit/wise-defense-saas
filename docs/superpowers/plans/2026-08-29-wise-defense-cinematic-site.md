# WISE Defense Cinematic Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved cinematic WISE Defense public website for wisedefensellc.com without exposing the existing command-center controls.

**Architecture:** Keep the public marketing surface isolated from the existing operations UI. First identify the actual production routing target, then implement reusable public-site sections and preserve the current dashboard behind a protected/internal route or separate deployment. Do not change DNS or reverse-proxy routing until the target service is verified.

**Tech Stack:** Existing Next.js App Router application in `dashboard-v2`, React, TypeScript, Tailwind/CSS, existing Docker/deployment stack.

**Spec:** `docs/superpowers/specs/2026-08-29-wise-defense-cinematic-site-design.md`

## Global Constraints
- Palette: black, charcoal, gunmetal, metallic silver, controlled deep red.
- Copy anchors: `QUEENSBRIDGE. STILL STANDING.` and `TRAIN. TEACH. PROTECT.`
- Daniel's supplied real photography must not be AI-altered.
- Public pages must never expose restart/deploy controls, logs, container names, internal service health, or admin credentials.
- Respect `prefers-reduced-motion`.
- Responsive targets: 390px, 430px, 768px, 1024px, 1440px.
- Verify production routing before DNS/proxy changes.

---

### Task 1: Protect the Operations Surface

**Files:**
- Move/refactor: `dashboard-v2/app/page.tsx`
- Create: `dashboard-v2/app/command-center/page.tsx`
- Create: `dashboard-v2/app/command-center/CommandCenter.tsx`
- Test: `dashboard-v2/app/__tests__/public-boundary.test.tsx`

**Interfaces:**
- Consumes: existing `/api/status`, `/api/containers`, `/api/logs`, `/api/chat`, restart and deploy endpoints.
- Produces: `/command-center` operations route and a clean `/` public route boundary.

- [ ] **Step 1: Write the failing boundary test**

```tsx
import { render, screen } from '@testing-library/react';
import Home from '../page';

test('public homepage does not expose operations controls', () => {
  render(<Home />);
  expect(screen.queryByText(/Restart API/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Live Logs/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Containers/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `cd dashboard-v2 && npm test -- public-boundary.test.tsx`
Expected: FAIL because the current homepage exposes operations controls.

- [ ] **Step 3: Extract the current operations UI**

Move the current `Home` behavior into `app/command-center/CommandCenter.tsx` and render it from `app/command-center/page.tsx`. Remove the hard-coded `WiseDefenseSecure2026` client-side key; privileged actions must obtain authorization server-side or remain disabled until an authenticated mechanism exists.

- [ ] **Step 4: Replace `/` with a minimal public placeholder**

```tsx
export default function Home() {
  return <main data-testid="wise-defense-public-home" />;
}
```

- [ ] **Step 5: Run the boundary test and full lint/build**

Run: `cd dashboard-v2 && npm test -- public-boundary.test.tsx && npm run lint && npm run build`
Expected: PASS with no public operations controls.

- [ ] **Step 6: Commit**

```bash
git add dashboard-v2/app
 git commit -m "security: isolate command center from public homepage"
```

### Task 2: Build the WISE Defense Design System and Navigation

**Files:**
- Modify: `dashboard-v2/app/globals.css`
- Create: `dashboard-v2/app/(marketing)/components/SiteNav.tsx`
- Create: `dashboard-v2/app/(marketing)/components/Section.tsx`
- Test: `dashboard-v2/app/__tests__/site-nav.test.tsx`

**Interfaces:**
- Produces: shared CSS variables, `.wd-shell`, `.wd-button-primary`, `.wd-button-secondary`, `SiteNav`, `Section`.

- [ ] **Step 1: Write failing navigation test**

```tsx
import { render, screen } from '@testing-library/react';
import SiteNav from '../(marketing)/components/SiteNav';

test('navigation exposes the primary booking action', () => {
  render(<SiteNav />);
  expect(screen.getByRole('link', { name: /Book Training/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED**
Run: `cd dashboard-v2 && npm test -- site-nav.test.tsx`
Expected: FAIL because `SiteNav` does not exist.

- [ ] **Step 3: Add exact theme tokens**

```css
:root {
  --wd-black: #070707;
  --wd-surface: #121214;
  --wd-gunmetal: #24262a;
  --wd-white: #f4f4f2;
  --wd-silver: #a7a9ac;
  --wd-metal: #d6d7d9;
  --wd-red: #8e1118;
  --wd-red-active: #b61922;
}
```

Add responsive shell sizing, accessible focus rings, button styles and a reduced-motion media query that disables nonessential transitions/animations.

- [ ] **Step 4: Implement `SiteNav`**
Include WISE DEFENSE wordmark treatment, links to Training, Mission and Contact, and `/book` or `#book` primary CTA. Mobile navigation must use a real button with `aria-expanded`.

- [ ] **Step 5: Verify GREEN and build**
Run: `cd dashboard-v2 && npm test -- site-nav.test.tsx && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add dashboard-v2/app
 git commit -m "feat: add Wise Defense marketing design system"
```

### Task 3: Build the Cinematic Hero

**Files:**
- Create: `dashboard-v2/app/(marketing)/components/Hero.tsx`
- Create: `dashboard-v2/app/(marketing)/components/HeroMedia.tsx`
- Add supplied assets under: `dashboard-v2/public/wise-defense/hero/`
- Test: `dashboard-v2/app/__tests__/hero.test.tsx`

**Interfaces:**
- Produces: `Hero` with `BOOK TRAINING` and `VIEW COURSES` links.

- [ ] **Step 1: Write failing hero test**

```tsx
import { render, screen } from '@testing-library/react';
import Hero from '../(marketing)/components/Hero';

test('hero renders locked WISE Defense messaging', () => {
  render(<Hero />);
  expect(screen.getByText('QUEENSBRIDGE. STILL STANDING.')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'TRAIN. TEACH. PROTECT.' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'BOOK TRAINING' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'VIEW COURSES' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED**
Run: `cd dashboard-v2 && npm test -- hero.test.tsx`
Expected: FAIL because `Hero` does not exist.

- [ ] **Step 3: Add approved real assets**
Only use user-supplied Daniel photography. If the repository does not contain an approved photo, use an environmental Queensbridge background and a clearly named asset slot; do not synthesize Daniel.

- [ ] **Step 4: Implement hero layout**
Use `next/image` with explicit dimensions/sizes, a dark left-side readability gradient, responsive focal positioning and no text baked into the image. Keep CTA targets visible at 390px width.

- [ ] **Step 5: Verify GREEN plus responsive smoke test**
Run: `cd dashboard-v2 && npm test -- hero.test.tsx && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add dashboard-v2/app dashboard-v2/public/wise-defense
 git commit -m "feat: add cinematic Wise Defense hero"
```

### Task 4: Build Homepage Story and Conversion Sections

**Files:**
- Create: `dashboard-v2/app/(marketing)/components/CredibilityStrip.tsx`
- Create: `dashboard-v2/app/(marketing)/components/ServicePillars.tsx`
- Create: `dashboard-v2/app/(marketing)/components/Mission.tsx`
- Create: `dashboard-v2/app/(marketing)/components/TrainingGrid.tsx`
- Create: `dashboard-v2/app/(marketing)/components/StatsBand.tsx`
- Create: `dashboard-v2/app/(marketing)/components/BookingCTA.tsx`
- Create: `dashboard-v2/app/(marketing)/components/SiteFooter.tsx`
- Modify: `dashboard-v2/app/page.tsx`
- Test: `dashboard-v2/app/__tests__/home-content.test.tsx`

**Interfaces:**
- Consumes: `SiteNav`, `Hero`, shared design tokens.
- Produces: complete public homepage.

- [ ] **Step 1: Write failing content test**

```tsx
import { render, screen } from '@testing-library/react';
import Home from '../page';

test('homepage presents all three WISE Defense pillars and booking CTA', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /^Train$/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Teach$/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Protect$/i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Book Training/i }).length).toBeGreaterThan(1);
});
```

- [ ] **Step 2: Verify RED**
Run: `cd dashboard-v2 && npm test -- home-content.test.tsx`
Expected: FAIL until sections exist.

- [ ] **Step 3: Implement sections**
Keep copy concise and outcomes-focused. Avoid unsupported numerical claims. Use the Train/Teach/Protect pillars, mission story, featured training cards, a stats/credibility treatment using only verified facts, and a final high-intent booking section.

- [ ] **Step 4: Compose `app/page.tsx`**
Order: `SiteNav`, `Hero`, `CredibilityStrip`, `ServicePillars`, `Mission`, `TrainingGrid`, `StatsBand`, `BookingCTA`, `SiteFooter`.

- [ ] **Step 5: Verify GREEN and build**
Run: `cd dashboard-v2 && npm test -- home-content.test.tsx && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add dashboard-v2/app
 git commit -m "feat: complete Wise Defense public homepage"
```

### Task 5: Accessibility, Metadata and Performance Pass

**Files:**
- Modify: `dashboard-v2/app/layout.tsx`
- Modify: marketing components as findings require
- Test: `dashboard-v2/app/__tests__/accessibility.test.tsx`

**Interfaces:**
- Produces: production metadata, accessible landmarks and motion behavior.

- [ ] **Step 1: Add failing metadata/accessibility assertions**
Assert one `main` landmark, logical heading order, descriptive CTA labels, and no empty image alt where an image conveys content.

- [ ] **Step 2: Verify RED**
Run the focused test and confirm failures represent missing requirements.

- [ ] **Step 3: Implement metadata**
Set title to `WISE Defense | Train. Teach. Protect.` and a concise service description. Add canonical URL only after the production host is verified.

- [ ] **Step 4: Validate responsive behavior**
Manually inspect 390x844, 430x932, 768x1024, 1024x768 and 1440x900. Confirm no horizontal overflow, CTA clipping or subject/text collision.

- [ ] **Step 5: Run quality gate**
Run: `cd dashboard-v2 && npm test && npm run lint && npm run build`
Expected: all available tests, lint and build pass with no new warnings.

- [ ] **Step 6: Commit**
```bash
git add dashboard-v2
 git commit -m "chore: polish Wise Defense marketing experience"
```

### Task 6: Verify Production Routing and Deploy Safely

**Files:**
- Inspect before modifying: `.github/workflows/deploy.yml`, Docker compose files, Traefik labels/config and server deployment documentation.
- Modify only the verified deployment configuration.

**Interfaces:**
- Consumes: passing production build from Tasks 1-5.
- Produces: wisedefensellc.com serving the public marketing site while internal operations remain protected.

- [ ] **Step 1: Resolve domain routing**
On the production host run `docker ps`, inspect active Traefik routers, and identify which service currently answers `Host(\`wisedefensellc.com\`)`. Do not assume `dashboard-v2` is the target.

- [ ] **Step 2: Capture rollback point**
Record the currently deployed image/tag or git SHA and confirm the rollback command before deployment.

- [ ] **Step 3: Deploy the verified target only**
Use the repository's existing deployment mechanism. Do not alter unrelated WISE2 services.

- [ ] **Step 4: Smoke test externally**
Run `curl -I https://wisedefensellc.com` and verify HTTP 200/expected redirect, TLS validity, hero text, navigation and booking CTA in a browser.

- [ ] **Step 5: Verify internal isolation**
Confirm the public host cannot reach command-center controls without the intended protection. Confirm no admin key is present in client JavaScript.

- [ ] **Step 6: Roll back on failure or commit deployment config**
If smoke tests fail, immediately restore the captured deployment version. If successful and config changed, commit only the verified routing/deployment changes.
