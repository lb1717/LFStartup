import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Generate a unique ID for the test item
    const itemId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a test item
    const testItem = {
      id: itemId,
      name: 'Test Item',
      location: 'Test Location',
      date: new Date().toISOString().split('T')[0],
      image: '/images/items/test.jpg',
      university_id: 'harvard',
      school_name: 'Harvard University',
      description: 'This is a test item',
      contact_info: 'Contact test@example.com',
      status: 'unclaimed',
      category: 'Electronics'
    };
    
    console.log('Inserting test item:', testItem);
    
    // Insert the test item
    const { data, error } = await supabase
      .from('lost_items')
      .insert([testItem])
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting test item:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
    
    console.log('Test item inserted successfully:', data);
    
    return NextResponse.json({
      success: true,
      item: data
    });
  } catch (error) {
    console.error('Test insert error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 