import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Define local path for academy leads database backup
const leadsDbPath = path.join(process.cwd(), 'data', 'academy_leads.json');

// Interface for Academy Leads
interface AcademyLead {
  id: string;
  name: string;
  email: string;
  company: string;
  courseId: string;
  courseTitle: string;
  badgeName: string;
  xpReward: number;
  timestamp: string;
}

// Helper to write to local JSON backup safely
function saveLeadToLocalBackup(lead: AcademyLead) {
  try {
    const dir = path.dirname(leadsDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    let leads: AcademyLead[] = [];
    if (fs.existsSync(leadsDbPath)) {
      const raw = fs.readFileSync(leadsDbPath, 'utf-8').trim();
      if (raw) {
        leads = JSON.parse(raw);
      }
    }
    
    leads.push(lead);
    fs.writeFileSync(leadsDbPath, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local academy lead backup:', err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, courseId, courseTitle, badgeName, xpReward } = data;

    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead: AcademyLead = {
      id: `lead_${Date.now()}`,
      name,
      email,
      company,
      courseId,
      courseTitle,
      badgeName,
      xpReward: Number(xpReward) || 0,
      timestamp: new Date().toISOString()
    };

    // 1. Save to local JSON backup (never lose lead data)
    saveLeadToLocalBackup(lead);

    // 2. Try inserting into Supabase using Service Key (bypasses RLS)
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';
    
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { persistSession: false }
        });
        
        // We attempt to insert into 'academy_leads' table. If it doesn't exist, we fallback gracefully.
        const { error } = await supabase
          .from('academy_leads')
          .insert({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            company: lead.company,
            course_id: lead.courseId,
            course_title: lead.courseTitle,
            badge_name: lead.badgeName,
            xp_reward: lead.xpReward,
            created_at: lead.timestamp
          });

        if (error) {
          console.warn('Supabase academy_leads insert failed (table might not exist yet):', error.message);
          
          // Auto-fallback: try inserting as a customer record with a note/tag
          const { error: custError } = await supabase
            .from('customers')
            .insert({
              id: `cust_acad_${Date.now()}`,
              name: lead.name,
              email: lead.email,
              abn: 'ACADEMY_STUDENT',
              address: lead.company,
              active_projects: [`Completed: ${lead.courseTitle} (${lead.badgeName})`]
            });
            
          if (custError) {
            console.warn('Fallback customer insert failed as well:', custError.message);
          }
        }
      } catch (dbErr) {
        console.error('Supabase connection failed for academy lead:', dbErr);
      }
    }

    // 3. Relay Email Notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Netriq AI Academy <onboarding@resend.dev>',
          to: ['netriqai@gmail.com'],
          replyTo: email,
          subject: `🎓 [ACADEMY LEAD] ${name} completed ${courseTitle}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 40px; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #069494; margin-bottom: 24px;">Academy Progress Certified!</h2>
              <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 32px;" />
              
              <p><strong>Operator Name:</strong> ${name}</p>
              <p><strong>Company / Organization:</strong> ${company}</p>
              <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
              <br/>
              
              <div style="background-color: #f6f8fa; padding: 24px; border-radius: 8px; border-left: 4px solid #069494;">
                <p style="margin-top: 0; font-weight: bold;">Course Completed:</p>
                <p style="margin: 4px 0;"><strong>${courseTitle}</strong></p>
                <p style="margin: 4px 0; color: #555;">Badge Earned: 🏅 ${badgeName}</p>
                <p style="margin: 4px 0; color: #555;">XP Awarded: +${xpReward} XP</p>
              </div>
              
              <p style="opacity: 0.5; font-size: 10px; margin-top: 40px; text-transform: uppercase;">Relayed securely via Netriq AI Academy Bridge</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('Resend failed to send academy lead notification email:', mailErr);
      }
    }

    return NextResponse.json({
      status: 'SYNCHRONIZED',
      leadId: lead.id,
      timestamp: lead.timestamp
    });

  } catch (err) {
    console.error('Failed to process academy lead:', err);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
