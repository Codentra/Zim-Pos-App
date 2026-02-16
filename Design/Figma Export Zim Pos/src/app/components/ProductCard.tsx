import { Package, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isLowStock = product.stock < 15;

  return (
    <button
      onClick={() => onSelect?.(product)}
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors text-left active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {isLowStock && (
                <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  isLowStock ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Stock: {product.stock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}