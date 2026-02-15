/**
 * Subscription repository. CRUD for subscriptions.
 */
import { getDb } from "../db";
import type { Subscription } from "@/lib/domain/types";
import type { PlanId } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

const TRIAL_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export async function getSubscriptionByBusinessId(businessId: string): Promise<Subscription | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    businessId: string;
    planId: string;
    status: string;
    trialStartAt: number | null;
    trialEndAt: number | null;
    currentPeriodStart: number | null;
    currentPeriodEnd: number | null;
    userLimit: number;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, businessId, planId, status, trialStartAt, trialEndAt, currentPeriodStart, currentPeriodEnd, userLimit, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM subscriptions WHERE businessId = ? AND deleted = 0 ORDER BY createdAt DESC LIMIT 1",
    businessId
  );
  if (!row) return null;
  return {
    ...row,
    planId: row.planId as PlanId,
    status: row.status as Subscription["status"],
    syncStatus: row.syncStatus as Subscription["syncStatus"],
  };
}

export async function createTrialSubscription(businessId: string, userLimit: number): Promise<Subscription> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  const trialEndAt = now + TRIAL_DAYS_MS;
  await db.runAsync(
    `INSERT INTO subscriptions (id, businessId, planId, status, trialStartAt, trialEndAt, userLimit, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    businessId,
    "TRIAL",
    "TRIAL",
    now,
    trialEndAt,
    userLimit,
    now,
    now,
    "PENDING",
    null,
    0
  );
  const created = await getSubscriptionByBusinessId(businessId);
  if (!created) throw new Error("Failed to create subscription");
  return created;
}

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export async function createPaidSubscription(
  businessId: string,
  planId: PlanId,
  userLimit: number
): Promise<Subscription> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  const periodEnd = now + MONTH_MS;
  await db.runAsync(
    `INSERT INTO subscriptions (id, businessId, planId, status, trialStartAt, trialEndAt, currentPeriodStart, currentPeriodEnd, userLimit, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, 'PENDING', NULL, 0)`,
    id,
    businessId,
    planId,
    "ACTIVE",
    now,
    periodEnd,
    userLimit,
    now,
    now
  );
  const created = await getSubscriptionByBusinessId(businessId);
  if (!created) throw new Error("Failed to create subscription");
  return created;
}
