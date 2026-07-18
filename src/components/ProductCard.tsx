import type { Product } from "../types/product";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { ShoppingCart, Plus, Minus, Check, ImageOff } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  lang: "en" | "km";
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductCard = ({ product, lang, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const increment = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100/60 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40"
    >
      {/* Image Container - Reduced height */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-emerald-50/80 to-teal-50/80">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name[lang]}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50">
            <ImageOff className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
            <span className="text-xs sm:text-sm text-gray-400">No Image</span>
          </div>
        )}

        {/* Quick View Overlay - Hidden on mobile */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-emerald-900/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-700 shadow-lg backdrop-blur-sm">
            Quick View
          </span>
        </div>
      </div>

      {/* Content - Reduced spacing */}
      <div className="flex flex-1 flex-col space-y-1.5 p-3 sm:p-4">
        {/* Title - Smaller */}
        <h2
          className={cn(
            "line-clamp-1 min-h-[2rem] sm:min-h-[2.25rem] text-xs sm:text-sm font-semibold leading-snug text-gray-800 transition-colors group-hover:text-emerald-700",
            lang === "km" && "khmer-font"
          )}
        >
          {product.name[lang]}
        </h2>

        {/* Description - Smaller */}
        {product.description && product.description[lang] && (
          <p
            className={cn(
              "line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-xs text-gray-500 leading-relaxed min-h-[1.2rem] sm:min-h-[1.8rem]",
              lang === "km" && "khmer-font"
            )}
          >
            {product.description[lang]}
          </p>
        )}

        {/* Price - Smaller */}
        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="text-base sm:text-xl font-bold text-emerald-600">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-400">/ unit</span>
        </div>

        {/* Quantity Controls & Add to Cart - Compact */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
          {/* Quantity Controls - Smaller */}
          <div className="flex items-center rounded-xl border border-emerald-200/60 bg-emerald-50/50">
            <button
              onClick={decrement}
              className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-l-xl text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </button>
            
            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-emerald-700">
              {quantity}
            </span>
            
            <button
              onClick={increment}
              className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-r-xl text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-40"
              disabled={quantity >= 99}
              aria-label="Increase quantity"
            >
              <Plus className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Add to Cart Button - Compact */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-semibold text-white shadow-sm transition-all duration-300",
              added 
                ? "bg-emerald-500 shadow-emerald-200/50" 
                : "bg-emerald-500 hover:bg-emerald-400 hover:shadow-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            )}
          >
            {added ? (
              <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Added!</span>
                <span className="xs:hidden">✓</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add</span>
                <span className="xs:hidden">+</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Stock Status - Compact */}
        <div className="flex items-center gap-1 pt-0.5">
          <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[7px] sm:text-[9px] font-medium text-emerald-600">
            In Stock
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;