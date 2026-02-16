import { useNavigate } from "react-router";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Cloud,
  HardDrive,
  Database,
  Calendar,
  Clock,
} from "lucide-react";

export function SyncStatus() {
  const navigate = useNavigate();

  const syncHistory = [
    {
      date: "Today, 2:35 PM",
      status: "success",
      message: "All data synced",
      items: 45,
    },
    {
      date: "Today, 11:20 AM",
      status: "success",
      message: "Sales & inventory updated",
      items: 23,
    },
    {
      date: "Yesterday, 6:45 PM",
      status: "success",
      message: "Daily backup completed",
      items: 187,
    },
    {
      date: "Yesterday, 2:30 PM",
      status: "warning",
      message: "Partial sync - offline mode",
      items: 12,
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Sync Status</h1>
            <p className="text-emerald-100 text-sm">Data synchronization</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">All Synced</h2>
                <p className="text-emerald-100 text-sm">2 minutes ago</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">245</p>
              <p className="text-xs text-emerald-100 mt-1">Sales</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-emerald-100 mt-1">Products</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-emerald-100 mt-1">Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Storage */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Storage Usage
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Local Storage</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Device data</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">2.4 MB</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">of 50 MB</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              style={{ width: "4.8%" }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mt-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Cloud Backup</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remote storage</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">18.7 MB</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">of 500 MB</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
              style={{ width: "3.74%" }}
            />
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Recent Activity
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {syncHistory.map((item, index) => (
            <div key={index} className="px-5 py-4 flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.status === "success"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-amber-100 dark:bg-amber-900/30"
                }`}
              >
                {item.status === "success" ? (
                  <CheckCircle
                    className={`w-5 h-5 ${
                      item.status === "success"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.items} items synced
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Settings */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Sync Preferences
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Auto Sync</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">When internet available</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Daily Backup</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">At 6:00 PM</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sync Frequency</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How often to sync</p>
                </div>
              </div>
            </div>
            <select className="w-full mt-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white">
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every 30 minutes</option>
              <option>Every hour</option>
              <option>Manual only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-6 space-y-3">
        <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Sync Now
        </button>

        <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95 flex items-center justify-center gap-2">
          <HardDrive className="w-5 h-5" />
          Manual Backup
        </button>
      </div>
    </div>
  );
}