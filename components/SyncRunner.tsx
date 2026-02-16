/**
 * Runs sync to Convex when app is in foreground and Convex is configured.
 * Uses current businessId from BusinessContext.
 */
import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useConvex } from "convex/react";
import { useBusiness } from "@/contexts/BusinessContext";
import { isConvexConfigured } from "@/lib/sync/syncService";
import { runSyncToConvex } from "@/lib/sync/syncToConvex";

const SYNC_INTERVAL_MS = 60 * 1000; // 1 minute when app is in foreground

export function SyncRunner() {
  const convex = useConvex();
  const { businessId } = useBusiness();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSync = useCallback(async () => {
    if (!isConvexConfigured() || !convex || !businessId) return;
    await runSyncToConvex(convex, businessId);
  }, [convex, businessId]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        runSync();
        intervalRef.current = setInterval(runSync, SYNC_INTERVAL_MS);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    });
    if (AppState.currentState === "active") {
      runSync();
      intervalRef.current = setInterval(runSync, SYNC_INTERVAL_MS);
    }
    return () => {
      sub.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [runSync]);

  return null;
}
