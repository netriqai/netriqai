# Product Requirements Document — NeuralShift AI Website

Development blueprint for the NeuralShift AI website.

---

## 1. Product Overview

NeuralShift AI website. Primary purpose: generate qualified leads through an AI-powered audit that demonstrates the consultancy's capabilities. The website is the sole digital sales channel for an Australia-focused AI consultancy targeting SMBs.

## 2. Objectives

- **Convert visitors to audit completions** — target >15% of homepage visitors starting the audit.
- **Generate qualified leads with rich context** — capture industry, pain points, tech maturity, and team size to enable high-quality sales conversations.
- **Demonstrate AI capability through the audit experience itself** — the audit is a live proof-of-concept that NeuralShift understands AI and can deliver value.

## 3. User Personas

### Small Business Owner — "Sarah"

- Runs an 8-person accounting firm in Melbourne.
- Skeptical about AI but curious after seeing competitors adopt it.
- Needs to see concrete dollar amounts and time savings, not abstract "transformation" language.
- Uses Xero, Google Workspace, and basic spreadsheets.
- Key question: "What would this actually do for my business?"
- Decision process: Will try the audit on her own, then discuss with her business partner before engaging.

### Medium Business Decision Maker — "James"

- Operations manager at a 120-person construction company in Brisbane.
- Has budget for AI projects but needs to justify ROI to the board of directors.
- Uses integrated project management and ERP systems.
- Wants competitive benchmarking — how does his company compare to peers in AI adoption?
- Key question: "Can I take this report to my directors and get approval?"
- Decision process: Needs a formal proposal after the audit; the audit report is the first step.

## 4. Feature Requirements

| ID | Feature | Description |
|---|---|---|
| F1 | Modern minimal UI | Light editorial theme with clean typography, ample whitespace, and subtle animations. |
| F2 | Butter-smooth scrolling | 60fps single scroll system (Lenis only), no jank or scroll conflicts. |
| F3 | Mobile-first responsive design | Fully responsive from 320px to 1440px+. Touch-optimized interactions. |
| F4 | Adaptive AI audit wizard | 5 base questions + 2-3 branching questions based on industry and team size. Progressive disclosure to reduce cognitive load. |
| F5 | AU-contextualized audit report | Personalized AI opportunity analysis with ROI quantification using AU labor costs, regulations, and tool ecosystem. |
| F6 | 30/60/90 day roadmap | Each audit report includes a phased implementation roadmap with concrete next steps. |
| F7 | "YOUR ROLE" callouts | Business owner participation sections showing what the owner does at each stage, reducing fear of being replaced by AI. |

## 5. Technical Requirements

### Stack

- Next.js 15, React 19, Tailwind CSS 3.4
- Edge runtime (Cloudflare Pages)
- Groq SDK (llama-3.3-70b) with mock fallback for API unavailability

### Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | >90 |
| First Contentful Paint (FCP) | <1.5s |
| Cumulative Layout Shift (CLS) | <0.1 |
| Time to Interactive (TTI) | <2s |
| Bundle size | <200KB (after ~80KB reduction from removed libraries) |
| Scroll FPS | 60fps sustained |

### Accessibility

- WCAG AA compliance
- Minimum contrast ratios on all text
- Full keyboard navigation support
- Screen reader compatibility (semantic HTML, ARIA labels)

## 6. Information Architecture

```
Home
├── Hero (headline, value prop, primary CTA)
├── Stats bar (key metrics)
├── Problem statement
├── Services overview
├── AI Audit (wizard entry point)
├── Case studies (social proof)
├── Process (how it works)
├── Social proof (testimonials, logos)
└── Final CTA

About
Services
Case Studies
Contact
Resources
```

## 7. Success Metrics

| Metric | Description |
|---|---|
| Audit start rate | % of homepage visitors who begin the audit wizard |
| Audit completion rate | % of audit starters who complete all questions |
| Post-audit contact submissions | % of audit completers who submit a contact/consultation request |
| Bounce rate | Homepage bounce rate (target <40%) |
| Lighthouse scores | Automated performance, accessibility, SEO scores |
| Scroll FPS | Measured via DevTools on mid-range mobile devices |

## 8. Out of Scope (v1)

- Content Management System (CMS)
- User accounts and saved audit reports
- Multi-language support
- A/B testing infrastructure
- Analytics platform integration
- Regional expansion beyond Australia

## 9. Dependencies & Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Groq API availability | Audit wizard fails if API is down | Mock fallback generates realistic static responses |
| AU market data accuracy | Incorrect ROI figures damage credibility | Regular review of labor cost benchmarks and regulation references in prompts |
| Mobile performance on older devices | Poor experience for a significant segment of AU SMB owners | Performance budget enforced; CSS-only animations; no heavy JS libraries |
| Competitor replication | Another AU consultancy copies the audit approach | First-mover advantage; continuously improve audit quality with real client data |
