import { cn } from "../utils/cn";

interface HeaderProps {
  title: string;
  subtitle: string;
  lang: "en" | "km";
  setLang: (lang: "en" | "km") => void;
}

const Header = ({ title, subtitle, lang, setLang }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">
            {title[0]}
          </div>
          <div>
            <h1 className={cn(
              "text-xl font-bold text-slate-900 tracking-tight",
              lang === "km" && "khmer-font"
            )}>
              {title}
            </h1>
            <p className={cn(
              "text-[10px] text-slate-400 font-medium uppercase tracking-wider",
              lang === "km" && "khmer-font text-xs tracking-normal"
            )}>
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-50 p-1 rounded-full border border-emerald-100">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "px-4 py-1.5 text-[10px] font-bold transition-all rounded-full",
              lang === "en" ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-900/40 hover:text-emerald-900/60"
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang("km")}
            className={cn(
              "px-4 py-1.5 text-[10px] font-bold transition-all rounded-full khmer-font",
              lang === "km" ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-900/40 hover:text-emerald-900/60"
            )}
          >
            ខ្មែរ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
