import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase configuration is offline.' }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      session: data.session,
      user: data.user
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed.' }, { status: 405 });
}
