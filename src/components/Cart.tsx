import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "../utils/cn";
import type { CartItem } from "../types/cart";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  lang: "en" | "km";
}

// Helper function to get image path
const getImagePath = (imageName: string): string => {
  if (!imageName) return "";
  
  if (imageName?.startsWith('http://') || imageName?.startsWith('https://')) {
    return imageName;
  }
  
  if (imageName?.startsWith('/') || imageName?.startsWith('./') || imageName?.startsWith('assets/')) {
    return imageName;
  }
  
  return `/assets/products/${imageName}`;
};

// Convert Riel to USD (1 USD = 4,000 Riel)
const convertRielToUSD = (rielAmount: number): number => {
  const exchangeRate = 4000;
  return rielAmount / exchangeRate;
};

// Format price based on language
const formatPrice = (price: number, lang: "en" | "km"): string => {
  if (lang === "en") {
    const usdAmount = convertRielToUSD(price);
    return `$${usdAmount.toFixed(2)}`;
  } else {
    return `៛${price.toLocaleString()}`;
  }
};

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  lang,
}: CartProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const texts = {
    en: {
      title: "Your Cart",
      empty: "Your cart is empty",
      emptySub: "Start adding some delicious items!",
      total: "Total",
      checkout: "Checkout",
      clear: "Clear Cart",
      quantity: "Qty",
      remove: "Remove",
      price: "Price",
      items: "items",
    },
    km: {
      title: "កន្ត្រករបស់អ្នក",
      empty: "កន្ត្រករបស់អ្នកទទេ",
      emptySub: "ចាប់ផ្តើមបន្ថែមមុខម្ហូបឆ្ងាញ់ៗ!",
      total: "សរុប",
      checkout: "ទិញឥឡូវ",
      clear: "ទទេកន្ត្រក",
      quantity: "ចំនួន",
      remove: "លុប",
      price: "តម្លៃ",
      items: "មុខ",
    },
  };

  const t = texts[lang];

  // Per unit label
  const perUnit = lang === "en" ? "/ kg" : "/ គីឡូ";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-100/60 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
                <h2 className={cn(
                  "text-lg font-bold text-slate-900",
                  lang === "km" && "khmer-font"
                )}>
                  {t.title}
                </h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex h-[calc(100vh-200px)] flex-col overflow-y-auto px-4 py-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-emerald-50 p-6">
                    <ShoppingBag className="h-12 w-12 text-emerald-300" />
                  </div>
                  <h3 className={cn(
                    "text-lg font-semibold text-slate-700",
                    lang === "km" && "khmer-font"
                  )}>
                    {t.empty}
                  </h3>
                  <p className={cn(
                    "text-sm text-slate-400",
                    lang === "km" && "khmer-font"
                  )}>
                    {t.emptySub}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const imageSrc = getImagePath(item.product.imageName || item.product.imageName  );
                    const itemTotal = item.product.price * item.quantity;
                    
                    return (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 rounded-2xl border border-emerald-100/60 bg-white p-3 shadow-sm"
                      >
                        {/* Product Image */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={item.product.name[lang]}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80/emerald?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <ShoppingBag className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col">
                          <h4 className={cn(
                            "text-sm font-semibold text-slate-800",
                            lang === "km" && "khmer-font"
                          )}>
                            {item.product.name[lang]}
                          </h4>
                          <p className="text-sm font-bold text-emerald-600">
                            {formatPrice(itemTotal, lang)} {perUnit}
                          </p>

                          {/* Quantity Controls */}
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center rounded-lg border border-emerald-200/60 bg-emerald-50/50">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-l-lg text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-40"
                                aria-label="Decrease quantity"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-emerald-700">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-r-lg text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-40"
                                aria-label="Increase quantity"
                                disabled={item.quantity >= 99}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label={t.remove}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-emerald-100/60 bg-white px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "text-xs text-slate-400",
                      lang === "km" && "khmer-font"
                    )}>
                      {t.total} ({totalItems} {t.items})
                    </p>
                    <p className="text-2xl font-black text-emerald-600">
                      {formatPrice(totalPrice, lang)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onClearCart}
                      className={cn(
                        "rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50",
                        lang === "km" && "khmer-font"
                      )}
                    >
                      {t.clear}
                    </button>
                    <button
                      onClick={onCheckout}
                      className={cn(
                        "rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200/50 transition-colors hover:bg-emerald-400",
                        lang === "km" && "khmer-font"
                      )}
                    >
                      {t.checkout}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;