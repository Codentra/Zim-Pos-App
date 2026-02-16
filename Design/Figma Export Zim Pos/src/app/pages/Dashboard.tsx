import { useNavigate } from "react-router";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Settings,
  DollarSign,
  RotateCcw,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { DashboardTile } from "../components/DashboardTile";
import { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const [isOnline] = useState(false); // Simulate offline mode

  const todaySales = {
    total: 12450.0,
    transactions: 48,
    cash: 5200.0,
    ecocash: 4850.0,
    onemoney: 2400.0,
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">ZimPOS</h1>
            <p className="text-emerald-100 text-sm">Welcome back, Tafadzwa</p>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          <StatusBadge
            icon={isOnline ? Wifi : WifiOff}
            label={isOnline ? "Online" : "Offline Mode"}
            variant={isOnline ? "success" : "warning"}
          />
          <StatusBadge
            icon={RefreshCw}
            label="Synced 2 min ago"
            variant="neutral"
          />
        </div>
      </div>

      {/* Today's Summary */}
      <div className="px-6 -mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Sales</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${todaySales.total.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {todaySales.transactions}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Cash</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${todaySales.cash.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">EcoCash</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${todaySales.ecocash.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">OneMoney</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${todaySales.onemoney.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <DashboardTile
            icon={ShoppingCart}
            label="New Sale"
            onClick={() => navigate("/new-sale")}
            variant="primary"
          />
          <DashboardTile
            icon={Package}
            label="Products"
            onClick={() => navigate("/products")}
            badge="125"
          />
          <DashboardTile
            icon={TrendingUp}
            label="Reports"
            onClick={() => navigate("/reports")}
          />
          <DashboardTile
            icon={Users}
            label="Customers"
            onClick={() => {}}
            badge="New"
          />
          <DashboardTile
            icon={DollarSign}
            label="Cash Drawer"
            onClick={() => navigate("/cash-management")}
          />
          <DashboardTile
            icon={RotateCcw}
            label="Refunds"
            onClick={() => navigate("/refunds")}
          />
        </div>
      </div>
    </div>
  );
}