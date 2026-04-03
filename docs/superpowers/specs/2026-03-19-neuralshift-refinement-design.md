# NeuralShift AI — Site Refinement & AI Audit Enhancement Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Scope:** UI transformation, scroll performance, mobile responsiveness, AI audit wizard enhancement, session context + PRD documents

---

## 1. Context & Problem Statement

NeuralShift AI is an Australian AI consultancy targeting SMBs. The current website (Next.js 15, Tailwind CSS, deployed on Cloudflare Pages) has several issues:

1. **Scroll performance is poor** — sluggish, laggy scrolling caused by dual scroll systems (Lenis + GSAP ScrollTrigger), GPU-heavy animations (particles, backdrop-filter, gradient shifts), and too many concurrent CSS animations.
2. **The UI feels heavy and intimidating** — dark glass-morphism with particle backgrounds, gradient text, neural-pulse animations. This aesthetic may impress developers but alienates the target audience: non-technical AU SMB owners.
3. **Mobile experience is suboptimal** — cramped stats grid, tall vertical timeline consuming excessive scroll space, competing animations on limited hardware.
4. **The AI audit is superficial** — only asks for business type + industry, returns 3 generic opportunities. No AU-specific context, no adaptive questioning, no ROI quantification.

**Target audience:** Australian SMBs (1-200 employees), primarily small businesses (1-50 staff). The site must feel approachable, trustworthy, and intelligent — not intimidating.

---

## 2. Design Decisions

### 2.1 UI Direction: Modern Minimal

**Decision:** Transform from dark glass-morphism to light, editorial, typography-led design (Stripe/Linear/Vercel aesthetic).

