/**
 * SQLite migrations. PRAGMA user_version for versioning.
 */
import * as SQLite from "expo-sqlite";
import { DEFAULT_PIN } from "@/constants/auth";
import { generateUUID } from "@/lib/utils/uuid";

export async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const { user_version } = (await database.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  )) ?? { user_version: 0 };

  if (user_version < 1) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        pinHash TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        sku TEXT NOT NULL DEFAULT '',
        barcode TEXT NOT NULL DEFAULT '',
        priceCents INTEGER NOT NULL,
        costCents INTEGER NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        lowStockThreshold INTEGER NOT NULL DEFAULT 0,
        description TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    await database.runAsync("PRAGMA user_version = 1");

    const count = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM users"
    );
    if (count && count.count === 0) {
      const id = generateUUID();
      const now = Date.now();
      await database.runAsync(
        `INSERT INTO users (id, name, role, pinHash, createdAt, updatedAt, syncStatus, convexId, deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        "Owner",
        "OWNER",
        DEFAULT_PIN,
        now,
        now,
        "PENDING",
        null,
        0
      );
    }
  }

  if (user_version < 2) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        receiptNo INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        subtotalCents INTEGER NOT NULL,
        discountCents INTEGER NOT NULL,
        taxCents INTEGER NOT NULL,
        totalCents INTEGER NOT NULL,
        paymentMethod TEXT NOT NULL,
        amountTenderedCents INTEGER NOT NULL,
        changeGivenCents INTEGER NOT NULL,
        customerId TEXT,
        cashierUserId TEXT NOT NULL,
        isRefund INTEGER NOT NULL DEFAULT 0,
        originalTransactionId TEXT,
        notes TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS transaction_items (
        id TEXT PRIMARY KEY,
        transactionId TEXT NOT NULL,
        productId TEXT NOT NULL,
        nameSnapshot TEXT NOT NULL,
        unitPriceCents INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        lineTotalCents INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL DEFAULT '',
        userId TEXT NOT NULL,
        managerUserId TEXT,
        timestamp INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cash_shifts (
        id TEXT PRIMARY KEY,
        openedAt INTEGER NOT NULL,
        closedAt INTEGER,
        openingFloatCents INTEGER NOT NULL,
        expectedCashCents INTEGER,
        actualCashCents INTEGER,
        varianceCents INTEGER,
        openedByUserId TEXT NOT NULL,
        closedByUserId TEXT,
        managerApprovalUserId TEXT,
        notes TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS stock_receipts (
        id TEXT PRIMARY KEY,
        receivedAt INTEGER NOT NULL,
        supplierName TEXT NOT NULL DEFAULT '',
        totalCostCents INTEGER NOT NULL,
        receivedByUserId TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS stock_receipt_items (
        id TEXT PRIMARY KEY,
        stockReceiptId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitCostCents INTEGER NOT NULL,
        lineTotalCents INTEGER NOT NULL
      );
    `);
    await database.runAsync("PRAGMA user_version = 2");
  }
}
