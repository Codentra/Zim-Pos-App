import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  FileText,
  Image,
  Type,
  Save,
  Smartphone,
  Mail,
} from "lucide-react";
import { useState } from "react";

export function ReceiptSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    storeName: "Tafadzwa's General Store",
    address: "123 Samora Machel Ave, Harare",
    phone: "+263 77 123 4567",
    email: "info@tgsretail.co.zw",
    taxNumber: "12345678",
    footerText: "Thank you for your business!",
    showLogo: true,
    showTax: true,
    autoPrint: true,
    paperSize: "80mm",
  });

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
            <h1 className="text-2xl font-bold">Receipt Settings</h1>
            <p className="text-emerald-100 text-sm">Customize receipts</p>
          </div>
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="px-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 font-mono text-sm">
          <div className="text-center border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-4 mb-4">
            {settings.showLogo && (
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            )}
            <h2 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{settings.storeName}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">{settings.address}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{settings.phone}</p>
            {settings.email && (
              <p className="text-xs text-gray-600 dark:text-gray-400">{settings.email}</p>
            )}
            {settings.showTax && (
              <p className="text-xs text-gray-600 dark:text-gray-400">Tax #: {settings.taxNumber}</p>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-gray-900 dark:text-white">
              <span>Receipt #:</span>
              <span className="font-bold">RCP-001234</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 dark:text-white">
              <span>Date:</span>
              <span>10/02/2026 14:30</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 dark:text-white">
              <span>Cashier:</span>
              <span>Tafadzwa M.</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-2 mb-2">
            <div className="flex justify-between text-xs mb-1 text-gray-900 dark:text-white">
              <span>Coca Cola 500ml x2</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between text-xs mb-1 text-gray-900 dark:text-white">
              <span>Bread Loaf x1</span>
              <span>$1.50</span>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 space-y-1">
            <div className="flex justify-between font-bold text-gray-900 dark:text-white">
              <span>TOTAL:</span>
              <span>$3.50</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 dark:text-white">
              <span>Cash:</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 dark:text-white">
              <span>Change:</span>
              <span>$1.50</span>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-xs italic text-gray-600 dark:text-gray-400">{settings.footerText}</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="px-6 mt-6 space-y-6">
        {/* Business Info on Receipt */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Business Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Appearance
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Show Logo</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display store logo</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.showLogo}
                  onChange={(e) =>
                    setSettings({ ...settings, showLogo: e.target.checked })
                  }
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Show Tax Number</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Include tax ID</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.showTax}
                  onChange={(e) =>
                    setSettings({ ...settings, showTax: e.target.checked })
                  }
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Footer Message
          </h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Type className="w-4 h-4 inline mr-2" />
              Custom Message
            </label>
            <textarea
              value={settings.footerText}
              onChange={(e) =>
                setSettings({ ...settings, footerText: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Printer Settings */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Printer Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Paper Size
              </label>
              <select
                value={settings.paperSize}
                onChange={(e) =>
                  setSettings({ ...settings, paperSize: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="80mm">80mm (Standard)</option>
                <option value="58mm">58mm (Compact)</option>
                <option value="A4">A4 (Letter)</option>
              </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Auto Print</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Print after each sale</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.autoPrint}
                  onChange={(e) =>
                    setSettings({ ...settings, autoPrint: e.target.checked })
                  }
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          Save Receipt Settings
        </button>
      </div>
    </div>
  );
}

function MapPin({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
