/**
 * SQLite migrations. PRAGMA user_version for versioning.
 */
import * as SQLite from "expo-sqlite";

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

  if (user_version < 3) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ownerName TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        country TEXT NOT NULL DEFAULT '',
        city TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        businessId TEXT NOT NULL,
        planId TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'TRIAL',
        trialStartAt INTEGER,
        trialEndAt INTEGER,
        currentPeriodStart INTEGER,
        currentPeriodEnd INTEGER,
        userLimit INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );
    `);
    await database.runAsync("PRAGMA user_version = 3");
  }

  if (user_version < 4) {
    const hasBusinesses = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM businesses WHERE deleted = 0"
    );
    const hasUsers = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM users WHERE deleted = 0"
    );
    if (hasUsers && hasUsers.count > 0 && (!hasBusinesses || hasBusinesses.count === 0)) {
      const { generateUUID } = await import("@/lib/utils/uuid");
      const now = Date.now();
      const bizId = generateUUID();
      const subId = generateUUID();
      const trialEnd = now + 14 * 24 * 60 * 60 * 1000;
      await database.runAsync(
        `INSERT INTO businesses (id, name, ownerName, phone, email, country, city, createdAt, updatedAt, syncStatus, convexId, deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        bizId, "My Business", "Owner", "", "", "Zimbabwe", "", now, now, "PENDING", null, 0
      );
      await database.runAsync(
        `INSERT INTO subscriptions (id, businessId, planId, status, trialStartAt, trialEndAt, userLimit, createdAt, updatedAt, syncStatus, convexId, deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        subId, bizId, "TRIAL", "TRIAL", now, trialEnd, 6, now, now, "PENDING", null, 0
      );
      await database.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
        "businessId", bizId
      );
      await database.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
        "onboarded", "1"
      );
    }
    await database.runAsync("PRAGMA user_version = 4");
  }

  if (user_version < 5) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        location TEXT NOT NULL DEFAULT '',
        creditLimitCents INTEGER NOT NULL DEFAULT 0,
        creditBalanceCents INTEGER NOT NULL DEFAULT 0,
        isVip INTEGER NOT NULL DEFAULT 0,
        notes TEXT NOT NULL DEFAULT '',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'PENDING',
        convexId TEXT,
        deleted INTEGER NOT NULL DEFAULT 0,
        lastError TEXT
      );
    `);
    await database.runAsync("PRAGMA user_version = 5");
  }

  if (user_version < 6) {
    try {
      await database.runAsync("ALTER TABLE users ADD COLUMN email TEXT DEFAULT ''");
    } catch {}
    try {
      await database.runAsync("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''");
    } catch {}
    try {
      await database.runAsync("ALTER TABLE users ADD COLUMN location TEXT DEFAULT ''");
    } catch {}
    await database.runAsync("PRAGMA user_version = 6");
  }

  if (user_version < 7) {
    try {
      await database.runAsync("ALTER TABLE businesses ADD COLUMN address TEXT DEFAULT ''");
    } catch {}
    try {
      await database.runAsync("ALTER TABLE businesses ADD COLUMN website TEXT DEFAULT ''");
    } catch {}
    try {
      await database.runAsync("ALTER TABLE businesses ADD COLUMN taxNumber TEXT DEFAULT ''");
    } catch {}
    await database.runAsync("PRAGMA user_version = 7");
  }

  if (user_version < 8) {
    try {
      await database.runAsync("ALTER TABLE activity_logs ADD COLUMN syncStatus TEXT NOT NULL DEFAULT 'PENDING'");
    } catch {}
    await database.runAsync("PRAGMA user_version = 8");
  }

  if (user_version < 9) {
    try {
      await database.runAsync("ALTER TABLE users ADD COLUMN pinSalt TEXT");
    } catch {}
    await database.runAsync("PRAGMA user_version = 9");
  }

  if (user_version < 10) {
    try {
      await database.runAsync("ALTER TABLE businesses ADD COLUMN baseCurrency TEXT DEFAULT 'USD'");
    } catch {}
    try {
      await database.runAsync("ALTER TABLE transactions ADD COLUMN currency TEXT");
    } catch {}
    await database.runAsync("PRAGMA user_version = 10");
  }
}
