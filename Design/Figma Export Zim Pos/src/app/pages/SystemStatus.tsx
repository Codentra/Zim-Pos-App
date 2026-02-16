import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Server,
  Battery,
  Printer,
} from "lucide-react";
import { useState } from "react";

export function SystemStatus() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"success" | "failed" | "pending">("success");

  // Mock system status
  const systemStatus = {
    lastSync: "2 minutes ago",
    pendingTransactions: 3,
    offlineSince: null,
    battery: 85,
    printer: "connected",
    localDbSize: "2.4 MB",
    syncConflicts: 0,
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">System Status</h1>
              <p className="text-emerald-100 text-sm">Connectivity & sync monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity Status Banner */}
      <div className="px-6 -mt-8 mb-6">
        {isOnline ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Online & Connected
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All systems operational
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-amber-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <WifiOff className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Offline Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Working offline • {systemStatus.pendingTransactions} pending sync
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        )}
      </div>

      {/* Sync Status */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Sync Status
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSyncing
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : syncStatus === "success"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                {isSyncing ? (
                  <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : syncStatus === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {isSyncing
                    ? "Syncing..."
                    : syncStatus === "success"
                    ? "All Synced"
                    : "Sync Failed"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last sync: {systemStatus.lastSync}
                </p>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sync Now
            </button>
          </div>

          {systemStatus.pendingTransactions > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pending transactions
                </span>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold">
                  {systemStatus.pendingTransactions}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          System Health
        </h3>
        <div className="space-y-3">
          {/* Battery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery
                  className={`w-5 h-5 ${
                    systemStatus.battery > 50
                      ? "text-green-600 dark:text-green-400"
                      : systemStatus.battery > 20
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
                <span className="font-medium text-gray-900 dark:text-white">Battery</span>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {systemStatus.battery}%
              </span>
            </div>
          </div>

          {/* Printer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Printer</span>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                {systemStatus.printer}
              </span>
            </div>
          </div>

          {/* Local Database */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Local Database
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {systemStatus.localDbSize}
              </span>
            </div>
          </div>

          {/* Server Connection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Server Connection
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isOnline
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                {isOnline ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error States (if any) */}
      {syncStatus === "failed" && (
        <div className="px-6 mb-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5">
            <div className="flex gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-400 mb-1">
                  Sync Failed
                </h4>
                <p className="text-sm text-red-700 dark:text-red-500 mb-3">
                  Unable to sync with server. Your data is safe locally. Will retry
                  automatically.
                </p>
                <button
                  onClick={handleManualSync}
                  className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Battery Warning */}
      {systemStatus.battery < 20 && (
        <div className="px-6 mb-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-400 mb-1">
                  Low Battery Warning
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-500">
                  Battery at {systemStatus.battery}%. Please charge your device to avoid
                  interruption during sales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Toggle */}
      <div className="px-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Demo Controls
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Toggle {isOnline ? "Offline" : "Online"}
            </button>
            <button
              onClick={() => setSyncStatus(syncStatus === "failed" ? "success" : "failed")}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Toggle Sync Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
