# UI Redesign Specification: Wise Defense Tactical-Premium Edition

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create implementation plan. Execute page-by-page redesign with consistent component system.

**Goal:** Transform the platform from generic blue design to a bold, tactical-tech premium visual identity reflecting the brand's professional firearms training expertise. Implement black + neon red + silver color system across all pages.

**Architecture:** Unified design system with component specifications, applied consistently across 7 pages (homepage, pricing, auth, dashboard, booking). Leverage existing Tailwind CSS infrastructure. Mobile-first responsive design. Zero new dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Lucide React icons

## Global Constraints

- **Primary Background:** `#0a0a0a` (Foundation Black) — all page backgrounds
- **Secondary Background:** `#1a1a1a` (Secondary Black) — cards, containers, sections
- **Primary Accent:** `#ff1744` (Neon Red) — CTAs, interactive states, emphasis
- **Secondary Accent:** `#cc0000` (Standard Red) — hover states, borders, secondary actions
- **Metallic Treatment:** `#c0c0c0` (Silver) — headings, logos, premium typography
- **Body Copy:** `#666666` (Neutral Gray) — secondary text, descriptions
- **Accent Secondary:** `#00d9ff` (Cyan) — optional tech HUD elements
- **High Contrast:** `#ffffff` (White) — CTA text, minimal application
- **Typography:** Bold/black for headings, regular for body, uppercase for CTAs
- **Spacing:** 8px grid system (p-4, p-6, p-8, etc.)
- **Border Radius:** Minimal (rounded-sm, 2-4px) for tactical sharpness
- **Hover/Focus Effects:** Neon glow `box-shadow: 0 0 20px rgba(255, 23, 68, 0.5)`, 200ms ease-in-out transitions
- **Mobile-First:** All designs responsive from 375px width upward
- **No New Dependencies:** Use existing Tailwind, React, Lucide-React only
- **Append-Only CSS:** Never remove/modify existing globals.css classes
- **Accessibility:** WCAG AA contrast ratios (4.5:1 minimum), 44px touch targets, full keyboard navigation

---

## Design System Specification

### 1. Color Palette & Chromatic System

| Name | Hex | Application | Opacity Variants |
|------|-----|-------------|-----------------|
| Foundation Black | `#0a0a0a` | Page backgrounds, text | — |
| Secondary Black | `#1a1a1a` | Cards, sections, containers | — |
| Neon Red | `#ff1744` | CTAs, borders, accents | 0.5 (glow), 0.7 (intense) |
| Standard Red | `#cc0000` | Hover states, secondary | — |
| Metallic Silver | `#c0c0c0` | Headings, logos, premium | — |
| Neutral Gray | `#666666` | Body text, secondary | 0.6 (muted), 0.8 (emphasis) |
| Accent Cyan | `#00d9ff` | Optional HUD elements | 0.4 (subtle) |
| Contrast White | `#ffffff` | High-contrast text | — |

### 2. Typography System

**Display (Hero Headings):**
- Font: Bold/Black weight
- Size: `text-6xl` (hero), `text-4xl` (section)
- Color: `#c0c0c0` (Metallic Silver)
- Letter-spacing: `0.05em`
- Line-height: `1.1`
- Accent: Red underline `border-b-2 border-red-600` below headings

**Body (Descriptive Copy):**
- Font: Regular weight
- Size: `text-base` (primary), `text-sm` (secondary)
- Color: `#666666` (Neutral Gray)
- Line-height: `1.6`
- Letter-spacing: `0.02em`

**Action (CTAs, Buttons):**
- Font: Bold weight, UPPERCASE
- Size: `text-sm`
- Color: `#ff1744` (Neon Red) or `#ffffff` (White)
- Letter-spacing: `0.1em`
- Glow effect on hover: `box-shadow: 0 0 20px rgba(255, 23, 68, 0.6)`

### 3. Component Library Specification

#### Primary Action Button
```
Background: #0a0a0a (Foundation Black)
Border: 2px solid #ff1744 (Neon Red)
Text: #ffffff (Contrast White), bold uppercase
Padding: py-4 px-8
Hover: box-shadow: 0 0 20px rgba(255, 23, 68, 0.6), transition 200ms ease-in-out
Focus: border-width: 3px, maintain glow
```

#### Secondary Action Button
```
Background: #ff1744 (Neon Red)
Text: #0a0a0a (Foundation Black), bold uppercase
Padding: py-4 px-8
Hover: Background → #cc0000 (Standard Red), maintain glow
Focus: Increase opacity, maintain border
```

