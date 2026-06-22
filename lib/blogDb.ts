import fs from 'fs';
import path from 'path';
import { supabase } from './db';

const blogsPath = path.join(process.cwd(), 'data', 'blogs.json');
const sourcesPath = path.join(process.cwd(), 'data', 'sources.json');

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  color: string;
  content: string; // Markdown content
  sourceUrl?: string;
  sourceName?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  feedUrl: string;
  enabled: boolean;
}

const initialSources: NewsSource[] = [
  {
    id: 'openai',
    name: 'OpenAI Newsroom',
    feedUrl: 'https://openai.com/news/rss.xml',
    enabled: true,
  },
  {
    id: 'google-ai',
    name: 'Google AI News',
    feedUrl: 'https://news.google.com/rss/search?q=Google+AI+artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
    enabled: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic AI News',
    feedUrl: 'https://news.google.com/rss/search?q=Anthropic+Claude+artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
    enabled: true,
  },
  {
    id: '100x-engineers',
    name: '100x Engineers / General AI Tech',
    feedUrl: 'https://news.google.com/rss/search?q=100x+engineers+AI+OR+artificial+intelligence+engineering&hl=en-US&gl=US&ceid=US:en',
    enabled: true,
  }
];

const initialBlogs: BlogPost[] = [
  {
    slug: 'automate-customer-support-ai',
    category: 'AI Strategy',
    title: 'How to Automate Support with AI',
    excerpt:
      "Most AI support implementations fail not because the tech is bad, but because the handoff logic is wrong. Here's how to build a support system that's faster AND more human.",
    readTime: '8 min read',
    date: 'March 10, 2026',
    color: '#6366F1',
    content: `# How to Automate Your Customer Support with AI (Without Losing the Human Touch)

Customer support is one of the clearest and most immediate use cases for AI automation. Done right, it reduces response times from hours to seconds and solves customer inquiries instantly. Done wrong, it frustrates users with circular logic, robotic answers, and no clear path to human help.

Here is Netriq's engineering guide to building a support automation system that achieves high deflection rates while maintaining customer satisfaction.

## 1. The Core Mistake: De-escalation Without Handoff

The biggest error businesses make when installing AI support chatbots is trapping the user in a feedback loop. If the AI doesn't know the answer, repeating the question shouldn't result in the same wrong answer.

### Solution: The "Triage & Escalation" Framework
An effective support pipeline operates in three distinct layers:
1. **Instant Resolution (AI Tier):** Address high-volume, low-complexity questions (e.g., shipping updates, refund policies, login resets) using dynamic knowledge retrieval (RAG).
2. **Warm Hand-off (Triage Tier):** When the AI reaches its confidence threshold limit or the user requests human assistance, package the entire conversation log and pass it directly to an agent.
3. **Human Agent (Expert Tier):** The human receives the ticket along with an AI-generated summary of the problem and two drafted answers, allowing them to solve the ticket in seconds.

---

## 2. Setting Up Retrieval-Augmented Generation (RAG)

To keep your AI agent accurate, you must ground its knowledge. Do not let it hallucinate answers about your pricing or return windows.

- **Sync Knowledge Sources:** Connect your internal wiki (Notion, Guru), your customer help center (Zendesk, HubSpot), and public terms pages.
- **Set Up Strict Boundaries:** Instruct the model: *"If the answer is not explicitly written in the provided context files, state that you do not know and immediately route the customer to a live agent."*
- **Update Frequency:** Re-index your knowledge base weekly to reflect new service terms or product updates.

---

## 3. Recommended Tools for SMB Support Automation
For small and medium businesses looking to get started immediately, we recommend:
- **Make.com / n8n:** To connect your incoming channels (email, web widget, WhatsApp) to LLM APIs.
- **Voiceflow / Landbot:** For designing visual drag-and-drop conversational paths.
- **Help Scout / Zendesk:** As the ticketing backend where human agents can review transcripts and pick up where the AI left off.`
  },
  {
    slug: 'ai-automation-healthcare-clinics',
    category: 'Healthcare',
    title: 'AI Automation for Australian Healthcare Clinics',
    excerpt:
      'From patient reminders to billing follow-up to compliance documentation — a practical playbook for clinic owners who want to stop losing money to manual admin.',
    readTime: '12 min read',
    date: 'February 28, 2026',
    color: '#06B6D4',
    content: `# The Complete Guide to AI Automation for Australian Healthcare Clinics

Australian clinics spend up to 40% of their operational hours on administrative overhead. From booking confirmations and Medicare claim reconciliation to updating patient files and compliance monitoring, medical administration costs clinics thousands of dollars monthly in lost productivity.

This guide outlines three major areas where AI automation can drive measurable efficiency gains.

## 1. Zero-Friction Booking & No-Show Deflection
Standard reminder workflows send a single SMS reminder 24 hours prior. If the patient forgets, the slot goes unfilled.

### The Automated Solution:
- **Intelligent Reminders:** Send multi-channel follow-ups (SMS, Email, WhatsApp) timed according to patient history.
- **Instant Rescheduling:** If a patient cancels, the system automatically checks the waitlist and offers the slot to other patients via text, filling cancellations in minutes without manual intervention.

---

## 2. AI Medical Scribes & Auto-Population
Clinicians spend hours writing site notes after each consultation. 

### The Solution:
- **Voice-to-Text Clinical Scribes:** Ambient AI listening tools (like Cliniko-integrated scribes) securely transcribe consultations in real-time, extracting key symptoms, diagnoses, and prescriptions.
- **Draft Note Generation:** Note summaries are structured into SOAP format and pushed to the Patient Record Management system for review and doctor signature.

---

## 3. Security, Privacy, and APP Compliance
Medical data requires extreme care under the Australian Privacy Principles (APPs).
- **Data Localisation:** Ensure that any AI platform you deploy stores and processes patient data within Australian regions (e.g., \`ap-southeast-2\` in AWS/GCP).
- **BAA Agreements:** Work only with enterprise-grade endpoints that do not use patient inputs for model training.`
  },
  {
    slug: 'n8n-vs-make-vs-zapier',
    category: 'Tool Comparison',
    title: 'n8n vs Make vs Zapier for SMBs',
    excerpt:
      "An honest comparison from someone who's built 200+ workflows on all three platforms. Price, features, complexity, and the scenarios where each one wins.",
    readTime: '10 min read',
    date: 'February 14, 2026',
    color: '#4ADE80',
    content: `# n8n vs Make.com vs Zapier: Which Automation Tool Is Right for Your SMB?

Selecting the right orchestration engine is the most critical technical decision when automating your workflows. Choosing the wrong tool can lead to excessive costs, scalability caps, or developer constraints.

Here is an honest breakdown of the three market leaders.

## 1. Zapier: The Entry-Level Standard
Zapier is the easiest tool to adopt. It supports over 5,000 integrations and requires zero coding knowledge to start.

- **Pros:** Massive app library, robust error handling, fast prototype setup.
- **Cons:** Extremely expensive at scale. Complex multi-step logic becomes hard to maintain.
- **Best For:** Simple, linear task automations (e.g., "When a new lead is added to Google Sheets, send an email").

---

## 2. Make.com: The Visual Powerhouse
Make (formerly Integromat) uses a visual canvas that maps data flows. It is highly flexible and priced logically based on operations.

- **Pros:** Exceptional data mapping, visual routing, cost-effective pricing models.
- **Cons:** Steeper learning curve than Zapier. Large workflows can get cluttered.
- **Best For:** Complex multi-app integrations requiring advanced data formatting and conditional filters.

---

## 3. n8n.io: The Developer's Favorite
n8n is a fair-code node-based workflow engine that can be self-hosted or run in the cloud. It allows you to write custom JavaScript directly inside nodes.

- **Pros:** Extremely cost-efficient (self-hosted has no operation limits), native JavaScript integration, superb for scaling.
- **Cons:** Requires technical understanding to host and configure securely.
- **Best For:** Enterprise-grade workflows, custom data parsing, and situations where data privacy requires on-premise execution.`
  },
  {
    slug: 'melbourne-law-firm-document-ai',
    category: 'Case Study',
    title: 'AI Saves Melbourne Law Firm $95k',
    excerpt:
      "A step-by-step breakdown of exactly how we automated client onboarding and document processing for a 12-partner firm — and what we'd do differently next time.",
    readTime: '7 min read',
    date: 'January 30, 2026',
    color: '#6366F1',
    content: `# How We Saved a Melbourne Law Firm AUD $95k with Document AI

### Context & Challenge
A boutique 12-partner commercial law firm in Melbourne was experiencing significant onboarding bottlenecks. Onboarding a corporate client took an average of 4-6 weeks, heavily driven by back-and-forth document gathering, manual verification checks, and partner admin hours.

### The Automation Strategy
Netriq engineered a unified document parsing pipeline:
1. **Intelligent Capture Portal:** Clients uploaded identity verification documents, financial statements, and company registries through a secure web portal.
2. **AI-OCR & Information Extraction:** An AI engine analyzed the documents, extracted relevant fields (ABNs, director details, tax history), and flagged discrepancies.
3. **Automated Conflict Checks:** Extracted entities were run against historical database registers automatically.
4. **Contract Template Compiling:** Client details were populated into standard letters of engagement and pushed to DocuSign.

### The Financial & Operational ROI
- **Onboarding Speed:** Reduced from 6 weeks to 10 business days.
- **Administrative Savings:** 8+ partner hours saved per week.
- **Total Financial Return:** Saved **AUD $95,000** in operational costs in the first 12 months.
`
  },
  {
    slug: '5-ecommerce-workflows-2026',
    category: 'E-commerce',
    title: '5 Essential E-Commerce Automations for 2026',
    excerpt:
      'Inventory forecasting, cart abandonment, support ticket deflection, supplier ordering, and returns processing. These five automations compound into massive savings.',
    readTime: '9 min read',
    date: 'January 15, 2026',
    color: '#06B6D4',
    content: `# The 5 Workflows Every E-commerce Business Should Automate in 2026

Efficiency is the primary differentiator in modern retail. High-margin brands succeed because they eliminate operational friction and automate supply-chain and customer relations.

Here are the five essential automations for e-commerce operators:

## 1. AI-Driven Inventory Forecasting
Stop relying on static sheets. Build forecasting models that analyze Shopify sales velocity, seasonal trends, and supplier lead times to trigger automated purchase orders.

## 2. Multi-Channel Abandoned Cart Recovery
Go beyond default emails. Dynamically route recovery reminders via SMS or WhatsApp with customized discount triggers based on product value.

## 3. Support Ticket Deflection
Deflect up to 70% of inbound queries (such as "Where is my order?") by connecting Shopify's shipping API to an AI-supported support widget.

## 4. Supplier Purchase Order Orchestration
When stock dips below threshold levels, automatically draft and send purchase orders to suppliers and sync the updates to Xero.

## 5. Self-Service Returns Processing
Empower customers to generate shipping labels, schedule returns, and process refunds automatically through an integrated returns portal.`
  },
  {
    slug: 'ai-for-construction-tradies',
    category: 'Construction',
    title: 'AI Cuts Construction Admin by 40%',
    excerpt:
      'Project reporting, subcontractor compliance, invoice processing, and quote generation. The construction sector is surprisingly ripe for automation — here\'s where to start.',
    readTime: '8 min read',
    date: 'January 5, 2026',
    color: '#4ADE80',
    content: `# AI for Tradies: How Construction Companies Are Cutting Admin Time by 40%

For construction companies, profit is won or lost in document management. If project managers are stuck writing compliance logs and chasing subcontractor insurance papers, projects run behind and overhead increases.

Here is how AI is transforming construction operations:

## 1. Mobile Field Progress Summaries
Instead of writing progress reports at the end of the week, site managers dictate voice notes and take photos directly on-site. The AI converts this input into a structured client report and pushes it to Procore/Airtable instantly.

## 2. Automated Subcontractor Compliance
Chasing insurance certificates, licenses, and white cards is time-consuming. Set up an automated check-in portal that flags expiring subcontractor certificates and alerts them to upload renewals before they step on-site.

## 3. Instant Materials Quote Matching
When suppliers send materials quotes, run them through an extraction pipeline to compare pricing against historical budgets and highlight price hikes immediately.`
  },
  {
    slug: 'what-is-an-ai-consultation',
    category: 'Getting Started',
    title: 'Why SMBs Need Professional AI Consultations',
    excerpt:
      'Most businesses that fail at AI implementation didn\'t do a proper discovery phase. Here\'s what an AI consultation actually involves, what it costs, and what you get out of it.',
    readTime: '6 min read',
    date: 'December 18, 2025',
    color: '#6366F1',
    content: `# What Is an AI Consultation and Why Every SMB Needs One Before Implementing AI

Many business owners are eager to implement AI but lack a clear roadmap. They purchase software subscriptions, assign internal teams, and end up with fragmented tools that do not solve core operational bottlenecks.

A professional AI Consultation is the first step to successful automation.

## What is an AI Consultation?
An AI consultation is a structured diagnostic process that audits your current operational workflows:
- **Operational Auditing:** Identifying manual administrative bottlenecks (e.g., invoicing, customer service, data transfer).
- **Feasibility Assessment:** Matching those bottlenecks with existing AI models and automation platforms.
- **ROI Projections:** Building financial models that project time and cost savings before you invest in developers.

## The Output
You walk away with a comprehensive implementation plan containing architecture diagrams, recommended tech stacks, and detailed developer blueprints.`
  },
  {
    slug: 'prompt-engineering-business',
    category: 'AI Skills',
    title: 'Business Prompt Engineering for Teams',
    excerpt:
      'You don\'t need to be an engineer to write effective prompts. Learn the frameworks that turn vague AI outputs into precise, usable business content — with real examples.',
    readTime: '11 min read',
    date: 'December 5, 2025',
    color: '#06B6D4',
    content: `# Prompt Engineering for Business: A Practical Guide for Non-Technical Teams

Prompt engineering is not about finding "magic words" to ask ChatGPT. It is the practice of instructing a model to output structured, accurate, and contextually grounded results.

Here are the key frameworks for non-technical operators:

## 1. The RTD (Role, Task, Context) Framework
Always begin by specifying a clear role and task:
- **Role:** *You are an expert copywriter for an Australian legal practice.*
- **Task:** *Rewrite this case summary into a plain-English newsletter paragraph.*
- **Context:** *Keep the tone professional yet approachable, and limit it to 100 words.*

---

## 2. Give the Model Examples (Few-Shot Prompting)
Instead of asking the model to write in "your brand voice," provide 2-3 examples of excellent content you've already published. Models excel at pattern matching.

---

## 3. Demand Structured Output
If you need data for a spreadsheet or database, instruct the model: *Output strictly in JSON format matching this schema. Do not write any conversational preamble.*`
  }
];

