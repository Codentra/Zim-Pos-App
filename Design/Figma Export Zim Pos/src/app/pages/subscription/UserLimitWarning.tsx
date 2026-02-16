import { useNavigate } from "react-router";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Check,
  ArrowRight,
  Settings,
} from "lucide-react";

export function UserLimitWarning() {
  const navigate = useNavigate();

  const currentPlan = {
    name: "Starter Plan",
    userLimit: 6,
    currentUsers: 6,
  };

  const suggestedPlan = {
    name: "Business Plan",
    userLimit: 10,
    price: 100,
    features: [
      "Up to 10 users",
      "Advanced analytics",
      "Customer credit tracking",
      "Priority support",
      "WhatsApp integration",
    ],
  };

  const activeUsers = [
    { name: "Tendai Moyo", role: "Owner", email: "tendai@business.com" },
    { name: "Grace Ndlovu", role: "Manager", email: "grace@business.com" },
    { name: "Blessing Chipo", role: "Cashier", email: "blessing@business.com" },
    { name: "Tinashe Mpofu", role: "Cashier", email: "tinashe@business.com" },
    { name: "Sharon Dube", role: "Cashier", email: "sharon@business.com" },
    { name: "John Sibanda", role: "Cashier", email: "john@business.com" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 pt-12 pb-16 text-white">
        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">User Limit Reached</h1>
        <p className="text-white/80 text-center">
          You've reached your plan's user limit
        </p>
      </div>

      {/* Current Usage Card */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {currentPlan.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {currentPlan.currentUsers} / {currentPlan.userLimit}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full"
                style={{
                  width: `${(currentPlan.currentUsers / currentPlan.userLimit) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                  Cannot Add More Users
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Upgrade to Business Plan to add more team members or remove existing
                  users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Suggestion */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Recommended Upgrade
        </h3>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{suggestedPlan.name}</h3>
              <p className="text-white/80 text-sm">Perfect for growing teams</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${suggestedPlan.price}</p>
              <p className="text-white/80 text-sm">/month</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {suggestedPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/subscription/plans")}
            className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Current Users List */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Active Users ({activeUsers.length})
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {activeUsers.map((user, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <button
          onClick={() => navigate("/settings/user-profile")}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Manage Users
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full text-gray-600 dark:text-gray-400 py-3 rounded-xl font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
