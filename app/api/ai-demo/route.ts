export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface Opportunity {
  title: string;
  yourRole: string;
  description: string;
  impact: 'High' | 'Medium';
  savings: string;
  timeSaved: string;
  implementationTimeframe: string;
}

interface RoadmapStep {
  phase: '1-30' | '31-60' | '61-90';
  title: string;
  description: string;
}

interface AuditResponse {
  opportunities: Opportunity[];
  roadmap: RoadmapStep[];
  context: {
    industry: string;
    state: string;
    teamSize: string;
    businessDescription: string;
  };
  source: 'ai' | 'mock';
}

interface AuditRequest {
  industry: string;
  businessDescription: string;
  state: string;
  region: string;
  teamSize: string;
  painPoints?: string[];
  techMaturity?: string;
  revenueGoal?: string;
  industrySpecific?: string;
}

// ROI ranges by team size
const roiRanges: Record<string, string> = {
  '1-5': '$2K-$8K annual savings per opportunity',
  '6-20': '$8K-$25K annual savings per opportunity',
  '21-50': '$25K-$60K annual savings per opportunity',
  '51-200': '$60K-$150K annual savings per opportunity',
  '200+': '$150K+ annual savings per opportunity',
};

const SYSTEM_PROMPT = `You are an AI automation consultant at Netriq AI, a premium Australian AI consultancy specialising in SMBs.

You must respond ONLY with valid JSON matching this exact schema (no markdown, no code fences):
{
  "opportunities": [
    {
      "title": "short action title",
      "yourRole": "what the business owner personally does (NOT what the AI does)",
      "description": "2-3 sentences, specific and practical",
      "impact": "High" or "Medium",
      "savings": "dollar amount scaled to team size",
      "timeSaved": "hours per week freed up",
      "implementationTimeframe": "realistic timeframe"
    }
  ],
  "roadmap": [
    { "phase": "1-30", "title": "...", "description": "..." },
    { "phase": "31-60", "title": "...", "description": "..." },
    { "phase": "61-90", "title": "...", "description": "..." }
  ]
}

CRITICAL RULES:
- Return exactly 3 opportunities
- "yourRole" describes what the OWNER does, e.g. "Review the weekly AI summary over coffee" not "Deploy NLP pipeline"
- For small teams (1-5 staff), implementation = 1-2 weeks, savings = $2K-$8K/year each
- For 6-20 staff, savings = $8K-$25K/year each
- Australian context ONLY:
  - Reference AU tools: Xero, MYOB, Cliniko, ServiceM8, Square AU, Deputy, Employment Hero
  - AU labour costs: ~$30-$45/hr admin, $60-$100/hr professional
  - AU regulations: SafeWork (QLD), WorkSafe (VIC), AHPRA (healthcare), Fair Work Act, ATO compliance
  - AU states have different regulations — tailor to the state provided
- Roadmap phases: Days 1-30 = quick wins, Days 31-60 = build on wins, Days 61-90 = scale
- Keep language simple, human, and relatable for small business owners
- "timeSaved" should be realistic: "3-5 hrs/week" not "40 hrs/week" for small teams`;

