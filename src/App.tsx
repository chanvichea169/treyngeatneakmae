import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { products, categories } from "./data/products";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import ProductCard from "./components/ProductCard";
import { cn } from "./utils/cn";

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
      locationLabel: "Location",
      location: "Phnom Penh, Cambodia",
    }
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: "+855 12 345 678",
      href: "tel:+85512345678",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@treyngeatneakmae.com",
      href: "mailto:hello@treyngeatneakmae.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Phnom Penh, Cambodia",
      href: "https://www.google.com/maps/search/?api=1&query=Phnom%20Penh%2C%20Cambodia",
    },
    {
      icon: Send,
      label: "Telegram",
      value: "@treyngeatneakmae",
      href: "https://t.me/treyngeatneakmae",
    },
    {
      icon: MessageCircle,
      label: "Facebook",
      value: "Treyngeat Neak Mae",
      href: "https://www.facebook.com/treyngeatneakmae",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        title={texts[lang].title}
        subtitle={texts[lang].subtitle}
        lang={lang}
        setLang={setLang}
      />

      <main className="mx-auto max-w-7xl pb-20">
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

      <footer className="border-t border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 px-6 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-[0.2em] text-emerald-600", lang === "km" && "khmer-font tracking-normal")}>
                {texts[lang].title}
              </p>
              <h2 className={cn("mt-1 text-2xl font-black tracking-tight sm:text-3xl", lang === "km" && "khmer-font")}>
                Contact Information
              </h2>
            </div>
            <p className={cn("max-w-md text-sm leading-6 text-slate-600", lang === "km" && "khmer-font")}>
              {texts[lang].subtitle}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-card transition hover:border-emerald-300 hover:bg-white hover:shadow-card-hover"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-base font-bold text-slate-900">
                    {item.value}
                  </p>
                </a>
              );
            })}
          </div>

          <div className="mt-6 border-t border-emerald-100 pt-4 text-sm text-slate-500">
            <p className={cn(lang === "km" && "khmer-font")}>
              © {new Date().getFullYear()} {texts[lang].title}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
