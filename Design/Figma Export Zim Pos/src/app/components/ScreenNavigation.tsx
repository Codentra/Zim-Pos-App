import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

export function ScreenNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const screens = [
    { path: "/", name: "Splash" },
    { path: "/welcome", name: "🔐 Welcome" },
    { path: "/login", name: "🔐 Login" },
    { path: "/default-pin", name: "🔐 Default PIN" },
    { path: "/change-pin", name: "🔐 Change PIN" },
    { path: "/onboarding", name: "🎯 Onboarding" },
    { path: "/dashboard", name: "Dashboard" },
    { path: "/products", name: "Products" },
    { path: "/products/add", name: "↳ Add Product" },
    { path: "/stock-receiving", name: "↳ Stock Receiving" },
    { path: "/new-sale", name: "New Sale" },
    { path: "/payment", name: "Payment" },
    { path: "/receipt", name: "Receipt" },
    { path: "/customers", name: "Customers" },
    { path: "/customers/add", name: "↳ Add Customer" },
    { path: "/customers/1", name: "↳ Customer Details" },
    { path: "/reports", name: "Reports" },
    { path: "/cash-management", name: "Cash Management" },
    { path: "/refunds", name: "Refunds" },
    { path: "/system-status", name: "🔧 System Status" },
    { path: "/activity-logs", name: "🔧 Activity Logs" },
    { path: "/hardware-setup", name: "🔧 Hardware Setup" },
    { path: "/subscription/register", name: "💳 Business Registration" },
    { path: "/subscription/plans", name: "💳 Subscription Plans" },
    { path: "/subscription/payment", name: "💳 Payment" },
    { path: "/subscription/confirmation", name: "💳 Confirmation" },
    { path: "/subscription/expired", name: "💳 Expired" },
    { path: "/subscription/user-limit", name: "💳 User Limit" },
    { path: "/subscription/sync-status", name: "💳 Sync Status" },
    { path: "/settings", name: "Settings" },
    { path: "/settings/user-profile", name: "↳ User Profile" },
    { path: "/settings/security-pin", name: "↳ Security & PIN" },
    { path: "/settings/notifications", name: "↳ Notifications" },
    { path: "/settings/business-details", name: "↳ Business Details" },
    { path: "/settings/receipt-settings", name: "↳ Receipt Settings" },
    { path: "/settings/sync-status", name: "↳ Sync Status" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Hide on splash, welcome, and login screens
  if (
    location.pathname === "/" ||
    location.pathname === "/welcome" ||
    location.pathname === "/login"
  ) {
    return null;
  }

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-36 right-4 z-50 bg-white rounded-2xl shadow-2xl p-4 w-64 max-h-[60vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-3 px-2">Navigate Screens</h3>
            <div className="space-y-1">
              {screens.map((screen) => (
                <button
                  key={screen.path}
                  onClick={() => handleNavigate(screen.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === screen.path
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {screen.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}