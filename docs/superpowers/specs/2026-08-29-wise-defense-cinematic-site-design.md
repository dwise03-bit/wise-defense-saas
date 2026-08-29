# WISE Defense Cinematic Website Design

## Goal
Transform wisedefensellc.com into a premium, conversion-focused WISE Defense public website while preserving the existing WISE2 operations dashboard as an internal product rather than exposing it as the marketing homepage.

## Locked Brand Direction
- WISE Defense palette: black, charcoal, gunmetal, metallic silver, controlled deep red.
- Primary line: TRAIN. TEACH. PROTECT.
- Hero eyebrow: QUEENSBRIDGE. STILL STANDING.
- Cinematic urban atmosphere: Queensbridge bridge, subway/train, wet pavement, restrained haze and tactical lighting.
- Daniel's supplied real photography must be used when available. Do not regenerate, reinterpret, reshape, retouch, or AI-alter his face, body, clothing, pose, or expression.
- Premium security/training presentation. Avoid gamer UI, neon cyberpunk treatment, generic SaaS gradients, stock tactical clichés, or excessive animation.

## Information Architecture
Public homepage flow:
1. Compact transparent/sticky navigation with WISE DEFENSE identity and Book Training CTA.
2. Full-viewport cinematic hero with left-aligned messaging and Daniel/environment imagery on the right/background.
3. Credibility strip communicating training, education, preparedness and professional standards.
4. Three primary service pillars: Train, Teach, Protect.
5. Mission/story section anchored by Daniel and Queensbridge roots.
6. Featured training/course cards with clear outcomes and CTAs.
7. Results/statistics band.
8. Quote/leadership statement.
9. High-intent booking CTA.
10. Contact/footer with clear navigation and legal/company identity.

## Hero
Copy hierarchy:
- Eyebrow: QUEENSBRIDGE. STILL STANDING.
- Headline: TRAIN. TEACH. PROTECT.
- Supporting copy: practical training and education focused on awareness, preparedness, confidence and responsible protection.
- Primary CTA: BOOK TRAINING
- Secondary CTA: VIEW COURSES

Desktop composition reserves the left 40-48% for copy. Photography/environment occupies the remaining canvas. Mobile uses a separate crop strategy so the subject never sits behind critical text.

## Visual System
- Background #070707 / #0B0B0C
- Raised surface #121214
- Gunmetal #24262A
- Primary text #F4F4F2
- Muted silver #A7A9AC
- Metallic highlight #D6D7D9
- Deep tactical red #8E1118
- Active red #B61922
- Thin borders use white at 8-14% opacity.
- Corners stay restrained (4-12px), not bubbly SaaS cards.
- Typography: condensed/strong display face where available, clean sans-serif body; uppercase labels with generous tracking.

## Motion
Use motion sparingly: hero atmospheric drift, subtle metallic highlight, short red underline/edge transitions, and gentle reveal on section entry. Respect prefers-reduced-motion. No looping interface gimmicks.

## Mobile
Design mobile independently rather than shrinking desktop. Keep headline, primary CTA and subject readable above the fold on modern iPhone widths. Navigation collapses cleanly. Cards become a single readable column with 44px+ touch targets.

## Conversion
Book Training is the primary site action and remains easy to reach from navigation, hero and final CTA. View Courses is secondary. Do not bury contact behind an internal dashboard flow.

## Existing Application Boundary
The current dashboard-v2 homepage is an authenticated/operations-style command center with status polling, container visibility, Hermes chat, restart/deploy controls and logs. The public marketing experience must not expose those controls. Preserve internal operations capability on a separate protected route or deployment target during implementation.

## Quality Gates
- No exposed admin key or restart/deploy controls on public pages.
- Responsive at 390px, 430px, 768px, 1024px, 1440px.
- Keyboard navigable and visible focus states.
- prefers-reduced-motion honored.
- Lighthouse-oriented image sizing and lazy loading below fold.
- No layout shift from hero media.
- Production build and lint pass before deployment.
- Verify domain routing separately before changing DNS/proxy configuration.
