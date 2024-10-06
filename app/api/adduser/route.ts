import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { differenceInMonths } from 'date-fns'; // A library to help with date manipulation

function sanitizeInput(value: any) {
  return value === undefined ? null : value;
}

export async function POST(req: Request) {
  let connection;
  try {
    const {
      name, nidNumber, phoneNumber, email, bloodGroup, city, region, village,
      dateOfLastDonation, numberOfTimes, studyDepartment, semester, session,
      rollNumber, regiNumber, policeStation, shouldUpdate
    } = await req.json();

    // Establish connection to the database
    connection = await connectToDatabase();

    // Parse the date of last donation
    const parsedDateOfLastDonation = new Date(dateOfLastDonation);
    const today = new Date();

    // Calculate the difference in months between today and the date of last donation
    const monthsSinceLastDonation = differenceInMonths(today, parsedDateOfLastDonation);

    // Determine donor availability based on the 4-month rule
    const availableDonar = monthsSinceLastDonation >= 4 ? 'available' : 'not available';

    // Check if the phone number already exists in the database
    const [existingUser] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM bloodgroup WHERE phoneNumber = ?',
      [sanitizeInput(phoneNumber)]
    );

    // Handle conflict if the phone number exists and shouldUpdate is not true
    if (existingUser.length > 0 && !shouldUpdate) {
      return NextResponse.json({
        message: `Phone number ${phoneNumber} already exists. Do you want to update the existing record?`,
        existingUser: existingUser[0],
        shouldUpdateRequired: true
      }, { status: 409 });
    }

    // Handle updating the existing user record
    if (existingUser.length > 0 && shouldUpdate) {
      const [updateResult] = await connection.execute<ResultSetHeader>(
        `UPDATE bloodgroup SET 
          name = ?, nidNumber = ?, email = ?, bloodGroup = ?, city = ?, region = ?, village = ?, 
          dateOfLastDonation = ?, numberOfTimes = ?, studyDepartment = ?, semester = ?, session = ?, 
          rollNumber = ?, regiNumber = ?, policeStation = ?, availableDonar = ?
        WHERE phoneNumber = ?`,
        [
          sanitizeInput(name), sanitizeInput(nidNumber), sanitizeInput(email), sanitizeInput(bloodGroup),
          sanitizeInput(city), sanitizeInput(region), sanitizeInput(village), sanitizeInput(dateOfLastDonation),
          sanitizeInput(numberOfTimes), sanitizeInput(studyDepartment), sanitizeInput(semester), sanitizeInput(session),
          sanitizeInput(rollNumber), sanitizeInput(regiNumber), sanitizeInput(policeStation), availableDonar,
          sanitizeInput(phoneNumber)
        ]
      );

      if (updateResult.affectedRows > 0) {
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'No changes were made' }, { status: 400 });
      }
    }

    // Insert a new user record
    const [insertResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO bloodgroup (
        name, nidNumber, phoneNumber, email, bloodGroup, city, region, village, 
        dateOfLastDonation, numberOfTimes, studyDepartment, semester, session, rollNumber, 
        regiNumber, policeStation, availableDonar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizeInput(name), sanitizeInput(nidNumber), sanitizeInput(phoneNumber), sanitizeInput(email),
        sanitizeInput(bloodGroup), sanitizeInput(city), sanitizeInput(region), sanitizeInput(village),
        sanitizeInput(dateOfLastDonation), sanitizeInput(numberOfTimes), sanitizeInput(studyDepartment),
        sanitizeInput(semester), sanitizeInput(session), sanitizeInput(rollNumber), sanitizeInput(regiNumber),
        sanitizeInput(policeStation), availableDonar
      ]
    );

    if (insertResult.affectedRows > 0) {
      return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Failed to add user' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in user API:', error.message);
      return NextResponse.json({
        message: 'Internal server error',
        error: error.message,
        stack: error.stack,
      }, { status: 500 });
    }
  }
}
