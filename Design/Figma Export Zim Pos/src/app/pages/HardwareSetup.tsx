import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  Scan,
  Bluetooth,
  Wifi,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export function HardwareSetup() {
  const navigate = useNavigate();
  const [printerStatus, setPrinterStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [scannerStatus, setScannerStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [showTestPrint, setShowTestPrint] = useState(false);

  const handleConnectPrinter = () => {
    setPrinterStatus("connecting");
    setTimeout(() => {
      setPrinterStatus("connected");
    }, 2000);
  };

  const handleConnectScanner = () => {
    setScannerStatus("connecting");
    setTimeout(() => {
      setScannerStatus("connected");
    }, 2000);
  };

  const handleTestPrint = () => {
    setShowTestPrint(true);
    setTimeout(() => {
      setShowTestPrint(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Hardware Setup</h1>
            <p className="text-emerald-100 text-sm">Connect devices to your POS</p>
          </div>
        </div>
      </div>

      {/* Receipt Printer */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Printer className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Receipt Printer
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thermal printer for customer receipts
              </p>
            </div>
            {printerStatus === "connected" && (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Printer Status */}
          <div className="mb-4">
            {printerStatus === "disconnected" && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Not Connected
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No printer detected
                  </p>
                </div>
              </div>
            )}

            {printerStatus === "connecting" && (
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-400">
                    Connecting...
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-500">
                    Searching for devices
                  </p>
                </div>
              </div>
            )}

            {printerStatus === "connected" && (
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-400">
                    Connected
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Epson TM-T82 • Bluetooth
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connection Methods */}
          {printerStatus === "disconnected" && (
            <div className="space-y-3 mb-4">
              <button
                onClick={handleConnectPrinter}
                className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl flex items-center gap-3 transition-colors"
              >
                <Bluetooth className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-blue-900 dark:text-blue-400">
                    Connect via Bluetooth
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-500">
                    Recommended for most printers
                  </p>
                </div>
              </button>

              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-colors">
                <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Connect via WiFi
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    For network printers
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Test Print */}
          {printerStatus === "connected" && (
            <div className="space-y-3">
              <button
                onClick={handleTestPrint}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Test Print
              </button>

              {showTestPrint && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-400 mb-1">
                        Test Print Sent
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-500">
                        Check your printer for the test receipt
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setPrinterStatus("disconnected")}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barcode Scanner */}
      <div className="px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Scan className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Barcode Scanner
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick product lookup by barcode
              </p>
            </div>
            {scannerStatus === "connected" && (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Scanner Status */}
          <div className="mb-4">
            {scannerStatus === "disconnected" && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Not Connected
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No scanner detected
                  </p>
                </div>
              </div>
            )}

            {scannerStatus === "connecting" && (
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 dark:text-purple-400">
                    Connecting...
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-500">
                    Searching for devices
                  </p>
                </div>
              </div>
            )}

            {scannerStatus === "connected" && (
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-400">
                    Connected
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Honeywell 1900 • USB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connection Methods */}
          {scannerStatus === "disconnected" && (
            <div className="space-y-3 mb-4">
              <button
                onClick={handleConnectScanner}
                className="w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl flex items-center gap-3 transition-colors"
              >
                <Bluetooth className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-purple-900 dark:text-purple-400">
                    Connect Scanner
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-500">
                    Bluetooth or USB connection
                  </p>
                </div>
              </button>
            </div>
          )}

          {scannerStatus === "connected" && (
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <Scan className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-400 mb-1">
                      Scanner Ready
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-500">
                      Scan any barcode to test the connection
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setScannerStatus("disconnected")}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Fallback Info */}
      <div className="px-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-400 mb-1">
                Manual Fallback Available
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                ZimPOS works perfectly without hardware devices. You can manually enter
                product codes and print receipts later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
