import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Smartphone, Wallet, CreditCard, Building2, Check } from "lucide-react";
import { motion } from "motion/react";

type PaymentMethod = "cash" | "ecocash" | "onemoney" | "zipit" | "card";

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: typeof Smartphone;
  color: string;
  available: boolean;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "cash",
    name: "Cash",
    icon: Wallet,
    color: "from-emerald-500 to-emerald-600",
    available: true,
  },
  {
    id: "ecocash",
    name: "EcoCash",
    icon: Smartphone,
    color: "from-red-500 to-red-600",
    available: true,
  },
  {
    id: "onemoney",
    name: "OneMoney",
    icon: Smartphone,
    color: "from-purple-500 to-purple-600",
    available: true,
  },
  {
    id: "zipit",
    name: "ZIPIT",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    available: true,
  },
  {
    id: "card",
    name: "Card",
    icon: CreditCard,
    color: "from-gray-500 to-gray-600",
    available: false,
  },
];

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total = 0 } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      navigate("/receipt", {
        state: {
          paymentMethod: method,
          total,
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      });
    }, 2000);
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Check className="w-10 h-10 text-emerald-600" />
            </motion.div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-500">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Payment</h1>
            <p className="text-sm text-gray-500">Select payment method</p>
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm text-emerald-100 mb-2">Amount Due</p>
          <p className="text-5xl font-bold">${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Choose Payment Method
        </h3>
        <div className="space-y-3">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => option.available && handlePayment(option.id)}
                disabled={!option.available}
                className={`w-full p-5 rounded-xl border-2 transition-all active:scale-95 ${
                  option.available
                    ? "bg-white border-gray-200 hover:border-emerald-400 hover:shadow-md"
                    : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.available ? "Tap to pay" : "Coming soon"}
                    </p>
                  </div>
                  {option.available && (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Payment Info */}
      <div className="px-6 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Split payments coming soon! Pay with multiple
            methods.
          </p>
        </div>
      </div>
    </div>
  );
}
