import { cn } from "../utils/cn";
import logo from "../assets/logo.png";

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
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-100/50 border border-emerald-50">
            <img src={logo} alt={title} className="w-full h-full object-cover" />
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

        <div className="flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded-full border border-emerald-100">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all rounded-full",
              lang === "en" ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-900/40 hover:text-emerald-900/60"
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang("km")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all rounded-full khmer-font",
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
