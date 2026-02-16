import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, DollarSign, AlertTriangle, Check } from "lucide-react";

type CashAction = "open" | "close" | null;

export function CashManagement() {
  const navigate = useNavigate();
  const [action, setAction] = useState<CashAction>(null);
  const [openingFloat, setOpeningFloat] = useState("");
  const [closingCounted, setClosingCounted] = useState("");

  const expectedCash = 5200.0; // From today's sales
  const variance = closingCounted
    ? parseFloat(closingCounted) - expectedCash
    : 0;

  const handleOpenDrawer = () => {
    if (openingFloat) {
      alert(`Cash drawer opened with float: $${openingFloat}`);
      navigate("/dashboard");
    }
  };

  const handleCloseDrawer = () => {
    if (closingCounted) {
      alert(`Cash drawer closed. Variance: $${variance.toFixed(2)}`);
      navigate("/dashboard");
    }
  };

  if (!action) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Cash Drawer</h1>
              <p className="text-sm text-gray-500">Manage cash operations</p>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        <div className="p-6 space-y-4">
          <button
            onClick={() => setAction("open")}
            className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 transition-colors active:scale-95 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Open Cash Drawer
                </h3>
                <p className="text-sm text-gray-500">
                  Start your shift with opening float
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setAction("close")}
            className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 transition-colors active:scale-95 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Check className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Close Cash Drawer
                </h3>
                <p className="text-sm text-gray-500">
                  End shift and reconcile cash
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (action === "open") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAction(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Open Drawer</h1>
              <p className="text-sm text-gray-500">Enter opening float</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Opening Cash Float ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={openingFloat}
              onChange={(e) => setOpeningFloat(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-3">
              Enter the amount of cash you're starting your shift with
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Count all notes and coins carefully before
              entering the amount.
            </p>
          </div>

          <button
            onClick={handleOpenDrawer}
            disabled={!openingFloat || parseFloat(openingFloat) <= 0}
            className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            Open Cash Drawer
          </button>
        </div>
      </div>
    );
  }

  // Close Drawer
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAction(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Close Drawer</h1>
            <p className="text-sm text-gray-500">Cash reconciliation</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Cash
            </label>
            <div className="text-3xl font-bold text-gray-900">
              ${expectedCash.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on today's cash sales
            </p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-3">
            Counted Cash ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={closingCounted}
            onChange={(e) => setClosingCounted(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {closingCounted && (
          <div
            className={`rounded-xl p-4 border-2 ${
              Math.abs(variance) < 1
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {Math.abs(variance) < 1 ? (
                <Check className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              )}
              <h3 className="font-semibold text-gray-900">Variance</h3>
            </div>
            <p
              className={`text-2xl font-bold ${
                Math.abs(variance) < 1 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              ${variance > 0 ? "+" : ""}
              {variance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {Math.abs(variance) < 1
                ? "Cash count matches expected amount"
                : variance > 0
                ? "Cash over expected amount"
                : "Cash under expected amount"}
            </p>
          </div>
        )}

        <button
          onClick={handleCloseDrawer}
          disabled={!closingCounted || parseFloat(closingCounted) <= 0}
          className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors active:scale-95"
        >
          Close Cash Drawer
        </button>
      </div>
    </div>
  );
}
