// scripts/backup-database.ts
import { pool } from '../server/db';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function backupDatabase() {
  const backupDir = path.join(process.cwd(), 'backups');
  
  // สร้างโฟลเดอร์ backups ถ้ายังไม่มี
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  try {
    console.log('เริ่มการสำรองข้อมูล...');
    
    // สร้างชื่อไฟล์ที่มีรหัสเวลา
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);
    
    // ดึงข้อมูลจากตารางทั้งหมด
    const tables = ['users', 'bank_accounts', 'trades', 'transactions', 'settings', 'session'];
    const backup: Record<string, any[]> = {};
    
    for (const table of tables) {
      console.log(`กำลังสำรองข้อมูลตาราง ${table}...`);
      const result = await pool.query(`SELECT * FROM ${table}`);
      backup[table] = result.rows;
    }
    
    // เขียนข้อมูลลงในไฟล์
    fs.writeFileSync(backupFilePath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ การสำรองข้อมูลสำเร็จ: ${backupFilePath}`);
    
    // เก็บรายการไฟล์สำรองลงในตาราง settings
    const backupsList = fs.readdirSync(backupDir).filter(file => file.startsWith('backup-'));
    await pool.query(
      `INSERT INTO settings (key, value) 
       VALUES ('backups_list', $1) 
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(backupsList)]
    );
    
    return { success: true, filePath: backupFilePath };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสำรองข้อมูล:', error);
    return { success: false, error };
  } finally {
    process.exit();
  }
}

// เรียกใช้ฟังก์ชัน
backupDatabase();