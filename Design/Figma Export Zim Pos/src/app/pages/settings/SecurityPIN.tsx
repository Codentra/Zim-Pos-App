import { useNavigate } from "react-router";
import { ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

export function SecurityPIN() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const isPinValid = newPin.length === 4 && newPin === confirmPin;

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Security & PIN</h1>
            <p className="text-emerald-100 text-sm">Change your login PIN</p>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="px-6 mt-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
              PIN Security
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Your PIN must be 4 digits. Never share your PIN with anyone.
            </p>
          </div>
        </div>
      </div>

      {/* Change PIN Form */}
      <div className="px-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Current PIN
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.slice(0, 4))}
              maxLength={4}
              placeholder="••••"
              className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-2xl tracking-widest text-center text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              {showCurrent ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            New PIN
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
              maxLength={4}
              placeholder="••••"
              className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-2xl tracking-widest text-center text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              {showNew ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm New PIN
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
              maxLength={4}
              placeholder="••••"
              className={`w-full px-4 py-4 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 text-2xl tracking-widest text-center text-gray-900 dark:text-white ${
                confirmPin.length === 4
                  ? isPinValid
                    ? "border-emerald-500 focus:ring-emerald-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-emerald-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPin.length === 4 && !isPinValid && (
            <div className="flex items-center gap-2 mt-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">PINs do not match</p>
            </div>
          )}
          {isPinValid && (
            <div className="flex items-center gap-2 mt-2 text-emerald-600">
              <Check className="w-4 h-4" />
              <p className="text-sm">PINs match</p>
            </div>
          )}
        </div>

        {/* PIN Strength Indicators */}
        {newPin.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              PIN Strength Tips
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {newPin.length === 4 ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                )}
                <span className={newPin.length === 4 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"}>
                  4 digits long
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {!/(\d)\1{2,}/.test(newPin) && newPin.length === 4 ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                )}
                <span
                  className={
                    !/(\d)\1{2,}/.test(newPin) && newPin.length === 4
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                >
                  No repeated digits (e.g., 1111)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {newPin !== "1234" && newPin.length === 4 ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                )}
                <span
                  className={
                    newPin !== "1234" && newPin.length === 4
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                >
                  Not a common sequence (e.g., 1234)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Update PIN Button */}
        <button
          disabled={!isPinValid || currentPin.length !== 4}
          className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${
            isPinValid && currentPin.length === 4
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          <Lock className="w-5 h-5" />
          Update PIN
        </button>
      </div>

      {/* Security Settings */}
      <div className="px-6 mt-8">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Additional Security
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Biometric Login</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use fingerprint or face ID</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auto Lock</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">After 5 minutes idle</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}