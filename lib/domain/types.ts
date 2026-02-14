/**
 * Domain types. Money in integer cents.
 */
export type Role = "OWNER" | "MANAGER" | "CASHIER";

export interface User {
  id: string;
  name: string;
  role: Role;
  pinHash: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}

export type SyncStatus = "PENDING" | "SYNCED" | "FAILED";

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  priceCents: number;
  costCents: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}

export interface SaleTotals {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
}

export type PaymentMethod = "CASH" | "ECOCASH" | "ONEMONEY" | "ZIPIT" | "SPLIT";

export interface Transaction {
  id: string;
  receiptNo: number;
  timestamp: number;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  paymentMethod: PaymentMethod;
  amountTenderedCents: number;
  changeGivenCents: number;
  customerId: string | null;
  cashierUserId: string;
  isRefund: number;
  originalTransactionId: string | null;
  notes: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface CashShift {
  id: string;
  openedAt: number;
  closedAt: number | null;
  openingFloatCents: number;
  expectedCashCents: number | null;
  actualCashCents: number | null;
  varianceCents: number | null;
  openedByUserId: string;
  closedByUserId: string | null;
  managerApprovalUserId: string | null;
  notes: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}

export type ActivityLogType =
  | "SALE"
  | "REFUND"
  | "CASH"
  | "STOCK"
  | "PRICE_CHANGE"
  | "APPROVAL"
  | "SYNC";

export interface ActivityLog {
  id: string;
  type: ActivityLogType;
  action: string;
  details: string;
  userId: string;
  managerUserId: string | null;
  timestamp: number;
}

export interface StockReceipt {
  id: string;
  receivedAt: number;
  supplierName: string;
  totalCostCents: number;
  receivedByUserId: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}

export interface StockReceiptItem {
  id: string;
  stockReceiptId: string;
  productId: string;
  quantity: number;
  unitCostCents: number;
  lineTotalCents: number;
}
