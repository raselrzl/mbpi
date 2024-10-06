import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql'; // MySQL connection

export async function GET() {
  let connection;

  try {
    connection = await connectToDatabase();
    console.log('Database connection established.');

    if (!connection) {
      throw new Error('No connection to the database');
    }

    const [users] = await connection.query('SELECT * FROM bloodgroup');
    /* console.log(users); */
    const response = NextResponse.json(users);
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
