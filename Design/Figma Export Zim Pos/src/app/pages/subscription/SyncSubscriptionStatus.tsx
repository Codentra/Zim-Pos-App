import { useNavigate } from "react-router";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Wifi,
  WifiOff,
  Calendar,
  Info,
} from "lucide-react";
import { useState } from "react";

export function SyncSubscriptionStatus() {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const subscriptionData = {
    plan: "Business Plan",
    status: "active",
    lastSync: "2 minutes ago",
    nextSync: "In 28 minutes",
    validUntil: "April 15, 2026",
    gracePeriodDays: 7,
    offlineValidationStatus: "valid",
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Subscription Status</h1>
            <p className="text-emerald-100 text-sm">Monitor your subscription sync</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-6 -mt-8 mb-6">
        {isOnline ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Online & Syncing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subscription validated successfully
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
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Offline Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Using cached subscription data
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        )}
      </div>

      {/* Subscription Details */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Active Subscription
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {subscriptionData.plan}
              </p>
            </div>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
              Active
            </span>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Valid Until</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {subscriptionData.validUntil}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Offline Validation</span>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                Valid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Sync Information
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSyncing
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-green-100 dark:bg-green-900/30"
                }`}
              >
                {isSyncing ? (
                  <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {isSyncing ? "Syncing..." : "Subscription Synced"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last sync: {subscriptionData.lastSync}
                </p>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Next Auto-Sync</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {subscriptionData.nextSync}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grace Period Info */}
      <div className="px-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-5">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">
                Grace Period Protection
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-500 mb-2">
                If your subscription expires while offline, you have a {subscriptionData.gracePeriodDays}-day grace period to sync and renew.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-500">
                <Clock className="w-4 h-4" />
                <span>
                  Your POS will continue working during this period
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Recent Sync Activity
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {[
            { time: "2 minutes ago", status: "success", message: "Subscription validated" },
            { time: "32 minutes ago", status: "success", message: "Auto-sync completed" },
            { time: "1 hour ago", status: "success", message: "Plan details updated" },
            { time: "2 hours ago", status: "warning", message: "Sync delayed (offline)" },
          ].map((log, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  log.status === "success"
                    ? "bg-green-500"
                    : log.status === "warning"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Toggle */}
      <div className="px-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Demo Controls
          </p>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Toggle {isOnline ? "Offline" : "Online"}
          </button>
        </div>
      </div>
    </div>
  );
}
