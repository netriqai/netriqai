import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('ERROR: RESEND_API_KEY is missing from environment.');
      return NextResponse.json({ error: 'CONFIG_ERROR' }, { status: 500 });
    }
    
    const resend = new Resend(apiKey);
    const data = await req.json();
    
    // PRODUCTION EMAIL RELAY
    const { data: emailData, error } = await resend.emails.send({
      from: 'NeuralShift Inquiries <onboarding@resend.dev>', // Use a custom domain later from resend.com for scaling
      to: ['amitindercheema@gmail.com'],
      // Note: Full distribution to prabuddh.k@gmail.com requires domain verification at resend.com/domains
      replyTo: data.email,
      subject: `[NEURAL_SYNC] New Inquiry from ${data.name} (${data.company})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 40px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #0d1117; margin-bottom: 24px;">New Sync Transmission Received.</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 32px;" />
          
          <p><strong>Operator:</strong> ${data.name}</p>
          <p><strong>Organization:</strong> ${data.company}</p>
          <p><strong>Sync Channel:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Comm Channel:</strong> ${data.phone || 'NOT_PROVIDED'}</p>
          <br/>
          
          <p><strong>Industry Sector:</strong> ${data.industry}</p>
          <p><strong>Neural Scale:</strong> ${data.teamSize}</p>
          <p><strong>Protocol Topic:</strong> ${data.service || 'GENERAL_INQUIRY'}</p>
          <br/>
          
          <div style="background-color: #f6f8fa; padding: 24px; border-radius: 8px;">
            <p style="margin-top: 0;"><strong>Core Operational Bottleneck:</strong></p>
            <p style="margin-bottom: 0;">${data.challenge}</p>
          </div>
          
          <p style="opacity: 0.5; font-size: 10px; margin-top: 40px; text-transform: uppercase;">Sent intrinsically from NeuralShift platform | ARCHITECTURE_v2.0</p>
        </div>
      `,
    });

    if (error) {
       console.error('RESEND_ERROR:', error);
       return NextResponse.json({ error: 'TRANS_ERROR', details: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
       status: 'SYNCHRONIZED', 
       message: 'Transmission successfully relayed via NeuralShift Bridge.',
       timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('SYNC_FAILURE:', err);
    return NextResponse.json({ error: 'FAILED_TO_SYNC' }, { status: 500 });
  }
}
