# Session Context — NeuralShift AI

Internal strategy and development blueprint for team alignment.

---

## 1. Project Overview

NeuralShift AI is an Australia-focused AI consultancy targeting small and medium businesses (SMBs). The website serves as the primary sales and lead qualification tool, converting visitors into qualified leads through an interactive AI-powered audit experience.

## 2. Target Audience

- **Primary:** Australian SMBs with 1-50 employees. Non-technical decision makers (business owners, founders, managing directors) who need to trust that AI can help their business without needing to understand the underlying technology.
- **Secondary:** Medium businesses (51-200 employees) who want to scale operations and need structured AI adoption strategies with clear ROI justification for leadership.

## 3. Market Positioning

AU-deep, not global-wide. Competitive advantage is built on local intelligence:

- State-level regulatory knowledge (privacy, industry-specific compliance)
- AU tool ecosystem familiarity (Xero, MYOB, Employment Hero, etc.)
- AU labor cost benchmarks for realistic ROI calculations
- Understanding of AU business culture and decision-making processes

The AI audit is the primary differentiator — no other AU consultancy offers real-time, personalized AI opportunity analysis as a free, self-serve tool.

## 4. Key Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| **Modern Minimal UI (light, editorial)** | Dark glass-morphism alienated non-technical SMB owners; a light theme is more approachable and trustworthy for the target audience. |
| **Adaptive AI Audit Wizard** | A 2-field form was too generic to produce useful insights; a step-by-step wizard with branching questions produces genuinely actionable analysis. |
| **AU-specific intelligence** | Generic global advice is what ChatGPT does for free; AU context (regulations, tools, labor costs) is the moat that justifies engaging a consultancy. |
| **ROI calibration by team size** | Small businesses need to see sub-$10K opportunities, not $100K+ enterprise figures. ROI must feel achievable and relevant to the reader's scale. |
| **Performance-first** | Stripped Lenis/GSAP dual scroll conflict, removed particles/tilt/cursor effects for butter-smooth 60fps experience across all devices. |

## 5. Competitive Differentiation

- **AI audit as conversion tool** — simultaneously qualifies leads and demonstrates the consultancy's capability. The audit itself is proof that NeuralShift understands AI.
- **AU-specific context in every recommendation** — regulations, tools, labor costs, and market conditions are woven into audit outputs.
- **"YOUR ROLE" framing** — shows the business owner their active participation in the AI adoption process, reducing the fear that AI will "replace" them.

## 6. Technical Decisions

- **Next.js 15 + Cloudflare Pages** — edge runtime for low-latency AU delivery.
- **Groq SDK with llama-3.3-70b** — fast inference for real-time audit responses; mock fallback ensures the site works if the API is unavailable.
- **Lenis-only smooth scroll** — single scroll system eliminates conflicts and jank.
- **CSS-only animations** — no GSAP dependency; reduces bundle and improves reliability.
- **~80KB bundle reduction** — achieved by removing unused libraries (particles, tilt, cursor effects, GSAP).

## 7. Future Considerations

- **Regional expansion** — architecture supports per-geography modules (NZ, SEA) without major refactoring.
- **CMS integration** — blog and case studies via headless CMS for ongoing content marketing.
- **Saved audit reports** — user accounts allowing prospects to revisit and share their audit results.
- **A/B testing** — on audit conversion rates, wizard question ordering, and CTA placement.
