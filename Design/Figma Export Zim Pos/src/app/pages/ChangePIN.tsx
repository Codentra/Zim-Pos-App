import { useNavigate } from "react-router";
import { Lock, Check, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { NumericKeypad } from "../components/NumericKeypad";

export function ChangePIN() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");
  const [error, setError] = useState("");

  const currentPIN = step === "enter" ? newPIN : confirmPIN;
  const maxLength = 6;

  const handleKeyPress = (value: string) => {
    if (value === "backspace") {
      if (step === "enter") {
        setNewPIN((prev) => prev.slice(0, -1));
      } else {
        setConfirmPIN((prev) => prev.slice(0, -1));
      }
      setError("");
    } else {
      if (currentPIN.length < maxLength) {
        if (step === "enter") {
          setNewPIN((prev) => prev + value);
        } else {
          const updated = confirmPIN + value;
          setConfirmPIN(updated);

          // Auto-validate when confirm PIN is complete
          if (updated.length === newPIN.length) {
            if (updated === newPIN) {
              // Success - navigate to dashboard
              setTimeout(() => {
                navigate("/dashboard");
              }, 500);
            } else {
              setError("PINs do not match");
              setTimeout(() => {
                setConfirmPIN("");
                setError("");
              }, 1500);
            }
          }
        }
      }
    }
  };

  const handleContinue = () => {
    if (step === "enter") {
      if (newPIN.length >= 4) {
        setStep("confirm");
        setError("");
      } else {
        setError("PIN must be at least 4 digits");
      }
    }
  };

  const validationRules = [
    { text: "At least 4 digits", valid: newPIN.length >= 4 },
    { text: "Maximum 6 digits", valid: newPIN.length <= 6 },
    { text: "Don't use 1234 or 0000", valid: !["1234", "0000", "1111", "2222"].includes(newPIN) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-center">
        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {step === "enter" ? "Create New PIN" : "Confirm Your PIN"}
        </h1>
        <p className="text-white/80 text-lg">
          {step === "enter"
            ? "Choose a secure PIN (4-6 digits)"
            : "Re-enter your PIN to confirm"}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-[2rem] px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              step === "enter"
                ? "bg-emerald-600 text-white"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            }`}
          >
            {step === "confirm" ? <Check className="w-6 h-6" /> : "1"}
          </div>
          <div className={`h-1 w-16 rounded ${
            step === "confirm" ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"
          }`} />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              step === "confirm"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            2
          </div>
        </div>

        {/* PIN Display */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all ${
                  index < currentPIN.length
                    ? "bg-emerald-600 dark:bg-emerald-400 scale-110"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPIN.length} / {maxLength} digits
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-900 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Validation Rules (only on enter step) */}
        {step === "enter" && newPIN.length > 0 && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              PIN Requirements:
            </p>
            {validationRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-3">
                {rule.valid ? (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
                <span
                  className={`text-sm ${
                    rule.valid
                      ? "text-green-700 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {rule.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Confirm Step Info */}
        {step === "confirm" && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              💡 Make sure you remember this PIN. You'll use it every time you login to ZimPOS.
            </p>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="mb-6">
          <NumericKeypad onKeyPress={handleKeyPress} />
        </div>

        {/* Continue Button (only for enter step) */}
        {step === "enter" && (
          <button
            onClick={handleContinue}
            disabled={newPIN.length < 4}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Back Button (confirm step) */}
        {step === "confirm" && (
          <button
            onClick={() => {
              setStep("enter");
              setConfirmPIN("");
              setError("");
            }}
            className="w-full text-gray-600 dark:text-gray-400 py-3 rounded-xl font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to Change PIN
          </button>
        )}
      </div>
    </div>
  );
}
