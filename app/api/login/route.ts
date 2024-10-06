import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  superAdmin?: boolean;
}

export async function POST(req: Request) {
  let connection;
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for:', email);

    // Validate the request
    if (!email || !password) {
      console.error('Missing email or password');
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to the database
    connection = await connectToDatabase();
    if (!connection) {
      console.error('Database connection failed');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }
    console.log('Connected to the database');

    // Query to find the user by email
    const [userRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );

    // Cast the result to an array of AdminUser
    const user = userRows[0] as AdminUser;

    console.log('User found:', user);

    // Check if the user exists
    if (!user) {
      console.error('Invalid email');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check password (ensure you use a proper hashing strategy for production!)
    if (user.password !== password) {
      console.error('Invalid password');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      console.error('User is not an admin');
      return NextResponse.json({ message: 'Unauthorized: You are not an Admin' }, { status: 403 });
    }

    // Determine the redirect path based on roles
    let redirectPath = '/admin/dashboard'; // Default for regular admins

    if (user.isAdmin && user.superAdmin) {
      redirectPath = '/admin/dashboard/superAdmin'; // Super admin path
    }

    // Return user data and the redirect path (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword, // Includes superAdmin and isAdmin fields
        isAdmin: user.isAdmin,
        superAdmin: user.superAdmin || false // Default to false if not present
      },
      redirectPath
    }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
