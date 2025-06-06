import { NextResponse } from 'next/server';
import { deleteExpiredItems } from '@/lib/api';

// This route should be called by a CRON job daily
export async function POST(request: Request) {
  try {
    // Check if the request includes the correct secret key
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.CLEANUP_SECRET_KEY;

    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete expired items
    await deleteExpiredItems();

    return NextResponse.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 