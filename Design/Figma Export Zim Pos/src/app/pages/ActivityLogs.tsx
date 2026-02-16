import { useNavigate } from "react-router";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  User,
  Package,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  Filter,
} from "lucide-react";
import { useState } from "react";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: "sale" | "refund" | "price_change" | "product_edit" | "user_action" | "cash" | "system";
  details: string;
  amount?: number;
  requiresApproval?: boolean;
}

export function ActivityLogs() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<"all" | ActivityLog["type"]>("all");

  // Mock activity logs
  const logs: ActivityLog[] = [
    {
      id: "1",
      timestamp: "Today, 3:45 PM",
      user: "Tendai (Cashier)",
      action: "Completed Sale",
      type: "sale",
      details: "Receipt #1045 • 5 items • EcoCash",
      amount: 24.50,
    },
    {
      id: "2",
      timestamp: "Today, 3:20 PM",
      user: "Grace (Manager)",
      action: "Approved Refund",
      type: "refund",
      details: "Receipt #1042 • Coca Cola 500ml",
      amount: -1.50,
      requiresApproval: true,
    },
    {
      id: "3",
      timestamp: "Today, 2:15 PM",
      user: "Tendai (Cashier)",
      action: "Price Changed",
      type: "price_change",
      details: "Bread - White: $0.80 → $0.85",
      requiresApproval: true,
    },
    {
      id: "4",
      timestamp: "Today, 1:30 PM",
      user: "System",
      action: "Low Stock Alert",
      type: "system",
      details: "Milk 1L • Only 8 remaining",
    },
    {
      id: "5",
      timestamp: "Today, 12:00 PM",
      user: "Grace (Manager)",
      action: "Closed Cash Drawer",
      type: "cash",
      details: "Shift end • Expected: $450.00, Actual: $448.50",
      amount: -1.50,
    },
    {
      id: "6",
      timestamp: "Today, 11:45 AM",
      user: "Tendai (Cashier)",
      action: "Added Product",
      type: "product_edit",
      details: "Cooking Oil 2L • Stock: 20 • Price: $5.50",
    },
    {
      id: "7",
      timestamp: "Today, 9:00 AM",
      user: "Grace (Manager)",
      action: "Opened Cash Drawer",
      type: "cash",
      details: "Shift start • Opening balance: $100.00",
      amount: 100.00,
    },
    {
      id: "8",
      timestamp: "Yesterday, 5:30 PM",
      user: "Blessing (Cashier)",
      action: "Manual Sync",
      type: "system",
      details: "Synced 25 transactions to server",
    },
  ];

  const filteredLogs = logs.filter(
    (log) => filterType === "all" || log.type === filterType
  );

  const getIconForType = (type: ActivityLog["type"]) => {
    switch (type) {
      case "sale":
        return <DollarSign className="w-5 h-5" />;
      case "refund":
        return <RefreshCw className="w-5 h-5" />;
      case "price_change":
        return <Edit className="w-5 h-5" />;
      case "product_edit":
        return <Package className="w-5 h-5" />;
      case "user_action":
        return <User className="w-5 h-5" />;
      case "cash":
        return <DollarSign className="w-5 h-5" />;
      case "system":
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: ActivityLog["type"]) => {
    switch (type) {
      case "sale":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "refund":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "price_change":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "product_edit":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "user_action":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "cash":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
      case "system":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
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
              <h1 className="text-2xl font-bold">Activity Logs</h1>
              <p className="text-emerald-100 text-sm">Full audit trail of all actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-8 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 text-center">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Logs</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 text-center">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Users</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 text-center">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Approvals</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setFilterType("all")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                filterType === "all"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("sale")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                filterType === "sale"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setFilterType("refund")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                filterType === "refund"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Refunds
            </button>
            <button
              onClick={() => setFilterType("cash")}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                filterType === "cash"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Cash
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-6">
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorForType(log.type)}`}>
                  {getIconForType(log.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {log.action}
                    </h4>
                    {log.amount !== undefined && (
                      <span
                        className={`text-sm font-bold ${
                          log.amount < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {log.amount < 0 ? "" : "+"}${Math.abs(log.amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.user}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                    {log.requiresApproval && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-semibold">
                          Manager Approved
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
