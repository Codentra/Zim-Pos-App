import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, RotateCcw, AlertCircle } from "lucide-react";
import { NumericKeypad } from "../components/NumericKeypad";

type RefundStep = "search" | "details" | "confirm" | "pin";

interface Transaction {
  id: string;
  date: string;
  time: string;
  total: number;
  items: string[];
  paymentMethod: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN1234567890",
    date: "10/02/2026",
    time: "14:23",
    total: 15.6,
    items: ["Coca Cola 500ml", "Bread - White", "Milk 1L"],
    paymentMethod: "Cash",
  },
  {
    id: "TXN1234567889",
    date: "10/02/2026",
    time: "13:45",
    total: 28.3,
    items: ["Rice 5kg", "Sugar 2kg", "Cooking Oil 2L"],
    paymentMethod: "EcoCash",
  },
];

export function Refunds() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RefundStep>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [managerPin, setManagerPin] = useState("");

  const filteredTransactions = mockTransactions.filter((txn) =>
    txn.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setRefundAmount(txn.total.toString());
    setStep("details");
  };

  const handleRequestPin = () => {
    setStep("pin");
  };

  const handlePinComplete = (pin: string) => {
    if (pin === "9999") {
      // Demo manager PIN
      alert("Refund approved and processed!");
      navigate("/dashboard");
    } else {
      setManagerPin("");
      alert("Incorrect manager PIN");
    }
  };

  if (step === "search") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Refunds & Returns</h1>
              <p className="text-sm text-gray-500">Process refunds</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {filteredTransactions.map((txn) => (
              <button
                key={txn.id}
                onClick={() => handleSelectTransaction(txn)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors text-left active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm text-gray-500">{txn.id}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {txn.date} at {txn.time}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${txn.total.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {txn.paymentMethod}
                  </span>
                  <span>{txn.items.length} items</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "details" && selectedTransaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("search")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Refund Details</h1>
              <p className="text-sm text-gray-500">{selectedTransaction.id}</p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="p-6 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">
              Transaction Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {selectedTransaction.date} at {selectedTransaction.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {selectedTransaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">
                  ${selectedTransaction.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
            <div className="space-y-2">
              {selectedTransaction.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Refund Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full px-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Maximum: ${selectedTransaction.total.toFixed(2)} (Full refund)
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 font-medium mb-1">
                Manager Approval Required
              </p>
              <p className="text-xs text-amber-700">
                Refunds require manager PIN verification
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestPin}
            disabled={!refundAmount || parseFloat(refundAmount) <= 0}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Process Refund
          </button>
        </div>
      </div>
    );
  }

  if (step === "pin") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("details")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manager PIN</h1>
              <p className="text-sm text-gray-500">Authorization required</p>
            </div>
          </div>
        </div>

        {/* PIN Entry */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔐</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Manager PIN Required
                </h2>
                <p className="text-gray-500">
                  Enter manager PIN to approve refund
                </p>
              </div>

              {/* PIN Dots */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      managerPin.length > index
                        ? "bg-emerald-600 border-emerald-600"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Keypad */}
              <NumericKeypad
                value={managerPin}
                onChange={(pin) => {
                  setManagerPin(pin);
                  if (pin.length === 4) {
                    setTimeout(() => handlePinComplete(pin), 300);
                  }
                }}
                maxLength={4}
              />

              <div className="mt-6 text-center text-sm text-gray-500">
                Manager PIN: 9999 (Demo)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
