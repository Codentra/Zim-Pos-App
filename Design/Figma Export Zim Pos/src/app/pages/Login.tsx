import { useState } from "react";
import { useNavigate } from "react-router";
import { WifiOff, Check, User, HelpCircle } from "lucide-react";
import { NumericKeypad } from "../components/NumericKeypad";
import { motion } from "motion/react";

export function Login() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const correctPin = "1234"; // Demo PIN

  // Demo user role (in production, this would be fetched from storage/backend)
  const userRole = "Owner"; // Can be: Owner, Manager, Cashier

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    setError("");
    if (newPin.length === 4) {
      // Auto-submit when 4 digits entered
      setTimeout(() => {
        if (newPin === correctPin) {
          navigate("/dashboard");
        } else {
          setError("Incorrect PIN");
          setPin("");
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">ZimPOS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Point of Sale</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Offline Mode</span>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Welcome Back
              </h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold">
                  {userRole}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Enter your 4-digit PIN</p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all ${
                    pin.length > index
                      ? "bg-emerald-600 dark:bg-emerald-400 scale-110"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Keypad */}
            <NumericKeypad value={pin} onChange={handlePinChange} maxLength={4} />

            {/* Forgot PIN Link */}
            <button
              onClick={() => navigate("/forgot-pin")}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Forgot PIN?
            </button>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              Demo PIN: 1234
            </div>
          </div>

          {/* Back to Welcome */}
          <button
            onClick={() => navigate("/welcome")}
            className="mt-4 w-full text-gray-600 dark:text-gray-400 py-3 rounded-xl font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to Welcome
          </button>
        </motion.div>
      </div>
    </div>
  );
}