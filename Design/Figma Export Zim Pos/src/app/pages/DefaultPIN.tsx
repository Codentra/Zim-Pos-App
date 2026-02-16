import { useNavigate } from "react-router";
import { Lock, Copy, Check, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function DefaultPIN() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showPIN, setShowPIN] = useState(false);

  // Simulated temporary PIN (in real app, this would come from backend)
  const temporaryPIN = "8264";

  const handleCopy = () => {
    navigator.clipboard.writeText(temporaryPIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex flex-col items-center justify-center p-6">
      {/* Icon */}
      <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-8 shadow-2xl">
        <Lock className="w-12 h-12 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white text-center mb-3">
        Your Temporary PIN
      </h1>
      <p className="text-white/80 text-center mb-8 max-w-sm">
        Save this PIN securely. You'll need it to login and will be required to change it on first login.
      </p>

      {/* PIN Display Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
        {/* Security Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
              For Security
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This is a one-time temporary PIN. You must change it on your first login.
            </p>
          </div>
        </div>

        {/* PIN Display */}
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Temporary PIN
          </p>
          <div className="relative">
            <div className="text-6xl font-bold text-gray-900 dark:text-white tracking-[0.5em] mb-4 select-all">
              {showPIN ? temporaryPIN : "••••"}
            </div>
            <button
              onClick={() => setShowPIN(!showPIN)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showPIN ? (
                <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy PIN
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-white text-lg mb-3">Next Steps:</h3>
        <ol className="space-y-2 text-white/90 text-sm">
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0">1.</span>
            <span>Save this PIN in a secure location</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0">2.</span>
            <span>Use it to login to your ZimPOS account</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0">3.</span>
            <span>You'll be prompted to change it immediately on first login</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0">4.</span>
            <span>Choose a memorable 4-6 digit PIN</span>
          </li>
        </ol>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => navigate("/change-pin")}
        className="w-full max-w-md bg-white hover:bg-gray-50 text-emerald-600 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
      >
        Continue to Change PIN
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Skip for now (Demo purposes) */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 text-white/70 hover:text-white text-sm underline"
      >
        Skip for now (Demo)
      </button>
    </div>
  );
}
