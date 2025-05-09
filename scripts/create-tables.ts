// scripts/create-tables.ts
import { pool } from '../server/db';
import * as schema from '../shared/schema';
import 'dotenv/config';

async function createTables() {
  try {
    console.log('Creating tables...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        balance TEXT NOT NULL DEFAULT '0',
        display_name TEXT,
        phone_number TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');
    
    // Create bank_accounts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        bank_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        account_name TEXT NOT NULL,
        is_default BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bank accounts table created');
    
    // Create trades table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        crypto_id TEXT NOT NULL,
        amount TEXT NOT NULL,
        direction TEXT NOT NULL,
        entry_price TEXT NOT NULL,
        duration TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP,
        result TEXT,
        predetermined_result TEXT
      );
    `);
    console.log('✅ Trades table created');
    
    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount TEXT NOT NULL,
        fee TEXT,
        method TEXT NOT NULL,
        bank_name TEXT,
        bank_account TEXT,
        account_name TEXT,
        bank_account_id INTEGER REFERENCES bank_accounts(id),
        status TEXT NOT NULL DEFAULT 'pending',
        payment_proof TEXT,
        note TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Transactions table created');
    
    // Create settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Settings table created');
    
    // Create session table for PostgreSQL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
    `);
    console.log('✅ Session table created');
    
    console.log('All tables have been created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    process.exit();
  }
}

// Run the script
createTables();