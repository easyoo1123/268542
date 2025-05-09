import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  balance: text("balance").notNull().default("0"), // กำหนดค่า default เป็น 0 บาท
  displayName: text("display_name"),
  phoneNumber: text("phone_number"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// สร้างตาราง bankAccounts สำหรับเก็บข้อมูลบัญชีธนาคารที่ผู้ใช้ผูกไว้
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountName: text("account_name").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptoId: text("crypto_id").notNull(),
  amount: text("amount").notNull(),
  direction: text("direction").notNull(), // 'up' or 'down'
  entryPrice: text("entry_price").notNull(),
  duration: text("duration").notNull(), // '60S', '120S', '300S'
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  result: text("result"),
  predeterminedResult: text("predetermined_result"), // 'win' or 'lose' or null for normal behavior
});

// สร้างตาราง transactions สำหรับเก็บประวัติการฝากถอนเงิน
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "deposit" หรือ "withdraw"
  amount: text("amount").notNull(),
  fee: text("fee"), // ค่าธรรมเนียม (สำหรับการถอนเงิน)
  method: text("method").notNull(), // "bank" หรือ "promptpay"
  bankName: text("bank_name"),
  bankAccount: text("bank_account"),
  accountName: text("account_name"), // ชื่อบัญชี
  bankAccountId: integer("bank_account_id").references(() => bankAccounts.id), // อ้างอิงบัญชีที่ผูกไว้
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  paymentProof: text("payment_proof"), // เก็บ Base64 ของรูปภาพสลิป
  note: text("note"), // สำหรับแอดมินใส่หมายเหตุ
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  // ไม่รวม balance เพราะจะใช้ค่า default จากสคีมา
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).pick({
  userId: true,
  bankName: true,
  accountNumber: true,
  accountName: true,
  isDefault: true,
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  userId: true,
  cryptoId: true,
  amount: true,
  direction: true,
  entryPrice: true,
  duration: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  fee: true,
  method: true,
  bankName: true,
  bankAccount: true,
  accountName: true,
  bankAccountId: true,
  paymentProof: true,
  note: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

// สร้างตาราง settings สำหรับเก็บการตั้งค่าระบบ
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// สร้าง schema สำหรับเพิ่มหรือแก้ไขการตั้งค่า
export const insertSettingSchema = createInsertSchema(settings).pick({
  key: true,
  value: true
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

// Crypto types (not stored in database, comes from API)
export type CryptoCurrency = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
};
