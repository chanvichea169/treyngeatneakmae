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
    <div className="px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.en;

          return (
            <button
              key={cat.en}
              onClick={() => onSelectCategory(cat.en)}
              className={cn(
                "flex-shrink-0 rounded-full sm:rounded-2xl border px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                isActive
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100/50"
                  : "bg-white text-slate-500 border-emerald-100 hover:border-emerald-200 hover:text-emerald-700",
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