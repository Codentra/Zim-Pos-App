import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle,
  Calendar,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  Download,
} from "lucide-react";

export function SubscriptionConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "starter";

  const planDetails = {
    trial: {
      name: "Free Trial",
      duration: "14 days",
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    starter: {
      name: "Starter Plan",
      duration: "Monthly",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    business: {
      name: "Business Plan",
      duration: "Monthly",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails];

  const nextSteps = [
    {
      icon: Users,
      title: "Add Team Members",
      description: "Invite your staff to start using ZimPOS",
      action: "Add Users",
    },
    {
      icon: Package,
      title: "Setup Products",
      description: "Add your inventory and start selling",
      action: "Add Products",
    },
    {
      icon: TrendingUp,
      title: "Start Selling",
      description: "Begin processing transactions",
      action: "New Sale",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex flex-col items-center justify-center p-6">
      {/* Success Animation */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-pulse">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {plan === "trial" ? "Trial Started!" : "Payment Successful!"}
        </h1>
        <p className="text-white/80 text-lg">
          Welcome to ZimPOS {selectedPlan.name}
        </p>
      </div>

      {/* Plan Details Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Subscription Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Plan</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedPlan.name}
            </span>
          </div>
          <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedPlan.duration}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {plan === "trial" ? "Trial Expires" : "Renews on"}
              </span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedPlan.expiryDate}
            </span>
          </div>
        </div>

        {plan === "trial" && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              🎉 Your 14-day free trial has started. No credit card required. Explore all
              features!
            </p>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Next Steps
        </h3>
        <div className="space-y-3">
          {nextSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Receipt */}
      {plan !== "trial" && (
        <button className="w-full max-w-md mb-4 px-6 py-3 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Download Receipt
        </button>
      )}

      {/* Go to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="w-full max-w-md bg-white hover:bg-gray-50 text-emerald-600 py-4 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Footer */}
      <p className="text-center text-white/60 text-sm mt-6">
        Need help? Contact our support team anytime
      </p>
    </div>
  );
}
