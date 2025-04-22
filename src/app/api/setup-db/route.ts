import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/setup-db';

export async function GET() {
  try {
    const success = await setupDatabase();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Database setup completed successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Database setup failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while setting up the database' },
      { status: 500 }
    );
  }
} 