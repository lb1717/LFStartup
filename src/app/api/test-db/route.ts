import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Initializing Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test the connection by getting the current user
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    // Check if the universities table exists
    const { data: tableData, error: tableError } = await supabase
      .from('universities')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking universities table:', tableError);
      return NextResponse.json({ 
        success: false, 
        error: tableError.message,
        message: 'The universities table might not exist yet. Run the database setup script.'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connected to Supabase successfully',
      user: data.user,
      tableExists: true
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 