async function getGroqAudit(
  body: AuditRequest
): Promise<{ opportunities: Opportunity[]; roadmap: RoadmapStep[] }> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const roiRange = roiRanges[body.teamSize] ?? roiRanges['1-5'];

  const userMessage = `Business: "${body.businessDescription}"
Industry: ${body.industry}
State: ${body.state}
Region: ${body.region}
Team size: ${body.teamSize}
Pain points: ${Array.isArray(body.painPoints) ? body.painPoints.join(', ') : 'not specified'}
Tech maturity: ${body.techMaturity ?? 'not specified'}
Success goal: ${body.revenueGoal ?? 'not specified'}
Industry-specific: ${body.industrySpecific ?? 'not specified'}

ROI target range for this team size: ${roiRange}

Generate 3 AI automation opportunities and a 30/60/90 day roadmap. Return as JSON only.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content ?? '';
  const cleaned = content.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as { opportunities: Opportunity[]; roadmap: RoadmapStep[] };

  if (!Array.isArray(parsed.opportunities) || parsed.opportunities.length === 0) {
    throw new Error('Invalid response shape from Groq');
  }

  return parsed;
}

// Mock responses calibrated for small AU businesses (5-person team, sub-$10K savings)
const mockResponses: Record<string, { opportunities: Opportunity[]; roadmap: RoadmapStep[] }> = {
  Retail: {
    opportunities: [
      {
        title: 'Auto-Reply to Customer Enquiries',
        yourRole: 'Glance at the weekly summary to spot any tricky questions the AI flagged for you.',
        description: 'Set up an AI chatbot trained on your product catalogue, return policy, and FAQs. It handles "is this in stock?", "what are your hours?", and order status questions via your website and Instagram DMs — even at 2am.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '4-6 hrs/week',
        implementationTimeframe: '1 week',
      },
      {
        title: 'Smart Inventory Reorder Alerts',
        yourRole: 'Check the Monday morning reorder email and approve the suggested purchase orders in Xero.',
        description: 'Connect your Square AU POS data to a simple automation that tracks sales velocity and alerts you before popular items run out. No more emergency supplier calls or lost sales from empty shelves.',
        impact: 'High',
        savings: '$2K-$4K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Automated Post-Purchase Follow-Up',
        yourRole: 'Review the monthly "what customers are saying" digest over coffee.',
        description: 'Trigger personalised thank-you emails and review requests 3 days after purchase. Repeat customers get a loyalty offer. All automated through your existing email platform with AI-written copy tailored to what they bought.',
        impact: 'Medium',
        savings: '$2K-$3K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1 week',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Launch AI customer replies and post-purchase emails. Immediate time savings.' },
      { phase: '31-60', title: 'Build on wins', description: 'Connect Square AU to inventory alerts. Fine-tune chatbot responses from real questions.' },
      { phase: '61-90', title: 'Scale it up', description: 'Add seasonal forecasting. Expand AI replies to Instagram and Facebook Messenger.' },
    ],
  },
  Healthcare: {
    opportunities: [
      {
        title: 'Automated Appointment Reminders',
        yourRole: 'Check the no-show dashboard once a week — it updates itself.',
        description: 'Send SMS and email reminders at 48hr and 2hr intervals before appointments via Cliniko. Cancelled slots auto-trigger a waitlist notification so gaps get filled fast. Reduces no-shows by 40-60%.',
        impact: 'High',
        savings: '$4K-$7K/yr',
        timeSaved: '3-5 hrs/week',
        implementationTimeframe: '1 week',
      },
      {
        title: 'Digital Patient Intake Forms',
        yourRole: 'Approve the new form template once, then forget about it — patient data flows into Cliniko automatically.',
        description: 'Replace paper intake forms with a mobile-friendly digital version that patients complete before arrival. Data auto-populates Cliniko, flagging allergies and Medicare details. Meets AHPRA record-keeping requirements.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '4-6 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Overdue Invoice Follow-Up',
        yourRole: 'Review the fortnightly collections summary — the system chases payments for you.',
        description: 'Automated payment reminders via SMS with a tap-to-pay link for outstanding invoices. Escalation sequence for overdue accounts. Integrates with Xero or MYOB for reconciliation.',
        impact: 'Medium',
        savings: '$2K-$4K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1 week',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Launch appointment reminders and payment follow-ups. See no-show rates drop immediately.' },
      { phase: '31-60', title: 'Build on wins', description: 'Roll out digital intake forms. Train staff on the new workflow (takes 15 minutes).' },
      { phase: '61-90', title: 'Scale it up', description: 'Add waitlist automation and rebooking flows. Review 90-day savings report.' },
    ],
  },
  Construction: {
    opportunities: [
      {
        title: 'Auto-Generate Site Progress Reports',
        yourRole: 'Snap a few photos on site — the AI writes the progress report and emails it to the client.',
        description: 'Upload site photos and a voice note from your phone. AI compiles a formatted progress report with descriptions, completion percentages, and next steps. Email it to clients with one tap.',
        impact: 'High',
        savings: '$4K-$6K/yr',
        timeSaved: '3-5 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Subcontractor Compliance Tracker',
        yourRole: 'Check the traffic-light dashboard weekly — green means compliant, red means action needed.',
        description: 'Automated reminders to subbies when their insurance, White Card, or licences are expiring. Tracks SafeWork/WorkSafe compliance docs in one dashboard. No more chasing paperwork before audits.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '3-4 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Invoice-to-PO Matching',
        yourRole: 'Approve matched invoices with one click in Xero — mismatches get flagged for your review.',
        description: 'AI reads supplier invoices, matches them to purchase orders in Xero or MYOB, and flags discrepancies. Eliminates double-payments and speeds up payment runs.',
        impact: 'Medium',
        savings: '$2K-$4K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '2 weeks',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Set up auto-reports and subbie compliance tracking. Immediate admin relief.' },
      { phase: '31-60', title: 'Build on wins', description: 'Connect invoice matching to Xero. Refine report templates with client feedback.' },
      { phase: '61-90', title: 'Scale it up', description: 'Add variation tracking and automated client update emails per project milestone.' },
    ],
  },
  Legal: {
    opportunities: [
      {
        title: 'AI-Assisted Document Review',
        yourRole: 'Review the AI-highlighted clauses and approve — skip the 30-page read-through.',
        description: 'AI scans contracts, leases, and agreements to flag non-standard clauses, missing provisions, and risk areas. You review the summary, not the full document. Perfect for conveyancing and commercial work.',
        impact: 'High',
        savings: '$5K-$8K/yr',
        timeSaved: '4-6 hrs/week',
        implementationTimeframe: '2 weeks',
      },
      {
        title: 'Automated Client Intake & Conflict Check',
        yourRole: 'Approve the new matter from your phone — intake, conflict check, and engagement letter are pre-done.',
        description: 'New enquiries fill out a smart intake form. AI runs a conflict check against your matter list, drafts an engagement letter, and opens the matter in your practice management system. Meets Law Society requirements.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '3-4 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Court Date & Deadline Reminders',
        yourRole: 'Glance at the weekly deadline digest — everything is tracked automatically.',
        description: 'AI extracts key dates from court documents and syncs to your calendar with escalating reminders. No more missed limitation periods or filing deadlines. Covers Federal and state jurisdictions.',
        impact: 'Medium',
        savings: '$2K-$4K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1 week',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Launch client intake automation and deadline tracking. Free up your paralegal immediately.' },
      { phase: '31-60', title: 'Build on wins', description: 'Add AI document review for your most common agreement types.' },
      { phase: '61-90', title: 'Scale it up', description: 'Expand to precedent search and automated first-draft letters of advice.' },
    ],
  },
  Finance: {
    opportunities: [
      {
        title: 'Automated Client Reporting',
        yourRole: 'Review the AI-generated commentary, tweak one or two lines, and hit send.',
        description: 'Pull client data from Xero or MYOB, generate a formatted monthly or quarterly report with AI-written performance commentary, and email it. What used to take 2 hours per client now takes 5 minutes.',
        impact: 'High',
        savings: '$5K-$8K/yr',
        timeSaved: '4-6 hrs/week',
        implementationTimeframe: '2 weeks',
      },
      {
        title: 'KYC & Onboarding Automation',
        yourRole: 'Approve the completed onboarding pack — ID verification and AML checks are already done.',
        description: 'New clients complete a digital onboarding form with ID upload. AI verifies documents, runs AUSTRAC-compliant AML checks, and generates the engagement letter. Cuts onboarding from 2 weeks to 2 days.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '3-4 hrs/week',
        implementationTimeframe: '2 weeks',
      },
      {
        title: 'ATO Deadline & BAS Reminders',
        yourRole: 'Check the monthly compliance dashboard — clients are auto-reminded before deadlines.',
        description: 'Automated SMS and email reminders to clients before BAS, tax return, and super guarantee deadlines. Tracks who has submitted and who needs a nudge. Reduces last-minute scrambles and late lodgement penalties.',
        impact: 'Medium',
        savings: '$2K-$3K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1 week',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Launch ATO deadline reminders and client onboarding automation.' },
      { phase: '31-60', title: 'Build on wins', description: 'Roll out automated client reporting with AI commentary.' },
      { phase: '61-90', title: 'Scale it up', description: 'Add cashflow forecasting alerts and proactive advisory triggers.' },
    ],
  },
  'Professional Services': {
    opportunities: [
      {
        title: 'AI-Powered Proposal Generator',
        yourRole: 'Answer 5 quick questions about the project, review the draft proposal, and send it same-day.',
        description: 'AI generates a tailored proposal from your template library based on the client brief. Includes scope, timeline, pricing, and terms. What used to take half a day now takes 20 minutes.',
        impact: 'High',
        savings: '$4K-$6K/yr',
        timeSaved: '3-5 hrs/week',
        implementationTimeframe: '1-2 weeks',
      },
      {
        title: 'Automated Time Tracking Reminders',
        yourRole: 'Review the weekly utilisation summary on Monday morning — no more chasing the team for timesheets.',
        description: 'Automated nudges via Slack or email when team members forget to log time. AI suggests time entries based on calendar events and project activity. Integrates with Deputy or Employment Hero.',
        impact: 'High',
        savings: '$3K-$5K/yr',
        timeSaved: '3-4 hrs/week',
        implementationTimeframe: '1 week',
      },
      {
        title: 'Client Follow-Up Sequences',
        yourRole: 'Check which leads went cold and which booked a call — the follow-up happens automatically.',
        description: 'After an initial meeting or proposal, AI triggers a personalised follow-up sequence. Adjusts tone and timing based on client engagement. Keeps your pipeline warm without manual effort.',
        impact: 'Medium',
        savings: '$2K-$4K/yr',
        timeSaved: '2-3 hrs/week',
        implementationTimeframe: '1 week',
      },
    ],
    roadmap: [
      { phase: '1-30', title: 'Quick wins', description: 'Launch follow-up sequences and time tracking reminders. Immediate pipeline and utilisation gains.' },
      { phase: '31-60', title: 'Build on wins', description: 'Deploy AI proposal generator. Train it on your best past proposals.' },
      { phase: '61-90', title: 'Scale it up', description: 'Add project scoping AI and automated client satisfaction surveys.' },
    ],
  },
};

// Default fallback for industries not in the map
const defaultMock: { opportunities: Opportunity[]; roadmap: RoadmapStep[] } = {
  opportunities: [
    {
      title: 'Automate Your Email Triage',
      yourRole: 'Check the priority inbox once a day — routine replies are handled for you.',
      description: 'AI reads incoming emails, drafts replies for common enquiries (pricing, availability, bookings), and flags urgent ones for your attention. Works with Gmail and Outlook.',
      impact: 'High',
      savings: '$3K-$5K/yr',
      timeSaved: '4-6 hrs/week',
      implementationTimeframe: '1 week',
    },
    {
      title: 'Smart Invoicing & Payment Chasing',
      yourRole: 'Review the weekly cash flow snapshot — overdue invoices are being chased automatically.',
      description: 'Auto-generate invoices from completed jobs in Xero or MYOB. Overdue invoices trigger a friendly SMS reminder with a tap-to-pay link. Escalation sequence for repeat late payers.',
      impact: 'High',
      savings: '$2K-$4K/yr',
      timeSaved: '2-3 hrs/week',
      implementationTimeframe: '1 week',
    },
    {
      title: 'Social Media Content on Autopilot',
      yourRole: 'Approve 5 posts for the week on Monday — the AI writes and schedules them.',
      description: 'AI generates weekly social posts based on your services, recent jobs, and local events. Matches your brand voice. Covers Facebook, Instagram, and LinkedIn. Free up your evenings.',
      impact: 'Medium',
      savings: '$2K-$3K/yr',
      timeSaved: '3-4 hrs/week',
      implementationTimeframe: '1 week',
    },
  ],
  roadmap: [
    { phase: '1-30', title: 'Quick wins', description: 'Launch email triage and invoice automation. See immediate time savings.' },
    { phase: '31-60', title: 'Build on wins', description: 'Add social media automation. Refine AI email responses with real examples.' },
    { phase: '61-90', title: 'Scale it up', description: 'Connect all systems for end-to-end workflow automation. Review 90-day ROI.' },
  ],
};

// Allowed values for validation
const VALID_INDUSTRIES = ['Retail', 'Healthcare', 'Construction', 'Legal', 'Finance', 'Professional Services'];
const VALID_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const VALID_REGIONS = ['metro', 'regional'];
const VALID_TEAM_SIZES = ['1-5', '6-20', '21-50', '51-200', '200+'];

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[\x00-\x1F]/g, '');
}

function validateStringArray(input: unknown, maxItems: number): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === 'string')
    .slice(0, maxItems)
    .map((s) => s.slice(0, 100));
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const body: AuditRequest = {
      industry: sanitizeString(raw.industry, 50),
      businessDescription: sanitizeString(raw.businessDescription, 500),
      state: sanitizeString(raw.state, 10),
      region: sanitizeString(raw.region, 20),
      teamSize: sanitizeString(raw.teamSize, 10),
      painPoints: validateStringArray(raw.painPoints, 10),
      techMaturity: sanitizeString(raw.techMaturity, 50),
      revenueGoal: sanitizeString(raw.revenueGoal, 50),
      industrySpecific: sanitizeString(raw.industrySpecific, 100),
    };

    const { industry, businessDescription, state, teamSize } = body;

    if (!industry || !businessDescription || !state || !teamSize) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, businessDescription, state, teamSize' },
        { status: 400 }
      );
    }

    if (!VALID_STATES.includes(state) || !VALID_TEAM_SIZES.includes(teamSize)) {
      return NextResponse.json(
        { error: 'Invalid field values' },
        { status: 400 }
      );
    }

    const context = {
      industry,
      state,
      teamSize,
      businessDescription,
    };

    let opportunities: Opportunity[];
    let roadmap: RoadmapStep[];
    let source: 'ai' | 'mock' = 'mock';

    if (process.env.GROQ_API_KEY) {
      try {
        const result = await getGroqAudit(body);
        opportunities = result.opportunities;
        roadmap = result.roadmap;
        source = 'ai';
      } catch (err) {
        console.error('Groq API error, falling back to mock:', err);
        const mock = mockResponses[industry] ?? defaultMock;
        opportunities = mock.opportunities;
        roadmap = mock.roadmap;
      }
    } else {
      // No API key — use mock with simulated delay
      await new Promise((r) => setTimeout(r, 1200));
      const mock = mockResponses[industry] ?? defaultMock;
      opportunities = mock.opportunities;
      roadmap = mock.roadmap;
    }

    const response: AuditResponse = {
      opportunities,
      roadmap,
      context,
      source,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
