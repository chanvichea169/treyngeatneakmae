import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "./types/product";
import type { CartItem } from "./types/cart";
import { getProducts, categories } from "./data/products";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { cn } from "./utils/cn";

function App() {
  const [lang, setLang] = useState<"en" | "km">("en");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const liveProducts = await getProducts();
        setProductsList(liveProducts);
      } catch (error) {
        console.error("Failed to load spreadsheet products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInventory();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? productsList
      : productsList.filter((product) => product.category.en === selectedCategory);

  const texts = {
    en: {
      title: "Treyngeat Neak Mae",
      subtitle: "The Taste of Mother's Tradition",
      contactTitle: "Contact Information",
      phoneLabel: "Phone",
      emailLabel: "Email",
      locationLabel: "Location",
      phone: "+855 12 345 678",
      email: "hello@treyngeatneakmae.com",
      location: "Phnom Penh, Cambodia",
    },
    km: {
      title: "ត្រីងៀតអ្នកម៉ែ",
      subtitle: "រសជាតិដើមស្នាដៃអ្នកម៉ែ",
      contactTitle: "ព័ត៌មានទំនាក់ទំនង",
      phoneLabel: "ទូរស័ព្ទ",
      emailLabel: "អ៊ីមែល",
      locationLabel: "ទីតាំង",
      phone: "+855 12 345 678",
      email: "hello@treyngeatneakmae.com",
      location: "ភ្នំពេញ, កម្ពុជា",
    }
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        title={texts[lang].title}
        subtitle={texts[lang].subtitle}
        lang={lang}
        setLang={setLang}
        cartItemCount={totalItems}
        onCartOpen={() => setIsCartOpen(true)}
      />

      <main className="mx-auto max-w-7xl pb-20">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          lang={lang}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className={cn("text-slate-500 font-medium", lang === "km" && "khmer-font")}>
              {lang === "en"
                ? "Syncing Mother's Kitchen..."
                : "កំពុងទាញយកទិន្នន័យពីផ្ទះបាយអ្នកម៉ែ..."}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Footer lang={lang} texts={texts[lang]} />

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleProceedToCheckout}
        lang={lang}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onClearCart={handleClearCart}
        lang={lang}
      />
    </div>
  );
}

export default App;