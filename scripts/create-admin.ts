// scripts/create-admin.ts
import { pool } from '../server/db';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import 'dotenv/config';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const username = 'admin';
    const password = 'admin123';
    const email = 'admin@example.com';
    const fullName = 'System Administrator';
    const role = 'admin';

    // Check if admin already exists
    const existingResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existingResult.rows.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (username, password, email, full_name, role, balance)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, full_name, role, balance`,
      [username, hashedPassword, email, fullName, role, '10000']
    );
    
    console.log('✅ Admin user created:');
    console.log(result.rows[0]);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

// Run the script
createAdmin();