// Local helper functions for synchronous fallback
export function readBlogsLocal(): BlogPost[] {
  try {
    if (!fs.existsSync(blogsPath)) {
      const dir = path.dirname(blogsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(blogsPath, JSON.stringify(initialBlogs, null, 2), 'utf-8');
      return initialBlogs;
    }
    const raw = fs.readFileSync(blogsPath, 'utf-8').trim();
    if (!raw) return initialBlogs;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading blogs.json:', error);
    return initialBlogs;
  }
}

export function writeBlogsLocal(blogs: BlogPost[]): boolean {
  try {
    const dir = path.dirname(blogsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${blogsPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(blogs, null, 2), 'utf-8');
    fs.renameSync(tempPath, blogsPath);
    return true;
  } catch (error) {
    console.error('Error writing blogs.json:', error);
    return false;
  }
}

export function readSourcesLocal(): NewsSource[] {
  try {
    if (!fs.existsSync(sourcesPath)) {
      const dir = path.dirname(sourcesPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(sourcesPath, JSON.stringify(initialSources, null, 2), 'utf-8');
      return initialSources;
    }
    const raw = fs.readFileSync(sourcesPath, 'utf-8').trim();
    if (!raw) return initialSources;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading sources.json:', error);
    return initialSources;
  }
}

export function writeSourcesLocal(sources: NewsSource[]): boolean {
  try {
    const dir = path.dirname(sourcesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${sourcesPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(sources, null, 2), 'utf-8');
    fs.renameSync(tempPath, sourcesPath);
    return true;
  } catch (error) {
    console.error('Error writing sources.json:', error);
    return false;
  }
}

// Asynchronous Supabase wrappers
export async function readBlogs(): Promise<BlogPost[]> {
  const localBlogs = readBlogsLocal();
  if (!supabase) return localBlogs;

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*');

    if (error) {
      console.warn('Supabase readBlogs failed, falling back to local JSON:', error.message);
      return localBlogs;
    }

    if (!data || data.length === 0) {
      console.log('Supabase blogs table is empty. Seeding with local blogs...');
      await writeBlogs(localBlogs);
      return localBlogs;
    }

    return data.map(row => ({
      slug: row.slug,
      category: row.category,
      title: row.title,
      excerpt: row.excerpt,
      readTime: row.read_time || row.readTime || '5 min read',
      date: row.date,
      color: row.color,
      content: row.content,
      sourceUrl: row.source_url || row.sourceUrl || undefined,
      sourceName: row.source_name || row.sourceName || undefined
    }));
  } catch (err) {
    console.error('Failed to get blogs from Supabase:', err);
    return localBlogs;
  }
}

export async function writeBlogs(blogs: BlogPost[]): Promise<boolean> {
  // Always update local JSON as a backup/local fallback
  writeBlogsLocal(blogs);

  if (!supabase) return true;

  try {
    const mapped = blogs.map(b => ({
      slug: b.slug,
      category: b.category,
      title: b.title,
      excerpt: b.excerpt,
      read_time: b.readTime,
      date: b.date,
      color: b.color,
      content: b.content,
      source_url: b.sourceUrl || null,
      source_name: b.sourceName || null
    }));

    const { error } = await supabase
      .from('blogs')
      .upsert(mapped, { onConflict: 'slug' });

    if (error) {
      console.error('Supabase writeBlogs upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to write blogs to Supabase:', err);
    return false;
  }
}

export async function deleteBlog(slug: string): Promise<boolean> {
  const localBlogs = readBlogsLocal().filter(b => b.slug !== slug);
  writeBlogsLocal(localBlogs);

  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Supabase deleteBlog error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete blog from Supabase:', err);
    return false;
  }
}

export async function readSources(): Promise<NewsSource[]> {
  const localSources = readSourcesLocal();
  if (!supabase) return localSources;

  try {
    const { data, error } = await supabase
      .from('news_sources')
      .select('*');

    if (error) {
      console.warn('Supabase readSources failed, falling back to local JSON:', error.message);
      return localSources;
    }

    if (!data || data.length === 0) {
      console.log('Supabase news_sources table is empty. Seeding with local sources...');
      await writeSources(localSources);
      return localSources;
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      feedUrl: row.feed_url || row.feedUrl || '',
      enabled: row.enabled ?? true
    }));
  } catch (err) {
    console.error('Failed to get news sources from Supabase:', err);
    return localSources;
  }
}

export async function writeSources(sources: NewsSource[]): Promise<boolean> {
  // Always update local JSON as a backup/local fallback
  writeSourcesLocal(sources);

  if (!supabase) return true;

  try {
    const mapped = sources.map(s => ({
      id: s.id,
      name: s.name,
      feed_url: s.feedUrl,
      enabled: s.enabled
    }));

    const { error } = await supabase
      .from('news_sources')
      .upsert(mapped, { onConflict: 'id' });

    if (error) {
      console.error('Supabase writeSources upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to write news sources to Supabase:', err);
    return false;
  }
}

export async function deleteSource(id: string): Promise<boolean> {
  const localSources = readSourcesLocal().filter(s => s.id !== id);
  writeSourcesLocal(localSources);

  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('news_sources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase deleteSource error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete news source from Supabase:', err);
    return false;
  }
}
