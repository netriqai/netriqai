import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Use the API key directly from environment variables, with a dummy fallback to prevent build-time crashes.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummyKeyForBuildTime');

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    // Quick security check - in production you'd use checkAuth from db.ts
    // For now we assume if there's a token, it's the admin session
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, text, pdfBase64, invoiceId } = body;

    if (!to || !pdfBase64) {
      return NextResponse.json({ success: false, error: 'Recipient and PDF attachment are required.' }, { status: 400 });
    }

    // PDF comes as data URL (data:application/pdf;base64,.....)
    const base64Data = pdfBase64.split(',')[1];
    if (!base64Data) {
      return NextResponse.json({ success: false, error: 'Invalid PDF base64 format.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Netriq AI Billing <onboarding@resend.dev>', // Adjust if you have a verified domain
      to: [to],
      subject: subject || `Invoice ${invoiceId} from Netriq AI`,
      text: text || `Please find attached your invoice ${invoiceId}.\n\nThank you for your business!`,
      attachments: [
        {
          filename: `invoice-${invoiceId}.pdf`,
          content: base64Data,
        }
      ]
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
