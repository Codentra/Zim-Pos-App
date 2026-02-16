import { useNavigate, useLocation } from "react-router";
import { Check, Printer, Share2, Home } from "lucide-react";
import { motion } from "motion/react";

export function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    paymentMethod = "cash",
    total = 0,
    transactionId = "TXN000000",
    timestamp = new Date().toISOString(),
  } = location.state || {};

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-GB");
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentMethodNames: Record<string, string> = {
    cash: "Cash",
    ecocash: "EcoCash",
    onemoney: "OneMoney",
    zipit: "ZIPIT",
    card: "Card",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Success Animation */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-12 h-12 text-emerald-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white"
        >
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-emerald-100">Transaction completed</p>
        </motion.div>
      </div>

      {/* Receipt Details */}
      <div className="flex-1 px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">ZimPOS</h2>
            <p className="text-sm text-gray-500">Official Receipt</p>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono font-semibold text-gray-900">
                {transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold text-gray-900">{formattedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">
                {paymentMethodNames[paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cashier</span>
              <span className="font-semibold text-gray-900">Tafadzwa</span>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-gray-600">Tax (VAT 15%)</span>
              <span className="text-lg font-semibold text-gray-900">
                ${(total * 0.15).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-baseline bg-emerald-50 -mx-6 px-6 py-4 rounded-xl">
              <span className="text-lg font-semibold text-gray-800">Total Paid</span>
              <span className="text-3xl font-bold text-emerald-600">
                ${(total * 1.15).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">Business Reg: BRN-123456789</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share via WhatsApp
          </button>
          <button className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center gap-2">
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
