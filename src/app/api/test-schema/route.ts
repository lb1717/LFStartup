import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get table information
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return NextResponse.json({
        success: false,
        error: tablesError.message
      }, { status: 500 });
    }
    
    // Get column information for universities table
    const { data: universityColumns, error: universityColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'universities');
    
    if (universityColumnsError) {
      console.error('Error fetching university columns:', universityColumnsError);
      return NextResponse.json({
        success: false,
        error: universityColumnsError.message
      }, { status: 500 });
    }
    
    // Get column information for lost_items table
    const { data: lostItemsColumns, error: lostItemsColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'lost_items');
    
    if (lostItemsColumnsError) {
      console.error('Error fetching lost_items columns:', lostItemsColumnsError);
      return NextResponse.json({
        success: false,
        error: lostItemsColumnsError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      tables: tables?.map(t => t.table_name) || [],
      universityColumns: universityColumns || [],
      lostItemsColumns: lostItemsColumns || []
    });
  } catch (error) {
    console.error('Database schema test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 