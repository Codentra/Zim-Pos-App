import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Package,
  Plus,
  Minus,
  CheckCircle,
  Scan,
  Search,
  Save,
} from "lucide-react";
import { useState } from "react";

interface StockItem {
  productId: string;
  productName: string;
  currentStock: number;
  receivedQty: number;
  costPrice?: number;
}

export function StockReceiving() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  // Mock available products
  const availableProducts = [
    { id: "1", name: "Coca Cola 500ml", currentStock: 45, costPrice: 1.0 },
    { id: "2", name: "Bread - White", currentStock: 30, costPrice: 0.5 },
    { id: "3", name: "Milk 1L", currentStock: 18, costPrice: 1.5 },
    { id: "4", name: "Sugar 2kg", currentStock: 25, costPrice: 2.5 },
    { id: "5", name: "Rice 5kg", currentStock: 12, costPrice: 6.0 },
    { id: "6", name: "Cooking Oil 2L", currentStock: 20, costPrice: 4.0 },
  ];

  const filteredProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product: typeof availableProducts[0]) => {
    const existing = stockItems.find((item) => item.productId === product.id);
    if (!existing) {
      setStockItems([
        ...stockItems,
        {
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          receivedQty: 0,
          costPrice: product.costPrice,
        },
      ]);
    }
    setSearchQuery("");
  };

  const updateQuantity = (productId: string, change: number) => {
    setStockItems(
      stockItems.map((item) =>
        item.productId === productId
          ? { ...item, receivedQty: Math.max(0, item.receivedQty + change) }
          : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setStockItems(stockItems.filter((item) => item.productId !== productId));
  };

  const totalItems = stockItems.reduce((sum, item) => sum + item.receivedQty, 0);
  const totalValue = stockItems.reduce(
    (sum, item) => sum + item.receivedQty * (item.costPrice || 0),
    0
  );

  const handleSaveStock = () => {
    console.log("Saving stock:", stockItems);
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Receive Stock</h1>
              <p className="text-emerald-100 text-sm">Update inventory from delivery</p>
            </div>
          </div>
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Scan className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 -mt-8 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalValue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="px-6 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Scan className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-blue-900 dark:text-blue-400">
                Barcode Scanner
              </h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-500 mb-3">
              Scan product barcodes to quickly add items to this stock receiving
              session.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-blue-300 dark:border-blue-700">
              <Scan className="w-12 h-12 text-blue-400 mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ready to scan...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Products */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products to add..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && filteredProducts.length > 0 && (
          <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addProduct(product)}
                className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current stock: {product.currentStock}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock Items List */}
      <div className="px-6">
        {stockItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-1">No items added yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Search and add products above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stockItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>Current: {item.currentStock}</span>
                      <span>→</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        New: {item.currentStock + item.receivedQty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(item.productId)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      min="0"
                      value={item.receivedQty}
                      onChange={(e) =>
                        setStockItems(
                          stockItems.map((i) =>
                            i.productId === item.productId
                              ? { ...i, receivedQty: parseInt(e.target.value) || 0 }
                              : i
                          )
                        )
                      }
                      className="w-full text-center text-2xl font-bold bg-transparent text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                  </div>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Cost Info */}
                {item.costPrice && item.receivedQty > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      @ ${item.costPrice.toFixed(2)} each
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(item.receivedQty * item.costPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      {stockItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={handleSaveStock}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Update Inventory ({totalItems} items)
          </button>
        </div>
      )}
    </div>
  );
}
