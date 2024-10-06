import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql'; // Assuming MySQL connection

// Type definition for the request body
interface UserData {
  fullName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  phoneNumber?: string;
  superAdmin?: boolean; // New field for superAdmin
}

export async function POST(req: Request) {
  let connection;
  try {
    // Destructure and type the request body
    const { fullName, email, phoneNumber, password, isAdmin, superAdmin }: UserData = await req.json();

    // Validate the request
    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Full name, email, and password are required' }, { status: 400 });
    }

    // Connect to the database
    connection = await connectToDatabase();

    // Check if the user already exists in the 'admin' table
    const [existingUserRows]: [any[], any] = await connection.query(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );
    
    const existingUser = existingUserRows[0];

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Create the new user object with isAdmin and superAdmin fields
    const newUser = {
      fullName,
      email,
      phoneNumber,
      password, // Storing plain text password (not recommended for production)
      isAdmin: isAdmin || false, // Default to false if not provided
      superAdmin: superAdmin || false, // Default to false if not provided
      createdAt: new Date(),
    };

    // Insert the new user into the 'admin' table without specifying the ID
    await connection.query(
      'INSERT INTO admin (fullName, email, phoneNumber, password, isAdmin, superAdmin, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.fullName,
        newUser.email,
        newUser.phoneNumber,
        newUser.password, // Note: You should hash passwords in production
        newUser.isAdmin,
        newUser.superAdmin,
        newUser.createdAt,
      ]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
