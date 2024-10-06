import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function connectToDatabase() {
  if (connection) {
    return connection;
  }

  try {
    console.log('Connecting to MySQL...');

    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,        // Hostinger MySQL host
      user: process.env.MYSQL_USER,        // Hostinger MySQL user
      password: process.env.MYSQL_PASSWORD, // Hostinger MySQL password
      database: 'u804118179_ZIRRAH',                  // Replace with your database name
    });

    console.log('Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('Failed to connect to MySQL:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (connection) {
    await connection.end();
    console.log('MySQL connection closed');
    connection = null;
  }
}
