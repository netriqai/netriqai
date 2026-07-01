import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'AI Automation Services & Pricing — Netriq AI Melbourne',
  description:
    'Explore Netriq AI\'s full service range: AI Discovery Consultation (AUD $2,500), Done-For-You Implementation (AUD $8,000), Ongoing Support Retainer (AUD $1,500/mo), and Team Training (AUD $3,000). Serving Australian SMBs.',
  keywords: [
    'AI automation pricing Australia',
    'AI consulting services Melbourne',
    'SMB AI implementation cost',
    'AI discovery consultation',
    'business automation retainer',
    'AI team training Australia',
    'Make.com automation services',
    'n8n workflow automation',
    'OpenAI business integration',
    'AI ROI consulting',
  ],
  openGraph: {
    title: 'AI Automation Services — Netriq AI | From AUD $2,500',
    description:
      'Custom AI automation for Australian SMBs. Discovery Consultation, Done-For-You Builds, Ongoing Support & Team Training. Transparent pricing, measurable ROI.',
    url: 'https://netriqai.com.au/services',
  },
  alternates: {
    canonical: 'https://netriqai.com.au/services',
  },
};

// FAQ Structured Data for AEO (Answer Engine Optimisation)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does AI automation implementation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most projects are live within 30 days. Simple automations take 1–2 weeks. Complex, multi-system builds take 6–8 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need technical knowledge to use Netriq AI services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zero technical knowledge required. Netriq AI handles 100% of the build. Your job is to understand your business — ours is the technology.',
      },
    },
    {
      '@type': 'Question',
      name: 'What automation tools does Netriq AI use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI uses Make.com, n8n, Zapier, Python, OpenAI, Anthropic Claude, and more. We are tool-agnostic and choose the best stack for your budget and needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ROI can I expect from AI automation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most Netriq AI clients see 3–10× ROI within the first year by saving 10–40 hours of manual labor per week.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does AI automation consulting cost in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netriq AI services start at AUD $2,500 for an AI Discovery Consultation. Done-For-You implementations start at AUD $8,000. Ongoing support retainers start at AUD $1,500 per month. Team training starts at AUD $3,000. Website development is priced per project on a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Netriq AI build websites optimised for search and AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Netriq AI designs and builds fast, custom websites with SEO, AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) built in — structured data, LLM-readable content, and clean performance so you rank on Google and get surfaced by AI assistants like ChatGPT, Gemini and Perplexity. Website development is priced per project on a custom quote.',
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesClient />
    </>
  );
}
