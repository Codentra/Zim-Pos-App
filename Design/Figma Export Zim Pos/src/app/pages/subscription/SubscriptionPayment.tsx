import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export function SubscriptionPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "starter";
  const period = searchParams.get("period") || "monthly";

  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "ecocash" | "onemoney" | "bank"
  >("card");

  const planDetails = {
    starter: { name: "Starter Plan", price: period === "monthly" ? 50 : 40 },
    business: { name: "Business Plan", price: period === "monthly" ? 100 : 83 },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails];
  const totalAmount = selectedPlan.price;

  const handleCompletePayment = () => {
    navigate(`/subscription/confirmation?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-emerald-100 text-sm">Choose your payment method</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Plan</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedPlan.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Billing</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {period}
              </span>
            </div>
            {period === "yearly" && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">Discount (17%)</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  -${((selectedPlan.price / 0.83 - selectedPlan.price) * 12).toFixed(0)}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totalAmount}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{period === "monthly" ? "mo" : "mo"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Select Payment Method
        </h3>
        <div className="space-y-3">
          {/* Card Payment */}
          <button
            onClick={() => setPaymentMethod("card")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "card"
                ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    paymentMethod === "card"
                      ? "bg-emerald-600"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${
                      paymentMethod === "card" ? "text-white" : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Card Payment
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Visa, Mastercard, Amex
                  </p>
                </div>
              </div>
              {paymentMethod === "card" && (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </button>

          {/* EcoCash */}
          <button
            onClick={() => setPaymentMethod("ecocash")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "ecocash"
                ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    paymentMethod === "ecocash"
                      ? "bg-emerald-600"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <Smartphone
                    className={`w-6 h-6 ${
                      paymentMethod === "ecocash"
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">EcoCash</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mobile money payment
                  </p>
                </div>
              </div>
              {paymentMethod === "ecocash" && (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </button>

          {/* OneMoney */}
          <button
            onClick={() => setPaymentMethod("onemoney")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "onemoney"
                ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    paymentMethod === "onemoney"
                      ? "bg-emerald-600"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <Smartphone
                    className={`w-6 h-6 ${
                      paymentMethod === "onemoney"
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">OneMoney</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    NetOne mobile money
                  </p>
                </div>
              </div>
              {paymentMethod === "onemoney" && (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </button>

          {/* Bank Transfer (ZIPIT) */}
          <button
            onClick={() => setPaymentMethod("bank")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "bank"
                ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    paymentMethod === "bank"
                      ? "bg-emerald-600"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <Building
                    className={`w-6 h-6 ${
                      paymentMethod === "bank" ? "text-white" : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Bank Transfer (ZIPIT)
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Instant bank transfer
                  </p>
                </div>
              </div>
              {paymentMethod === "bank" && (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      {paymentMethod === "card" && (
        <div className="px-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "ecocash" && (
        <div className="px-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                EcoCash Number
              </label>
              <input
                type="tel"
                placeholder="077 123 4567"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                You'll receive an EcoCash prompt on your phone to approve this payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Badges */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                SSL Encrypted
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">256-bit security</p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                PCI Compliant
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Secure payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Payment Button */}
      <div className="px-6">
        <button
          onClick={handleCompletePayment}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Lock className="w-5 h-5" />
          Complete Payment - ${totalAmount}
        </button>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
          By completing this payment, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
