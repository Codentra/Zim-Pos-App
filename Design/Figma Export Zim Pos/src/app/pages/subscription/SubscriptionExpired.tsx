import { useNavigate } from "react-router";
import {
  Lock,
  Calendar,
  FileText,
  Download,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function SubscriptionExpired() {
  const navigate = useNavigate();

  const expiredDate = "March 15, 2026";
  const daysExpired = 5;

  const allowedFeatures = [
    { name: "View Reports", icon: FileText, allowed: true },
    { name: "Export Data", icon: Download, allowed: true },
    { name: "View Products", icon: CheckCircle, allowed: true },
  ];

  const blockedFeatures = [
    { name: "Process New Sales", icon: XCircle, allowed: false },
    { name: "Add Products", icon: XCircle, allowed: false },
    { name: "Manage Customers", icon: XCircle, allowed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 pt-12 pb-20 text-white text-center">
        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Subscription Expired</h1>
        <p className="text-white/80">Your ZimPOS subscription has expired</p>
      </div>

      {/* Expiry Details Card */}
      <div className="px-6 -mt-16 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expired on</p>
              <p className="font-semibold text-gray-900 dark:text-white">{expiredDate}</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                  Subscription ended {daysExpired} days ago
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Renew now to continue using all ZimPOS features without interruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Can Do */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Available Features
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {allowedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* What's Blocked */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Blocked Features
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {blockedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4 opacity-50">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requires active subscription
                  </p>
                </div>
                <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Security Notice */}
      <div className="px-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">
                Your Data is Safe
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-500">
                All your business data, products, and customer information are securely
                stored. Renew to regain full access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-3 mt-auto mb-8">
        <button
          onClick={() => navigate("/subscription/plans")}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
        >
          Renew Subscription
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          View Reports
        </button>

        <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Contact Support
        </button>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6 px-6">
        Questions about your subscription?{" "}
        <button className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
          Get Help
        </button>
      </p>
    </div>
  );
}
