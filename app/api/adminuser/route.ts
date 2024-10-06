import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql'; // Assuming MySQL connection

export async function GET() {
  try {
    const connection = await connectToDatabase(); // Connect to MySQL database

    // Fetch all admin users from the 'admin' table
    const [adminUsers] = await connection.execute('SELECT * FROM admin');

    /* Debugging: Log fetched users */
    /* console.log('Fetched users:', adminUsers); */

    // Create a response with cache-control headers to disable caching
    const response = NextResponse.json(adminUsers);
    /* response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); */

    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    
    return NextResponse.json(
      { message: 'Error fetching data', error: (error as Error).message },
      { status: 500 }
    );
  }
}
