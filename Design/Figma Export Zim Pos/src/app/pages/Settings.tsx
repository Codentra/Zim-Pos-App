import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Shield,
  RefreshCw,
  Printer,
  Bell,
  HardDrive,
  LogOut,
  ChevronRight,
  Check,
  WifiOff,
  Moon,
  Sun,
  Activity,
  Wifi,
  Settings as SettingsIcon,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "User Profile", value: "Tafadzwa M.", path: "/settings/user-profile" },
        { icon: Shield, label: "Security & PIN", value: "Change PIN", path: "/settings/security-pin" },
        { icon: Bell, label: "Notifications", value: "Enabled", path: "/settings/notifications" },
      ],
    },
    {
      title: "Business",
      items: [
        { icon: HardDrive, label: "Business Details", value: "Update", path: "/settings/business-details" },
        { icon: Printer, label: "Receipt Settings", value: "Configure", path: "/settings/receipt-settings" },
      ],
    },
    {
      title: "System & Hardware",
      items: [
        { icon: Wifi, label: "System Status", value: "Online", status: "success", path: "/system-status" },
        { icon: Activity, label: "Activity Logs", value: "View audit trail", path: "/activity-logs" },
        { icon: SettingsIcon, label: "Hardware Setup", value: "Printer & Scanner", path: "/hardware-setup" },
      ],
    },
    {
      title: "Data & Sync",
      items: [
        { icon: RefreshCw, label: "Sync Status", value: "2 min ago", status: "success", path: "/settings/sync-status" },
        { icon: HardDrive, label: "Backup Data", value: "Manual backup" },
        { icon: WifiOff, label: "Offline Mode", value: "Active", status: "warning" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-emerald-100 text-sm">Manage your POS</p>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              T
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tafadzwa Moyo</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admin • Cashier</p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === "dark" ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="px-6 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {group.title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.value}</p>
                    </div>
                    {item.status && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "success"
                            ? "bg-emerald-500"
                            : item.status === "warning"
                            ? "bg-amber-500"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="px-6 mt-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">ZimPOS Version 1.0.2</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: Feb 10, 2026
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-6">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 py-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}