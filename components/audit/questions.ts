export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'card-select' | 'text' | 'select' | 'multi-select' | 'toggle-group';
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
  };
}

export interface Opportunity {
  title: string;
  yourRole: string;
  description: string;
  impact: 'High' | 'Medium';
  savings: string;
  timeSaved: string;
  implementationTimeframe: string;
}

export interface RoadmapStep {
  phase: '1-30' | '31-60' | '61-90';
  title: string;
  description: string;
}

export interface AuditResponse {
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

export const baseQuestions: Question[] = [
  {
    id: 'industry',
    title: 'What industry are you in?',
    subtitle: 'This helps us tailor insights to your specific market dynamics in Australia.',
    type: 'card-select',
    options: [
      { value: 'Retail', label: 'Retail', icon: '🏪' },
      { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'Construction', label: 'Construction', icon: '🏗️' },
      { value: 'Legal', label: 'Legal', icon: '⚖️' },
      { value: 'Finance', label: 'Finance', icon: '💰' },
      { value: 'Professional Services', label: 'Professional Services', icon: '💼' },
    ],
    required: true,
  },
  {
    id: 'businessDescription',
    title: 'Tell us about your business',
    subtitle: 'A brief description helps us find specific AI opportunities.',
    type: 'text',
    placeholder: 'e.g., We run a 3-location physiotherapy practice in Melbourne...',
    required: true,
    validation: { minLength: 10, maxLength: 500 },
  },
  {
    id: 'state',
    title: 'Where are you based?',
    subtitle: 'State-specific regulations and market dynamics shape our recommendations.',
    type: 'card-select',
    options: [
      { value: 'NSW', label: 'NSW' },
      { value: 'VIC', label: 'VIC' },
      { value: 'QLD', label: 'QLD' },
      { value: 'WA', label: 'WA' },
      { value: 'SA', label: 'SA' },
      { value: 'TAS', label: 'TAS' },
      { value: 'NT', label: 'NT' },
      { value: 'ACT', label: 'ACT' },
    ],
    required: true,
  },
  {
    id: 'region',
    title: 'Metro or regional?',
    subtitle: 'Regional businesses face different challenges and opportunities than metro ones.',
    type: 'card-select',
    options: [
      { value: 'metro', label: 'Metro / Capital city' },
      { value: 'regional', label: 'Regional / Rural' },
    ],
    required: true,
  },
  {
    id: 'teamSize',
    title: 'How big is your team?',
    subtitle: 'This helps us scale recommendations to your capacity.',
    type: 'card-select',
    options: [
      { value: '1-5', label: '1-5 people' },
      { value: '6-20', label: '6-20 people' },
      { value: '21-50', label: '21-50 people' },
      { value: '51-200', label: '51-200 people' },
      { value: '200+', label: '200+ people' },
    ],
    required: true,
  },
];

export const adaptiveQuestions: Question[] = [
  {
    id: 'painPoints',
    title: 'What are your biggest operational pain points?',
    subtitle: 'Select all that apply — this shapes which AI opportunities we prioritise.',
    type: 'multi-select',
    options: [
      { value: 'manual-data-entry', label: 'Manual data entry' },
      { value: 'customer-follow-up', label: 'Customer follow-up' },
      { value: 'compliance-reporting', label: 'Compliance & reporting' },
      { value: 'scheduling', label: 'Scheduling' },
      { value: 'inventory', label: 'Inventory management' },
      { value: 'invoicing', label: 'Invoicing & payments' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  {
    id: 'techMaturity',
    title: 'Where is your business on the tech spectrum?',
    subtitle: 'No judgment — this helps us recommend the right starting point.',
    type: 'card-select',
    options: [
      { value: 'paper', label: 'Mostly paper & spreadsheets' },
      { value: 'some-cloud', label: 'Some cloud tools (Xero, Google Workspace, etc.)' },
      { value: 'integrated', label: 'Integrated systems (CRM, project management, etc.)' },
      { value: 'ai-curious', label: 'Already using some AI' },
    ],
    required: true,
  },
  {
    id: 'revenueGoal',
    title: 'What would success look like?',
    subtitle: 'Pick the outcome that matters most to you right now.',
    type: 'card-select',
    options: [
      { value: 'reduce-costs', label: 'Reduce costs' },
      { value: 'increase-revenue', label: 'Increase revenue' },
      { value: 'customer-experience', label: 'Improve customer experience' },
      { value: 'scale-without-hiring', label: 'Scale without hiring' },
      { value: 'compliance', label: 'Reduce compliance risk' },
    ],
    required: true,
  },
];

export const industryQuestions: Record<string, Question> = {
  Healthcare: {
    id: 'industrySpecific',
    title: 'How many patients do you see per week?',
    subtitle: 'This helps us estimate time savings and ROI for your practice.',
    type: 'card-select',
    options: [
      { value: 'under-50', label: 'Under 50' },
      { value: '50-150', label: '50-150' },
      { value: '150-500', label: '150-500' },
      { value: '500+', label: '500+' },
    ],
    required: true,
  },
  Retail: {
    id: 'industrySpecific',
    title: "What's your online vs in-store revenue split?",
    subtitle: 'Different channels benefit from different AI automations.',
    type: 'card-select',
    options: [
      { value: 'mostly-instore', label: 'Mostly in-store' },
      { value: 'mixed', label: 'Roughly 50/50' },
      { value: 'mostly-online', label: 'Mostly online' },
      { value: 'online-only', label: 'Online only' },
    ],
    required: true,
  },
  Construction: {
    id: 'industrySpecific',
    title: 'How many active projects at any given time?',
    subtitle: 'Project volume determines where automation has the biggest impact.',
    type: 'card-select',
    options: [
      { value: '1-3', label: '1-3 projects' },
      { value: '4-10', label: '4-10 projects' },
      { value: '10-25', label: '10-25 projects' },
      { value: '25+', label: '25+ projects' },
    ],
    required: true,
  },
  Legal: {
    id: 'industrySpecific',
    title: "What's your primary practice area?",
    subtitle: 'Different areas of law have different automation opportunities.',
    type: 'card-select',
    options: [
      { value: 'commercial', label: 'Commercial / Corporate' },
      { value: 'property', label: 'Property & Conveyancing' },
      { value: 'litigation', label: 'Litigation' },
      { value: 'family', label: 'Family Law' },
      { value: 'criminal', label: 'Criminal' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  Finance: {
    id: 'industrySpecific',
    title: 'How many clients do you manage?',
    subtitle: 'Client volume drives the ROI of automation in financial services.',
    type: 'card-select',
    options: [
      { value: 'under-50', label: 'Under 50' },
      { value: '50-200', label: '50-200' },
      { value: '200-500', label: '200-500' },
      { value: '500+', label: '500+' },
    ],
    required: true,
  },
  'Professional Services': {
    id: 'industrySpecific',
    title: 'Do you use a billable hours model?',
    subtitle: 'Billing model affects which automations deliver the most ROI.',
    type: 'card-select',
    options: [
      { value: 'yes', label: 'Yes, billable hours' },
      { value: 'fixed-fee', label: 'Fixed fee / project-based' },
      { value: 'retainer', label: 'Retainer model' },
      { value: 'mixed', label: 'Mixed model' },
    ],
    required: true,
  },
};

/**
 * Determines which adaptive questions to show based on base answers.
 * Small teams (1-5) skip tech maturity (assumed low).
 * All teams get pain points and revenue goal.
 * All teams get industry-specific question.
 */
export function getAdaptiveQuestions(
  industry: string,
  teamSize: string
): Question[] {
  const questions: Question[] = [adaptiveQuestions[0]]; // pain points always

  if (teamSize !== '1-5') {
    questions.push(adaptiveQuestions[1]); // tech maturity for larger teams
  }

  questions.push(adaptiveQuestions[2]); // revenue goal always

  const industryQ = industryQuestions[industry];
  if (industryQ) {
    questions.push(industryQ);
  }

  return questions;
}
