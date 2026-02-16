import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  creditBalance: number;
  totalSpent: number;
  lastVisit: string;
  visits: number;
  status: "active" | "credit" | "vip";
}

export function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "credit" | "vip">("all");

  // Mock customer data
  const customers: Customer[] = [
    {
      id: "1",
      name: "Tendai Mukwashi",
      phone: "+263 77 234 5678",
      creditBalance: 25.5,
      totalSpent: 450.0,
      lastVisit: "Today, 2:30 PM",
      visits: 45,
      status: "credit",
    },
    {
      id: "2",
      name: "Grace Ncube",
      phone: "+263 71 345 6789",
      creditBalance: 0,
      totalSpent: 1250.0,
      lastVisit: "Yesterday",
      visits: 128,
      status: "vip",
    },
    {
      id: "3",
      name: "Blessing Chikwanha",
      phone: "+263 77 456 7890",
      creditBalance: 15.0,
      totalSpent: 280.0,
      lastVisit: "2 days ago",
      visits: 32,
      status: "credit",
    },
    {
      id: "4",
      name: "Nyasha Moyo",
      phone: "+263 78 567 8901",
      creditBalance: 0,
      totalSpent: 180.5,
      lastVisit: "3 days ago",
      visits: 18,
      status: "active",
    },
    {
      id: "5",
      name: "Rudo Sibanda",
      phone: "+263 71 678 9012",
      creditBalance: 42.0,
      totalSpent: 620.0,
      lastVisit: "4 days ago",
      visits: 67,
      status: "credit",
    },
    {
      id: "6",
      name: "Tatenda Mapfumo",
      phone: "+263 77 789 0123",
      creditBalance: 0,
      totalSpent: 95.0,
      lastVisit: "1 week ago",
      visits: 12,
      status: "active",
    },
  ];

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "credit" && customer.creditBalance > 0) ||
      (filterTab === "vip" && customer.status === "vip");
    return matchesSearch && matchesFilter;
  });

  // Calculate summary stats
  const totalCustomers = customers.length;
  const creditCustomers = customers.filter((c) => c.creditBalance > 0).length;
  const totalCreditOwed = customers.reduce((sum, c) => sum + c.creditBalance, 0);
  const vipCustomers = customers.filter((c) => c.status === "vip").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Customers</h1>
              <p className="text-emerald-100 text-sm">{totalCustomers} total customers</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/customers/add")}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 -mt-8 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{creditCustomers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">On Credit</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{vipCustomers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">VIP</p>
            </div>
          </div>
        </div>

        {/* Total Credit Owed Card */}
        {totalCreditOwed > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mt-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Credit Owed</p>
                  <p className="text-2xl font-bold">${totalCreditOwed.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab("all")}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              filterTab === "all"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilterTab("credit")}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              filterTab === "credit"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Credit ({creditCustomers})
          </button>
          <button
            onClick={() => setFilterTab("vip")}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              filterTab === "vip"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            VIP ({vipCustomers})
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="px-6 space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-1">No customers found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {searchQuery ? "Try a different search" : "Add your first customer"}
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => navigate(`/customers/${customer.id}`)}
              className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {customer.name}
                      </h3>
                      {customer.status === "vip" && (
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="text-xs">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        ${customer.totalSpent.toFixed(0)} spent
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {customer.visits} visits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Credit Badge or Arrow */}
                <div className="flex flex-col items-end gap-1">
                  {customer.creditBalance > 0 ? (
                    <>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Credit Owed</span>
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-lg">
                        ${customer.creditBalance.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-3" />
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {customer.lastVisit}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
