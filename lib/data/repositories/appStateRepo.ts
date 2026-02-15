/**
 * App state (businessId, onboarded) stored in app_meta.
 */
import { getDb } from "../db";

const KEY_BUSINESS_ID = "businessId";
const KEY_ONBOARDED = "onboarded";

export async function getBusinessId(): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string | null }>(
    "SELECT value FROM app_meta WHERE key = ?",
    KEY_BUSINESS_ID
  );
  return row?.value ?? null;
}

export async function setBusinessId(businessId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    KEY_BUSINESS_ID,
    businessId
  );
}

export async function isOnboarded(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string | null }>(
    "SELECT value FROM app_meta WHERE key = ?",
    KEY_ONBOARDED
  );
  return row?.value === "1";
}

export async function setOnboarded(onboarded: boolean): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    KEY_ONBOARDED,
    onboarded ? "1" : "0"
  );
}
