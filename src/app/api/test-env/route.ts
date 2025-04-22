import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anonKeyLength = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0;
  
  return NextResponse.json({
    supabaseUrl,
    hasAnonKey,
    anonKeyLength,
    envLoaded: !!supabaseUrl && hasAnonKey,
    urlValid: supabaseUrl?.startsWith('https://') && supabaseUrl?.endsWith('.supabase.co'),
  });
} 