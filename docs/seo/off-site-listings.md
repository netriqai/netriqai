# Off-site listing & GEO playbook — Netriq AI

The on-page SEO/GEO/AEO work makes Netriq AI **citable once found**. This document
covers the off-site presence that makes it **found** — i.e. gets Netriq into the
"data sweep" of visible local firms that Google AI Overviews, Gemini, Perplexity,
and ChatGPT sample when asked about "AI consulting in Melbourne / Australia".

Do these in order. #1 is the single highest-leverage action.

---

## 1. Google Business Profile (do this first)

Create/claim at https://business.google.com — verify the business.

- **Business name:** Netriq AI
- **Primary category:** Business management consultant
  - (Google has no "AI consultant" category; this is the closest. Reinforce "AI"
    in the description and posts.)
- **Additional categories:** Software company, Marketing consultant, Consultant
- **Service area:** Melbourne VIC + "Australia-wide" (set as a service-area
  business if you have no walk-in office)
- **Website:** https://netriq.com.au
- **Phone:** _(add a real contact number — required for trust signals)_
- **Hours:** Mon–Fri 9:00–17:00

**Description (max 750 chars):**

> Netriq AI is a Melbourne-based AI automation consultancy for Australian small
> and medium businesses. We design and build custom AI pipelines, sales
> automation, and intelligent customer-support systems — done-for-you, with
> measurable ROI. Tool-agnostic across Make.com, n8n, Zapier, Python, OpenAI and
> Anthropic Claude. Most clients save 10–40 hours per week and see 3–10x ROI in
> the first year. 200+ workflows built, AUD $4.2M saved for clients. Engagements
> start at AUD $2,500 for an AI Discovery Consultation, through to ongoing
> monthly automation retainers. Book a free 30-minute consultation.

**Services (add each as a GBP service item):**
- AI Discovery Consultation — from AUD $2,500
- Done-For-You AI Implementation — from AUD $8,000
- Ongoing AI Support Retainer — from AUD $1,500/month
- AI Team Training — from AUD $3,000

**After setup:**
- Post 1–2 GBP updates/month (e.g. a case-study highlight or new guide).
- Request reviews from your best 3–5 clients. Genuine reviews here also let you
  legitimately re-add `aggregateRating` to the site schema later.

---

## 2. Directory & review-site listings

These are exactly the sources answer engines sample. Prioritise:

| Platform | Why | Listing focus |
|----------|-----|---------------|
| **Clutch.co** | Heavily cited by AI engines for B2B services | "AI Consulting", location Melbourne, add the case studies |
| **GoodFirms** | Similar B2B citation weight | AI/automation development |
| **LinkedIn Company Page** | Already in schema `sameAs`; keep active | Post the resource articles |
| **True Local / Yellow Pages AU / Hotfrog** | Local AU directory signals | NAP consistency (see below) |
| **DesignRush / The Manifest** | AI agency roundups | Apply to "Top AI companies Australia" lists |

**NAP consistency:** the Name, Address (or service area), and Phone must be
**identical** across every listing and match the site's LocalBusiness schema.
Inconsistent NAP dilutes local ranking.

**Standard listing blurb (reuse everywhere, ~300 chars):**

> Netriq AI — Melbourne AI automation consultancy for Australian SMBs. We build
> custom AI workflows, sales automation and intelligent support systems,
> done-for-you with measurable ROI. 200+ workflows built, AUD $4.2M saved.
> Engagements from AUD $2,500. netriq.com.au

---

## 3. Reinforce the entity for AI engines

- Keep `/llms.txt` (added) current with services and pricing.
- Ensure the LinkedIn page name, logo and description match the site exactly —
  consistency across `sameAs` profiles strengthens entity recognition.
- Publish 1–2 genuinely useful guides per month (the /resources blog already
  supports this) targeting question-shaped queries, e.g. "how much does AI
  automation cost for a small business in Australia". These get quoted directly
  by answer engines.

---

## 4. Open items that need real data (then update the site)

- **Phone number** → add to GBP, all directories, and `telephone` in the
  LocalBusiness schema in `app/layout.tsx`.
- **Real social URLs** → replace the `href="#"` links in
  `components/layout/Footer.tsx` and add them to schema `sameAs` in
  `app/layout.tsx` (currently LinkedIn-only).
- **Genuine reviews** → once you have them on GBP, you can re-add a compliant
  `aggregateRating` with visible on-page reviews.