**Design principles:**
- **Typography-led** — Syne for bold headlines, Inter for body. Type does the heavy lifting. No gradient text, no glow effects.
- **Whitespace as design** — Generous padding, clear section breaks. Content density goes down, comprehension goes up.
- **Subtle motion only** — No particles, no floating, no neural-pulse. Micro-interactions: hover lifts, smooth fades on scroll entry, button state transitions.
- **Strategic color** — Warm off-white base (#FAFAF9). Indigo (#6366F1) as primary accent. Cyan (#06B6D4) as secondary. Dark sections reserved for hero + CTAs only.

**Color palette:**
- Base: `#FAFAF9` (warm off-white)
- Text primary: `#0F0F0F`
- Text secondary: `#666666`
- Text muted: `#737373` (WCAG AA compliant — 4.85:1 on #FAFAF9)
- Accent primary: `#6366F1` (indigo)
- Accent secondary: `#06B6D4` (cyan)
- Border: `#E5E5E5`
- Card background: `#FFFFFF`
- Dark sections: `#0F0F0F`

**What gets removed:**
- Particle background (tsParticles) — entire library
- Glass morphism cards (backdrop-filter blur)
- Custom cursor (dot + ring)
- Vanilla Tilt 3D card effects
- Gradient text fills
- Neural-pulse, float, shimmer, gradient-shift animations
- Loading screen (1.3s delay before interaction)
- GSAP + ScrollTrigger (dual scroll system)
- Theme switcher (cosmos/mono/plasma — consolidate to single modern theme)

**What stays / gets added:**
- Lenis smooth scroll (simplified config)
- CSS-only scroll-driven fade-in animations via Intersection Observer
- Hover micro-interactions (shadow lifts, color shifts)
- Animated counters (on scroll into view, runs once)
- TypeAnimation in hero — remove the pill/badge container, render as plain subtitle text below the headline. This reverses a prior mobile fix (pill was added to prevent overflow), but is safe now because the new layout uses smaller font sizing and no gradient fills that caused the original overflow issue.
- Clean card components (solid background, subtle shadow, no blur)
- Accent color left-borders for visual hierarchy
- Dark hero section + dark CTA sections for contrast rhythm

### 2.2 Scroll & Performance

**Root cause analysis:**
1. Lenis smooth scroll + GSAP ScrollTrigger both manipulate scroll position → conflict
2. 40 particles at 40 FPS + backdrop-filter blur + gradient animations → GPU overload
3. FAQ accordions use `max-height` transitions → layout reflow every frame
4. 8+ CSS keyframe animations running concurrently
5. Custom cursor RAF loop runs every frame even when idle

**Solutions:**

| Problem | Solution |
|---------|----------|
| Lenis + GSAP conflict | Remove GSAP + ScrollTrigger entirely. Keep Lenis only. |
| Particle background | Remove entirely (tsParticles library removed). |
| Custom cursor | Remove entirely. |
| Loading screen | Remove. Instant first meaningful paint. |
| Vanilla Tilt | Remove. Cards use shadow + hover lift. |
| backdrop-filter blur | Remove. Cards use solid backgrounds. |
| FAQ max-height transition | `grid-template-rows: 0fr → 1fr` (compositor-only). |
| Excessive CSS animations | Remove all except `fade-in-up`. Single animation for scroll entry. |
| Marquee (partner logos) | Keep, CSS-only with `will-change: transform`. |
| CountUp | Keep — lightweight, runs once per page load. |
| TypeAnimation | Keep in hero — single focused animation. |

**Lenis config:**
```
duration: 1.0
easing: easeOutQuart
wheelMultiplier: 1.0
touchMultiplier: 1.5
```

**Bundle reduction:** ~80KB removed (tsparticles ~45KB, gsap+ScrollTrigger ~30KB, vanilla-tilt ~5KB).

**Scroll reveal approach:**
- Single `SectionReveal` component using Intersection Observer
- `threshold: 0.1` (triggers early)
- Animation: `opacity: 0 → 1` + `translateY(20px) → 0` (compositor-only)
- `prefers-reduced-motion` media query disables all animations
- No staggered delays — each section fades independently

### 2.3 Mobile Responsiveness

**Breakpoints:** 640px (mobile), 768px (tablet), 1024px (desktop). Test at 320px, 375px, 414px.

**Section-by-section changes:**

**Hero (mobile):**
- No particles, clean solid dark background
- Headline: `clamp(28px, 7vw, 56px)`
- TypeAnimation rendered as plain subtitle text below headline (pill container removed — safe because new font sizing prevents the overflow that originally required the pill)
- Full-width stacked CTAs (primary + secondary)
- Scroll indicator removed on mobile
- Padding: 48px top (from 64px)

**Stats bar (mobile):**
- Horizontal scrollable pills (native swipe) replacing 2x2 grid
- Each stat: compact pill with number + label
- Swipe hint indicator

**Service cards (mobile):**
- Single column, reduced padding (16px from 24px)
- Tighter line heights, shadow-based (no blur)

**Process timeline (mobile):**
- Horizontal stepper (1 → 2 → 3 → 4) with connected dots
- 2x2 compact card grid below stepper
- Saves ~60% vertical space vs current vertical timeline

**AI Audit wizard (mobile):**
- Full-width step cards
- Min 48px touch targets
- Industry selection as 2-column grid
- Progress bar at top
- Continue button full-width, Back button below as text link

**Audit report (mobile):**
- ROI metrics in 2-column grid (not 3)
- Roadmap stacks vertically
- Full-width CTA at bottom

**Navigation (mobile):**
- Drawer slides from right (keep existing pattern)
- Smoother spring transition
- Backdrop overlay

**Global mobile:**
- Section padding: 48px vertical (from 64px)
- Container padding: 20px horizontal (from 24px)
- Remove all hover-dependent interactions
- Tap states with 150ms active feedback
- `font-display: swap` to prevent FOIT
- `prefers-reduced-motion` respected

### 2.4 AI Audit Enhancement

**Current state:** 2 fields (businessType + industry) → 3 generic opportunities from Groq LLM (llama-3.3-70b) with mock fallback.

**New state:** Adaptive step-by-step wizard → AU-contextualized AI uplift report with ROI focus.

#### Question Flow

**Base questions (always asked):**

1. **Industry** — Retail, Healthcare, Construction, Legal, Finance, Professional Services (card selection, 2-column grid)
2. **Business description** — Short free-text (1-2 sentences, with placeholder example)
3. **State / Region** — NSW, VIC, QLD, WA, SA, TAS, NT, ACT + Metro vs Regional toggle
4. **Team size** — 1-5, 6-20, 21-50, 51-200, 200+

**Adaptive questions (2-3 based on industry + team size):**

5. **Biggest operational pain point** — Multi-select: Manual data entry, Customer follow-up, Compliance/reporting, Scheduling, Inventory, Invoicing, Other
6. **Current tech maturity** — Single select spectrum: Mostly paper/spreadsheets → Some cloud tools → Integrated systems → Already using some AI
7. **Revenue impact goal** — Single select: Reduce costs, Increase revenue, Improve customer experience, Scale without hiring, Compliance risk reduction

**Industry-specific conditional questions (1 of these, based on Q1):**
- Healthcare: "Patient volume per week?" (ranges)
- Retail: "Online vs in-store revenue split?" (ranges)
- Construction: "Active projects at any time?" (ranges)
- Legal: "Primary practice area?" (dropdown)
- Finance: "Client base size?" (ranges)
- Professional Services: "Billable hours model?" (yes/no)

**Branching logic:** Industry + team size determine which 2-3 adaptive questions appear. Small teams (1-5) skip tech maturity (assumed low). Larger teams get all three adaptive questions.

#### Wizard UX

- Step-by-step, one question per screen
- Progress bar at top (gradient: indigo → cyan)
- Step counter ("Step 2 of 6")
- Clean card-based selections for multiple choice
- Free-text fields have placeholder examples
- Continue button (primary), Back button (text link below)
- Smooth slide transition between steps (CSS transform, not JS)
- No skip — all base questions required, adaptive questions required when shown

#### Report Output

**Structure:**
1. **Header** — "Your AI Uplift Report" + business context summary (industry, state, team size)
2. **3 AI-driven uplift opportunities** — each with:
   - Title (4-8 words)
   - "YOUR ROLE" callout — what the business owner does (not just "AI handles X")
   - Description contextualized to AU market, state regulations, competitive landscape
   - Impact badge (High/Medium)
   - ROI metrics (2-column on mobile, 3-column on desktop):
     - Estimated annual savings/revenue (scaled to team size)
     - Time freed or efficiency gain
     - Implementation timeframe
3. **30/60/90 day AI roadmap** — prioritized implementation sequence
4. **CTA** — "Book Your Deep-Dive Session" with "30-minute strategy call, no obligation"

**ROI calibration by team size (critical):**

| Team Size | Typical Opportunity Value | Language Register |
|-----------|--------------------------|-------------------|
| 1-5 | $2K-$8K/yr | "Free up your evenings," "stop chasing invoices" |
| 6-20 | $8K-$25K/yr | "Reclaim a full day per week for your team" |
| 21-50 | $25K-$60K/yr | "Reduce operational overhead significantly" |
| 51-200 | $60K-$150K/yr | "Enterprise-grade automation at SMB pace" |
| 200+ | $150K+ | "Scale operations without proportional headcount" |

**AU-specific context baked into LLM system prompt:**
- State-specific regulations (SafeWork QLD, WorkSafe VIC, AHPRA, Fair Work, ATO)
- AU tool ecosystem (Xero, MYOB, Cliniko, ServiceM8, Square AU, Deputy)
- Australian labor costs for ROI calculations (~$30-$45/hr for admin, $60-$100/hr for professional)
- Regional market dynamics (metro vs regional, state-specific industry concentration)
- Competitive positioning ("Most AU [industry] SMBs your size are still doing X manually")

**Mock fallback:** Updated mock responses for each industry, calibrated to small AU businesses. Used when GROQ_API_KEY is not set.

#### Wizard Error & Edge Cases

- **API failure after completing all steps:** Show error message with "Try Again" button. All wizard state is preserved in React state — user does NOT have to re-answer questions. Error message: "We couldn't generate your report right now. Your answers are saved — try again or contact us directly."
- **Per-step validation:** Inline validation below the input/selection. User cannot advance to next step until current step is valid. Industry and team size require a selection. Business description requires at least 10 characters, max 500 characters. State requires selection.
- **Loading state during report generation:** Clean loading screen with indigo spinner, step-by-step progress text ("Analysing your industry...", "Mapping AU market context...", "Generating opportunities..."). Light theme, consistent with the rest of the site.
- **Free-text input constraints:** Business description: min 10 chars, max 500 chars. Character counter shown below field.
- **Rate limiting:** Client-side: disable submit button for 5 seconds after submission. Server-side: existing edge runtime limits apply.
- **State persistence:** Wizard state lives in React useState only — no localStorage persistence. If user navigates away, wizard resets. This is intentional — the audit is meant to be a quick interaction, not a saved document.
- **Keyboard navigation:** Tab through options, Enter to select, Escape to go back. Focus moves to the heading of each new step on transition. Progress bar has `aria-valuenow` and `aria-valuemax`. Step transitions announced via `aria-live="polite"` region.

#### API Changes

- Endpoint stays at `/api/ai-demo`
- Request payload expands: `{ industry, businessDescription, state, region, teamSize, painPoints[], techMaturity, revenueGoal, industrySpecific }`
- System prompt rewritten with AU market context, team-size-aware ROI scaling, and "YOUR ROLE" framing
- Mock responses updated for all industries with realistic small-AU-business figures

**Response TypeScript interface:**

```typescript
interface Opportunity {
  title: string;           // 4-8 words
  yourRole: string;        // What the business owner does, e.g. "Define intake criteria & approval workflow"
  description: string;     // 2-3 sentences, AU-contextualized
  impact: 'High' | 'Medium';
  savings: string;         // Scaled to team size, e.g. "$3,000-$8,000/yr"
  timeSaved: string;       // e.g. "5-8 hrs/wk"
  implementationTimeframe: string; // e.g. "1-2 weeks"
}

interface RoadmapStep {
  phase: '1-30' | '31-60' | '61-90';
  title: string;
  description: string;
}

interface AuditResponse {
  opportunities: Opportunity[];  // exactly 3
  roadmap: RoadmapStep[];        // exactly 3
  context: {
    industry: string;
    state: string;
    teamSize: string;
    businessDescription: string;
  };
  source: 'ai' | 'mock';
}
```

---

## 3. Documents to Create

### 3.1 Session Context Document

**Purpose:** Internal strategy document capturing the "why" behind every design decision. Living document for team alignment.

**Location:** `docs/session-context.md`

**Contents:**
- Project overview and vision
- Target audience definition (AU SMBs, primarily small businesses)
- Market positioning (AU-focused, deep local intelligence)
- Key design decisions and rationale (UI direction, audit strategy, performance approach)
- Competitive differentiation (AI audit as conversion tool, AU-specific context)
- Technical decisions and trade-offs
- Future considerations (regional expansion, CMS integration)

### 3.2 PRD (Product Requirements Document)

**Purpose:** Development blueprint — the "what" and "how" source of truth for building.

**Location:** `docs/prd.md`

**Contents:**
- Product overview and objectives
- User personas (AU SMB owner, AU medium business decision maker)
- Feature requirements (UI, performance, audit wizard, report)
- Technical requirements (stack, performance targets, accessibility)
- Information architecture
- Success metrics
- Out of scope (for this phase)
- Dependencies and risks

---

## 4. Architecture

### Component Changes

**Remove:**
- `components/ui/ParticleBackground.tsx` — delete
- `components/ui/CustomCursor.tsx` — delete (also remove import + usage from `app/layout.tsx`)
- `components/ui/LoadingScreen.tsx` — delete
- `components/ui/GlassCard.tsx` — rewrite as `Card.tsx` (solid background, shadow)
- `components/ui/GlowButton.tsx` — rewrite as clean `Button.tsx` (solid indigo fill, no glow/gradient border, shadow hover state, consistent with light theme)
- `components/ui/ThemeSwitcher.tsx` — delete (also remove from Navbar where it is rendered)

**Modify:**
- `components/providers/LenisProvider.tsx` — remove GSAP ScrollTrigger integration, simplify config
- `components/ui/SectionReveal.tsx` — simplify to pure Intersection Observer + CSS
- `components/home/Hero.tsx` — remove particles, simplify to dark section with clean typography
- `components/home/StatsBar.tsx` — horizontal scroll on mobile
- `components/home/ProcessSection.tsx` — horizontal stepper on mobile
- `components/home/AIDemoWidget.tsx` — full rewrite as adaptive wizard
- `components/home/ServicesOverview.tsx` — light theme cards
- `components/home/CaseStudiesTeaser.tsx` — light theme cards
- `components/home/SocialProof.tsx` — simplified marquee
- `components/home/CTABanner.tsx` — dark section, clean CTA
- `components/home/ProblemSection.tsx` — light theme
- `components/layout/Navbar.tsx` — light theme, refined mobile drawer, remove ThemeSwitcher import and rendering
- `components/layout/Footer.tsx` — light or dark, refined
- `app/globals.css` — complete rewrite of design tokens and animations. Key removals: `cursor: none` on body, all `[data-theme="mono"]` and `[data-theme="plasma"]` blocks, `.faq-answer` max-height transition (replace with `grid-template-rows`), all glow/neural-pulse/shimmer keyframes. FAQ accordion CSS uses `grid-template-rows: 0fr → 1fr` for compositor-only transitions.
- `app/layout.tsx` — remove CustomCursor import/component, LoadingScreen import/component, simplify. Keep JetBrains Mono font (used for monospace labels on stats, step counters, and technical accents — lightweight and adds visual distinction)
- `app/api/ai-demo/route.ts` — expanded payload, AU-contextualized system prompt

**New:**
- `components/ui/Card.tsx` — clean card component (shadow, hover lift)
- `components/audit/AuditWizard.tsx` — step-by-step wizard container
- `components/audit/AuditStep.tsx` — individual wizard step
- `components/audit/AuditReport.tsx` — report display component
- `components/audit/questions.ts` — question definitions and branching logic

**All other pages** (`/about`, `/services`, `/case-studies`, `/contact`, `/resources`) get the light theme applied via globals.css changes + component-level updates. Structure stays the same.

### Data Flow — Audit Wizard

```
User starts wizard
  → Step 1-4: Base questions (client-side state)
  → Branching logic determines adaptive questions (client-side)
  → Step 5-7: Adaptive questions (client-side state)
  → Submit: POST /api/ai-demo with full payload
  → API: Groq LLM with AU-contextualized system prompt
  → API: Returns 3 opportunities + roadmap (or mock fallback)
  → Client: Renders report with staggered fade-in
  → CTA: Book deep-dive session (links to contact/Calendly)
```

---

## 5. Performance Targets

- **Lighthouse Performance:** >90 on mobile
- **First Contentful Paint:** <1.5s (removing loading screen helps immediately)
- **Cumulative Layout Shift:** <0.1
- **Scroll:** 60fps consistently (single scroll system, no GPU-heavy effects)
- **Bundle size:** ~80KB reduction from library removals
- **Time to Interactive:** <2s on 4G mobile

---

## 6. Implementation Strategy

**Approach:** Big-bang on a feature branch. All changes are interdependent (the light theme affects every component), so incremental deployment is impractical. Work on a `refine/modern-minimal` branch, deploy after full QA.

**Recommended implementation order:**
1. `app/globals.css` — rewrite design tokens, remove all dark/glass/glow styles, establish light theme foundation
2. `app/layout.tsx` — strip removed components (cursor, loading screen), simplify providers
3. Component removals — delete ParticleBackground, CustomCursor, LoadingScreen, ThemeSwitcher
4. Component rewrites — GlassCard → Card, GlowButton → Button
5. Layout components — Navbar (light theme + remove ThemeSwitcher), Footer
6. Home sections — Hero, StatsBar, ProblemSection, ServicesOverview, ProcessSection, SocialProof, CTABanner (light theme conversions)
7. LenisProvider — remove GSAP integration, simplify config
8. SectionReveal — simplify to pure CSS + Intersection Observer
9. Other pages — About, Services, Case Studies, Contact, Resources (light theme applied)
10. AI Audit — new wizard components, API rewrite, report display
11. Mobile responsiveness pass — test all sections at 320px, 375px, 414px
12. Performance audit — Lighthouse, scroll FPS testing

**Testing approach:**
- Visual comparison at each step (manual review)
- Mobile device testing (real devices preferred, Chrome DevTools responsive mode minimum)
- Lighthouse audit before and after
- Scroll FPS measurement using Chrome DevTools Performance panel

**Deployment:**
- Merge to main after full QA
- Cloudflare Pages auto-deploys from main
- No changes to deployment pipeline needed — same Next.js build + edge runtime

**No breaking changes to:**
- URL structure (all routes stay the same)
- API endpoint path (`/api/ai-demo` stays, payload is expanded but backwards-compatible via defaults)
- External integrations (none currently)

---

## 7. Out of Scope

- CMS integration (content stays hardcoded for now)
- User accounts / saved audit reports
- Real-time competitive data from external APIs
- Multi-language support
- A/B testing infrastructure
- Analytics integration
- Regional expansion beyond AU (architecture supports it, but v1 is AU-only)