#### Card Component
```
Background: #1a1a1a (Secondary Black)
Border: Left accent border-l-4 border-red-600
Padding: p-6
Hover: box-shadow: 0 0 15px rgba(255, 23, 68, 0.4), transition 200ms ease
Border-radius: rounded-sm (minimal)
```

#### Header/Navigation
```
Background: #0a0a0a (Foundation Black)
Border-bottom: border-b-1 border-gray-800
Logo: Metallic Silver (#c0c0c0)
Nav Links: #666666 (Neutral Gray) → #ff1744 (Neon Red) on hover
Positioning: sticky top-0 z-50
Spacing: py-4 px-6
```

#### Form Input
```
Background: #1a1a1a (Secondary Black)
Border: 2px solid #444444 (dark gray)
Text: #ffffff (Contrast White)
Placeholder: #666666 with opacity-60
Focus: Border → #ff1744 (Neon Red), glow: 0 0 20px rgba(255, 23, 68, 0.4)
```

#### Section Heading
```
Typography: text-3xl font-bold
Color: #0a0a0a (Foundation Black)
Accent: border-b-2 border-red-600 (Neon Red underline)
Margin-bottom: mb-12
```

### 4. Visual Effects & Interactions

**Neon Glow Effects:**
- Standard glow: `box-shadow: 0 0 20px rgba(255, 23, 68, 0.5)`
- Intense glow: `box-shadow: 0 0 20px rgba(255, 23, 68, 0.7)`
- Applied to: Buttons on hover, cards on hover, form inputs on focus
- Transition: All 200ms ease-in-out

**Border Treatments:**
- Left accent: `border-l-4 border-red-600` on cards (vertical emphasis)
- Bottom accent: `border-b-2 border-red-600` on headings (horizontal emphasis)
- Focus state: Increase border width or add glow

**Spacing & Geometry:**
- Grid system: 8px increments (p-4: 16px, p-6: 24px, p-8: 32px)
- Border radius: Minimal — `rounded-sm` (2-4px) for tactical sharpness
- Corner treatment: Sharp angles preferred over rounded for professional positioning

**Transitions & Animations:**
- Hover duration: 200ms ease-in-out
- Focus duration: 200ms ease-in-out
- Entrance animations: Fade-in with subtle scale (1.0 → 1.02) over 300ms
- Easing function: ease-in-out (avoid bouncing/playful effects)

---

## Page Architecture

### Homepage (/)

**Header:**
- Sticky navigation with logo (silver) and links (gray → red on hover)
- Navigation items: "Pricing", "Log In"

**Hero Section:**
- Full-width background: `#0a0a0a` with VR/action image overlay (70% opacity)
- Circular red accent frame around founder photo (brand badge aesthetic)
- Silver heading `text-6xl font-black` with red underline accent
- Two-button CTA cluster: primary (red-bordered) + secondary (red-filled)
- Mobile: Stack buttons vertically, responsive image

**Credentials Section (Why Choose Wise Defense):**
- Background: `#0a0a0a`
- Grid: 2-column layout (image + credentials on desktop, stacked on mobile)
- Left: Founder photograph full-width
- Right: 3 credential cards stacked
  - Each card: dark background, red left border, silver heading, gray description
  - Content: NRA Certified, Personalized Coaching, Results-Focused Training

**Testimonials Section:**
- Background: `#0a0a0a`
- Grid: 3-column card array
- Each card: secondary black background, italic gray text, name + tier attribution
- Hover: red glow effect

**Training Paths Section:**
- Background: `#0a0a0a`
- Grid: 3-column card layout
- Cards: dark background, red left border, hover glow
- Content: path name, description, duration/sessions
- Paths: Beginner Fundamentals, Concealed Carry, Competitive Shooting

**Final CTA Section:**
- Full-width background gradient: foundation black
- Centered messaging: silver heading with red underline
- Descriptive copy in neutral gray
- Single prominent CTA button with neon glow

### Pricing Page (/pricing)

**Header:** Consistent site navigation

**Page Heading:**
- Silver text `text-4xl font-black` with red underline
- Subheading: gray descriptive text

**Tier Cards:**
- Grid: 3-column layout (responsive to 1-column on mobile)
- Each card: secondary black background, red border treatment
- Card heading: silver, bold
- Price: neon red, large, prominent
- Features list: bullet points in neutral gray
- CTA button: primary action specification
- Selected state: red glow background intensity

**Comparison Table:**
- Full-width, responsive with horizontal scroll on mobile
- Header row: secondary black background with red accent border-top
- Feature rows: alternating subtle gray tint
- Cell content: center-aligned, neutral gray text
- Column headers: silver, bold

