import type { Product } from "../types/product";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

interface ProductCardProps {
  product: Product;
  lang: "en" | "km";
}

const ProductCard = ({ product, lang }: ProductCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] p-4 shadow-card shadow-card-hover border border-emerald-100 transition-all duration-500 hover:border-emerald-300"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6">
        <img
          src={product.image}
          alt={product.name[lang]}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute right-4 top-4">
          <span className={cn(
            "rounded-2xl bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 backdrop-blur-md shadow-sm border border-emerald-50",
            lang === "km" && "khmer-font text-xs tracking-normal"
          )}>
            {product.category[lang]}
          </span>
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className={cn(
            "text-xl font-bold text-slate-900 line-clamp-1",
            lang === "km" && "khmer-font"
          )}>
            {product.name[lang]}
          </h2>
          <span className="text-2xl font-black text-emerald-600">
            ${product.price}/kg
          </span>
        </div>
        
        <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
