// scripts/restore-database.ts
import { pool } from '../server/db';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function restoreDatabase(backupFileName: string) {
  const backupDir = path.join(process.cwd(), 'backups');
  const backupFilePath = path.join(backupDir, backupFileName);
  
  if (!fs.existsSync(backupFilePath)) {
    console.error(`ไม่พบไฟล์สำรองข้อมูล: ${backupFilePath}`);
    process.exit(1);
  }
  
  try {
    console.log(`เริ่มการกู้คืนข้อมูลจากไฟล์: ${backupFilePath}`);
    
    // อ่านข้อมูลจากไฟล์
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    
    // ลบข้อมูลเดิมและกู้คืนข้อมูลในแต่ละตาราง
    // ต้องทำตามลำดับเพื่อรักษาความสัมพันธ์ referential integrity
    await pool.query('BEGIN'); // เริ่ม transaction
    
    try {
      // ล้างข้อมูลในตารางตามลำดับที่ถูกต้อง (ตารางลูกก่อนตารางแม่)
      console.log('ล้างข้อมูลในตารางที่มีอยู่...');
      await pool.query('DELETE FROM transactions');
      await pool.query('DELETE FROM trades');
      await pool.query('DELETE FROM bank_accounts');
      await pool.query('DELETE FROM session');
      await pool.query('DELETE FROM settings');
      await pool.query('DELETE FROM users');
      
      // กู้คืนข้อมูลในตารางตามลำดับ (ตารางแม่ก่อนตารางลูก)
      
      // กู้คืนข้อมูล users
      if (backupData.users && backupData.users.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง users (${backupData.users.length} รายการ)...`);
        for (const user of backupData.users) {
          const columns = Object.keys(user).join(', ');
          const placeholders = Object.keys(user).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(user);
          
          await pool.query(
            `INSERT INTO users (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      // กู้คืนข้อมูล settings
      if (backupData.settings && backupData.settings.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง settings (${backupData.settings.length} รายการ)...`);
        for (const setting of backupData.settings) {
          const columns = Object.keys(setting).join(', ');
          const placeholders = Object.keys(setting).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(setting);
          
          await pool.query(
            `INSERT INTO settings (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      // กู้คืนข้อมูล bank_accounts
      if (backupData.bank_accounts && backupData.bank_accounts.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง bank_accounts (${backupData.bank_accounts.length} รายการ)...`);
        for (const account of backupData.bank_accounts) {
          const columns = Object.keys(account).join(', ');
          const placeholders = Object.keys(account).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(account);
          
          await pool.query(
            `INSERT INTO bank_accounts (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      // กู้คืนข้อมูล trades
      if (backupData.trades && backupData.trades.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง trades (${backupData.trades.length} รายการ)...`);
        for (const trade of backupData.trades) {
          const columns = Object.keys(trade).join(', ');
          const placeholders = Object.keys(trade).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(trade);
          
          await pool.query(
            `INSERT INTO trades (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      // กู้คืนข้อมูล transactions
      if (backupData.transactions && backupData.transactions.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง transactions (${backupData.transactions.length} รายการ)...`);
        for (const transaction of backupData.transactions) {
          const columns = Object.keys(transaction).join(', ');
          const placeholders = Object.keys(transaction).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(transaction);
          
          await pool.query(
            `INSERT INTO transactions (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      // กู้คืนข้อมูล session (ถ้าจำเป็น)
      if (backupData.session && backupData.session.length > 0) {
        console.log(`กำลังกู้คืนข้อมูลตาราง session (${backupData.session.length} รายการ)...`);
        for (const session of backupData.session) {
          const columns = Object.keys(session).join(', ');
          const placeholders = Object.keys(session).map((_, i) => `$${i + 1}`).join(', ');
          const values = Object.values(session);
          
          await pool.query(
            `INSERT INTO session (${columns}) VALUES (${placeholders})`,
            values
          );
        }
      }
      
      await pool.query('COMMIT');
      console.log('✅ การกู้คืนข้อมูลสำเร็จ');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการกู้คืนข้อมูล:', error);
    return { success: false, error };
  } finally {
    process.exit();
  }
}

// ตรวจสอบว่ามีการระบุชื่อไฟล์หรือไม่
const fileName = process.argv[2];
if (!fileName) {
  console.error('กรุณาระบุชื่อไฟล์สำรองข้อมูล เช่น: npx tsx scripts/restore-database.ts backup-2023-05-09.json');
  process.exit(1);
}

// เรียกใช้ฟังก์ชัน
restoreDatabase(fileName);