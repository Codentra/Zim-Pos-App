import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Edit,
  DollarSign,
  TrendingUp,
  Calendar,
  Receipt,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  date: string;
  type: "sale" | "payment" | "credit";
  amount: number;
  items?: number;
  balance?: number;
}

export function CustomerDetails() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Mock customer data
  const customer = {
    id: customerId,
    name: "Tendai Mukwashi",
    phone: "+263 77 234 5678",
    email: "tendai.m@email.com",
    address: "Mbare, Harare",
    creditBalance: 25.5,
    creditLimit: 100.0,
    totalSpent: 450.0,
    lastVisit: "Today, 2:30 PM",
    visits: 45,
    averageSpent: 10.0,
    status: "credit" as const,
    joinedDate: "Jan 2025",
  };

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "Today, 2:30 PM",
      type: "sale",
      amount: 15.5,
      items: 5,
      balance: 25.5,
    },
    {
      id: "2",
      date: "Yesterday, 4:15 PM",
      type: "payment",
      amount: -20.0,
      balance: 10.0,
    },
    {
      id: "3",
      date: "3 days ago",
      type: "sale",
      amount: 18.0,
      items: 6,
      balance: 30.0,
    },
    {
      id: "4",
      date: "5 days ago",
      type: "payment",
      amount: -15.0,
      balance: 12.0,
    },
    {
      id: "5",
      date: "1 week ago",
      type: "sale",
      amount: 12.0,
      items: 4,
      balance: 27.0,
    },
  ];

  const creditPercentage = (customer.creditBalance / customer.creditLimit) * 100;

  const handleRecordPayment = () => {
    // Handle payment recording
    console.log("Recording payment:", paymentAmount);
    setShowPaymentModal(false);
    setPaymentAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customers")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Customer Details</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(`/customers/${customerId}/edit`)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {customer.name}
                </h2>
                {customer.status === "vip" && (
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Member since {customer.joinedDate}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{customer.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Status */}
      {customer.creditBalance > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Outstanding Credit</p>
                <p className="text-3xl font-bold">${customer.creditBalance.toFixed(2)}</p>
                <p className="text-sm opacity-75 mt-1">
                  of ${customer.creditLimit.toFixed(2)} limit
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Credit Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${creditPercentage}%` }}
              />
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-white/95 transition-colors active:scale-95"
            >
              Record Payment
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${customer.totalSpent.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{customer.visits}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Visits</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${customer.averageSpent.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Spent</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Recent Activity
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "payment"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : transaction.type === "sale"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                >
                  {transaction.type === "payment" ? (
                    <Minus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : transaction.type === "sale" ? (
                    <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transaction.type === "payment"
                      ? "Credit Payment"
                      : transaction.type === "sale"
                      ? "Purchase"
                      : "Credit Added"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.date}
                    {transaction.items && ` • ${transaction.items} items`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transaction.type === "payment"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {transaction.type === "payment" ? "" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                {transaction.balance !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Balance: ${transaction.balance.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Record Payment</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Current balance: ${customer.creditBalance.toFixed(2)}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white text-lg font-semibold"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
