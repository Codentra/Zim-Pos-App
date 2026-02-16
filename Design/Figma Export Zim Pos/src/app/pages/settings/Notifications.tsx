import { useNavigate } from "react-router";
import { ArrowLeft, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export function Notifications() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    salesAlerts: true,
    lowStock: true,
    cashDrawer: true,
    dailyReports: false,
    sound: true,
    vibration: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

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
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-emerald-100 text-sm">Manage alerts & sounds</p>
          </div>
        </div>
      </div>

      {/* Master Control */}
      <div className="px-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">All Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Master control</p>
              </div>
            </div>
            <label className="relative inline-block w-14 h-7">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Business Alerts */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Business Alerts
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Sales Completed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alert when a sale is made</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.salesAlerts}
                onChange={() => toggleSetting("salesAlerts")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Low Stock Warnings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">When inventory is low</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.lowStock}
                onChange={() => toggleSetting("lowStock")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Cash Drawer Events</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open/close notifications</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.cashDrawer}
                onChange={() => toggleSetting("cashDrawer")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Daily Reports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">End-of-day summary</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.dailyReports}
                onChange={() => toggleSetting("dailyReports")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Sound & Haptics */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Sound & Haptics
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.sound ? (
                <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Sound Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for events</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.sound}
                onChange={() => toggleSetting("sound")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Vibration</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Haptic feedback</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.vibration}
                onChange={() => toggleSetting("vibration")}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Quiet Hours
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BellOff className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Do Not Disturb</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Silence notifications</p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                From
              </label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Until
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
