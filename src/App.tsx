import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, categories } from "./data/products";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import ProductCard from "./components/ProductCard";

function App() {
  const [lang, setLang] = useState<"en" | "km">("en");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category.en === selectedCategory);

  const texts = {
    en: {
      title: "Treyngeat Neak Mae",
      subtitle: "The Taste of Mother's Tradition",
    },
    km: {
      title: "ត្រីងៀតអ្នកម៉ែ",
      subtitle: "រសជាតិដើមស្នាដៃអ្នកម៉ែ",
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        title={texts[lang].title}
        subtitle={texts[lang].subtitle}
        lang={lang}
        setLang={setLang}
      />

      <main className="mx-auto max-w-7xl pb-40">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          lang={lang}
        />

        <motion.div 
          layout
          className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                lang={lang}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