### Authentication Pages (/auth/signup, /auth/login)

**Layout:**
- Centered card on black background (max-width: 400px)
- Vertical centering on viewport

**Card Styling:**
- Background: secondary black
- Border: red accent (left or full border)
- Padding: p-8
- Border-radius: rounded-sm

**Form Heading:**
- Silver text, bold, centered
- Red underline accent
- Margin-bottom: mb-6

**Form Fields:**
- Background: secondary black
- Border: red on focus
- Glow: neon effect on focus state
- Placeholder: neutral gray with opacity

**Submit Button:**
- Primary action specification with neon glow
- Full-width or natural width depending on design

**Link Treatment:**
- "Don't have an account?" / "Already have an account?" link
- Color: neon red, hover: increased opacity + underline
- Cursor: pointer

### Dashboard (/dashboard)

**Header:** Consistent sticky navigation with user status

**Welcome Section:**
- Dark background with user greeting in silver
- Tier badge in red
- "Book a Session" button (primary action)

**Upcoming Sessions Section:**
- Grid or list layout
- Session cards: dark background, red left border, hover glow
- Content: date, time, type, status badge

**Progress Section:**
- Card component with red left border
- Heading: silver
- Progress bars: dark background with red fill
- Metrics: neutral gray text

**Quick Links:**
- List of navigation links in silver → red on hover
- Links: "View Drills", "Community Forum", "All Sessions"

### Booking Calendar Page (/booking)

**Header:** Consistent navigation

**Page Title:** Silver with red underline

**Date Picker:**
- Standard form input with red focus state

**Sessions List:**
- Dark cards with red left borders
- Content: time, type, availability status
- "Book" button: primary action with glow

**Booked Sessions Sidebar/Section:**
- Display count and list of booked sessions
- Dark cards with red accents

---

## Responsive Design Specifications

**Mobile-First Approach (375px minimum):**
- Single column layouts by default
- Cards stack vertically
- Hero: Full-width image, centered text
- Navigation: Simplified on mobile (menu icon optional)
- Buttons: Full-width on mobile
- Tables: Horizontal scroll or card view

**Breakpoints:**
- Mobile: 375px - 640px (sm)
- Tablet: 641px - 1024px (md)
- Desktop: 1025px+ (lg/xl)

**Touch Targets:** Minimum 44px × 44px for interactive elements

---

## Implementation Approach

### Phase 1: Color System & Globals
- Update `globals.css` with color variables (CSS custom properties)
- Define Tailwind color extensions in `tailwind.config.js`
- Apply foundation black to all page backgrounds

### Phase 2: Component Redesign
- Update existing components (buttons, cards, inputs, headers) with new color/effect specifications
- Ensure hover/focus states implement neon glow effects
- Test all interactive states across pages

### Phase 3: Page-by-Page Implementation
1. Homepage — hero, credentials, testimonials, training paths
2. Pricing — tier cards, comparison table
3. Authentication — signup/login forms
4. Dashboard — sections and cards
5. Booking — calendar and session management

### Phase 4: Testing & Polish
- Verify all pages render correctly on mobile (375px) and desktop (1440px)
- Test all interactive states: hover, focus, active
- Verify accessibility: contrast ratios, keyboard navigation
- Cross-browser verification

---

## Accessibility Compliance

- **Color Contrast:** All text meets WCAG AA minimum (4.5:1 for body, 3:1 for graphics)
- **Color Independence:** Red not sole differentiator; paired with text/icons/borders
- **Interactive Elements:** Minimum 44px touch targets, visible focus states with glow
- **Keyboard Navigation:** All pages fully navigable without mouse
- **Form Labels:** Associated with inputs, clear error messaging
- **Image Alt Text:** All images include descriptive alt text

---

## Design Principles Applied

**Consistency:** Unified visual language via component system and color palette  
**Hierarchy:** Typographic and spatial emphasis guide user attention  
**Restraint:** Neon effects deployed strategically, not excessively  
**Precision:** Sharp geometric forms reinforce tactical-professional positioning  
**Legibility:** High contrast maintains readability on all screen sizes  
**Premium:** Metallic silver and neon red establish luxury positioning  

---

## Success Metrics

✅ All pages implement black + red + silver color system  
✅ Neon glow effects present on interactive elements  
✅ Typography hierarchy clear and professional  
✅ Mobile responsiveness verified (375px minimum)  
✅ All hover/focus states include visual feedback  
✅ Accessibility standards met (WCAG AA)  
✅ Zero new dependencies introduced  
