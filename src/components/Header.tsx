import { cn } from "../utils/cn";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { Menu, X, Leaf, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  lang: "en" | "km";
  setLang: (lang: "en" | "km") => void;
  cartItemCount: number;
  onCartOpen: () => void;
}

const Header = ({ title, subtitle, lang, setLang, cartItemCount, onCartOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100/60 shadow-sm shadow-emerald-50/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-100/50 border-2 border-emerald-50/80"
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={logo} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
            </motion.div>
            
            <div>
              <motion.h1 
                className={cn(
                  "text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2",
                  lang === "km" && "khmer-font"
                )}
                whileHover={{ x: 2 }}
              >
                {title}
                <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
              </motion.h1>
              <motion.p 
                className={cn(
                  "text-[8px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-[0.15em]",
                  lang === "km" && "khmer-font text-[9px] sm:text-xs tracking-normal"
                )}
                whileHover={{ letterSpacing: "0.2em" }}
              >
                {subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <motion.div 
              className="flex items-center gap-1 bg-emerald-50/80 p-1 rounded-full border border-emerald-100/60 backdrop-blur-sm shadow-inner"
              whileHover={{ boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.1)" }}
            >
              <motion.button
                onClick={() => setLang("en")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-bold transition-all rounded-full relative",
                  lang === "en" 
                    ? "bg-white text-emerald-600 shadow-sm shadow-emerald-100/30" 
                    : "text-emerald-900/40 hover:text-emerald-700 hover:bg-emerald-100/30"
                )}
              >
                {lang === "en" && (
                  <motion.span
                    layoutId="activeLang"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </motion.button>
              
              <motion.button
                onClick={() => setLang("km")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-bold transition-all rounded-full khmer-font relative",
                  lang === "km" 
                    ? "bg-white text-emerald-600 shadow-sm shadow-emerald-100/30" 
                    : "text-emerald-900/40 hover:text-emerald-700 hover:bg-emerald-100/30"
                )}
              >
                {lang === "km" && (
                  <motion.span
                    layoutId="activeLang"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">ខ្មែរ</span>
              </motion.button>
            </motion.div>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-200/50 transition-all hover:bg-emerald-400 hover:shadow-emerald-200/70"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-emerald-700 text-[8px] sm:text-[10px] font-bold text-white"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile Cart Button */}
            <button
              onClick={onCartOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[8px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-3 border-t border-emerald-100/40 mt-3">
            {/* Mobile Language Options */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLang("en");
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "py-3 text-sm font-bold rounded-xl transition-all",
                  lang === "en" 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/50" 
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                English
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLang("km");
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "py-3 text-sm font-bold rounded-xl transition-all khmer-font",
                  lang === "km" 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/50" 
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                ភាសាខ្មែរ
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;