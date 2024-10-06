// app/api/testConnection/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql';

export async function GET() {
  try {
    await connectToDatabase(); // Attempt to connect to the database
    return NextResponse.json({ message: 'Database connection successful!' });
  } catch (error) {
    return NextResponse.json({ message: 'Database connection failed.', error: (error as Error).message }, { status: 500 });
  }
}
