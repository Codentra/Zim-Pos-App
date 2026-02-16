import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { day: "Mon", amount: 2400 },
  { day: "Tue", amount: 1800 },
  { day: "Wed", amount: 3200 },
  { day: "Thu", amount: 2800 },
  { day: "Fri", amount: 3900 },
  { day: "Sat", amount: 4200 },
  { day: "Sun", amount: 3100 },
];

const paymentData = [
  { name: "Cash", value: 5200, color: "#10b981" },
  { name: "EcoCash", value: 4850, color: "#ef4444" },
  { name: "OneMoney", value: 2400, color: "#8b5cf6" },
  { name: "ZIPIT", value: 1500, color: "#3b82f6" },
];

const topProducts = [
  { name: "Coca Cola 500ml", sales: 145, revenue: 217.5 },
  { name: "Bread - White", sales: 98, revenue: 78.4 },
  { name: "Milk 1L", sales: 76, revenue: 167.2 },
  { name: "Sugar 2kg", sales: 62, revenue: 217.0 },
  { name: "Rice 5kg", sales: 45, revenue: 360.0 },
];

type ReportPeriod = "daily" | "weekly" | "monthly";

export function Reports() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<ReportPeriod>("weekly");

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
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
            <h1 className="text-xl font-bold text-gray-800">Reports</h1>
            <p className="text-sm text-gray-500">Business analytics</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                period === p
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">$21,850</p>
            <p className="text-xs text-emerald-600 mt-1">+12.5% vs last week</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Transactions</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">326</p>
            <p className="text-xs text-blue-600 mt-1">+8.2% vs last week</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Overview
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Methods
          </h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {paymentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors active:scale-95 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Export Report (PDF)
        </button>
      </div>
    </div>
  );
}
