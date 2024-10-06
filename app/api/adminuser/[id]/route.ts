import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql'; // Assuming MySQL connection
import { ResultSetHeader } from 'mysql2'; // Import ResultSetHeader for typing

// PATCH: Update user's isAdmin field
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { isAdmin } = await req.json(); // Expect { isAdmin: boolean } in the body

  if (!id) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    
    // Update the user's isAdmin field in the MySQL database
    const [result] = await connection.execute<ResultSetHeader>(
      'UPDATE admin SET isAdmin = ? WHERE id = ?',
      [isAdmin, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user', error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Delete a user by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    
    // Delete the user from the MySQL database
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM admin WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user', error: (error as Error).message }, { status: 500 });
  }
}
