import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  Users,
  BarChart3,
  Cloud,
  Headphones,
  CreditCard,
  Zap,
  Shield,
} from "lucide-react";
import { useState } from "react";

export function SubscriptionPlans() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showComparison, setShowComparison] = useState(false);

  const plans = [
    {
      name: "Free Trial",
      price: 0,
      period: "14 days",
      description: "Try all features free",
      features: [
        "All Business features",
        "No credit card required",
        "Full feature access",
        "14-day trial period",
      ],
      icon: Zap,
      color: "blue",
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Starter",
      price: billingPeriod === "monthly" ? 50 : 40,
      period: billingPeriod === "monthly" ? "/month" : "/month (billed yearly)",
      description: "Perfect for small businesses",
      features: [
        "Up to 6 users",
        "Offline POS billing",
        "Basic sales reports",
        "Cloud backup",
        "Email support",
      ],
      icon: Store,
      color: "emerald",
      popular: false,
      cta: "Subscribe Now",
    },
    {
      name: "Business",
      price: billingPeriod === "monthly" ? 100 : 83,
      period: billingPeriod === "monthly" ? "/month" : "/month (billed yearly)",
      description: "For growing businesses",
      features: [
        "Up to 10 users",
        "Advanced analytics",
        "Customer credit tracking",
        "Inventory management",
        "Priority support",
        "WhatsApp integration",
      ],
      icon: BarChart3,
      color: "teal",
      popular: true,
      cta: "Subscribe Now",
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.name === "Free Trial") {
      navigate("/subscription/confirmation?plan=trial");
    } else {
      navigate(`/subscription/payment?plan=${plan.name.toLowerCase()}&period=${billingPeriod}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Choose Your Plan</h1>
            <p className="text-emerald-100 text-sm">Select the best plan for your business</p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="bg-white/20 backdrop-blur rounded-xl p-1 flex">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              billingPeriod === "monthly"
                ? "bg-white text-emerald-600 shadow-md"
                : "text-white/80"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              billingPeriod === "yearly"
                ? "bg-white text-emerald-600 shadow-md"
                : "text-white/80"
            }`}
          >
            Yearly
            <span className="ml-1 text-xs">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 -mt-8 space-y-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 ${
                plan.popular
                  ? "border-emerald-500 dark:border-emerald-400"
                  : "border-transparent"
              } relative`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : plan.color === "emerald"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-teal-100 dark:bg-teal-900/30"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        plan.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : plan.color === "emerald"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-teal-600 dark:text-teal-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                {billingPeriod === "yearly" && plan.price > 0 && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    Save ${(plan.price * 12 * 0.17).toFixed(0)}/year with yearly billing
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-semibold transition-all active:scale-95 ${
                  plan.popular
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table Toggle */}
      <div className="px-6 mt-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {showComparison ? "Hide" : "Show"} Detailed Comparison
        </button>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-semibold">
                    Starter
                  </th>
                  <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-semibold">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Users</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-white">6</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-white">10</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    Offline Billing
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    Advanced Analytics
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">—</td>
                  <td className="px-4 py-3 text-center">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    Credit Tracking
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">—</td>
                  <td className="px-4 py-3 text-center">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Support</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-white">
                    Email
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-white">
                    Priority
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="px-6 mt-8 grid grid-cols-3 gap-4">
        <div className="text-center">
          <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Secure Payments</p>
        </div>
        <div className="text-center">
          <Cloud className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Cloud Backup</p>
        </div>
        <div className="text-center">
          <Headphones className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">24/7 Support</p>
        </div>
      </div>
    </div>
  );
}

function Store(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
