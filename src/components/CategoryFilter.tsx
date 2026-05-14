import { cn } from "../utils/cn";

interface CategoryFilterProps {
  categories: { en: string; km: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  lang: "en" | "km";
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  lang,
}: CategoryFilterProps) => {
  return (
    <div className="py-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3 px-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.en;
          return (
            <button
              key={cat.en}
              onClick={() => onSelectCategory(cat.en)}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border",
                isActive 
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100 scale-105" 
                  : "bg-white text-slate-500 border-emerald-100 hover:border-emerald-200 hover:text-emerald-900",
                lang === "km" && "khmer-font"
              )}
            >
              {lang === "en" ? cat.en : cat.km}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
