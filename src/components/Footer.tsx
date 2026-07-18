import { motion } from "framer-motion";
import { MessageCircle, Phone, Send, Mail } from "lucide-react";
import { cn } from "../utils/cn";

interface FooterProps {
  lang: "en" | "km";
  texts: {
    title: string;
    subtitle: string;
    contactTitle: string;
    phoneLabel: string;
    emailLabel: string;
    locationLabel: string;
    phone: string;
    email: string;
    location: string;
  };
}

const Footer = ({ lang, texts }: FooterProps) => {
  const contactItems = [
    {
      icon: Phone,
      label: lang === "en" ? "Phone" : "ទូរស័ព្ទ",
      value: texts.phone,
      href: "tel:+855969757940",
    },
    {
      icon: Mail,
      label: lang === "en" ? "Email" : "អ៊ីមែល",
      value: "treyngeatneakmae05@gmail.com",
      href: "mailto:treyngeatneakmae05@gmail.com",
    },
    {
      icon: Send,
      label: "Telegram",
      value: "@treyngeatneakmae",
      href: "https://t.me/treyngeatneakmae05",
    },
    {
      icon: MessageCircle,
      label: "Facebook",
      value: "Treyngeat Neak Mae",
      href: "https://web.facebook.com/profile.php?id=61589376340405",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-emerald-100/60 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 px-4 sm:px-6 py-6 sm:py-10">
      {/* Subtle decorative glow */}
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-200/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-teal-200/10 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl">
        {/* Header Section - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:flex flex-col gap-3 border-b border-emerald-100/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] text-emerald-600",
                lang === "km" && "khmer-font tracking-normal"
              )}
            >
              {texts.title}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={cn(
                "mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl",
                lang === "km" && "khmer-font"
              )}
            >
              {texts.contactTitle}
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={cn(
              "max-w-md text-sm leading-6 text-slate-600",
              lang === "km" && "khmer-font"
            )}
          >
            {texts.subtitle}
          </motion.p>
        </div>

        {/* Contact Icons - Mobile: Single row with icons only */}
        <div className="flex justify-around gap-2 sm:hidden py-2">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-200/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-200/70">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wide">
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* Contact Cards - Tablet and Desktop */}
        <div className="mt-6 hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-100/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-100/30"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-50/0 transition-all duration-300 group-hover:from-emerald-50/20 group-hover:via-emerald-50/10 group-hover:to-emerald-50/0" />
                
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm shadow-emerald-200/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-200/50">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <p className={cn(
                    "mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400",
                    lang === "km" && "khmer-font tracking-normal"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "mt-0.5 break-words text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700",
                    lang === "km" && "khmer-font"
                  )}>
                    {item.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Bottom Bar - Simplified on mobile */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-between gap-4 border-t border-emerald-100/60 pt-6 sm:flex-row">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "text-xs sm:text-sm text-slate-500",
              lang === "km" && "khmer-font"
            )}
          >
            © {new Date().getFullYear()} {texts.title}
          </motion.p>
          
          {/* Status indicator - Simplified on mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500" />
              </span>
              <span className={cn(
                "text-[9px] sm:text-xs text-slate-400",
                lang === "km" && "khmer-font"
              )}>
                {lang === "en" ? "Fresh" : "ស្រស់"}
              </span>
            </span>
            <span className="h-3 w-px sm:h-4 bg-emerald-200" />
            <span className={cn(
              "text-[9px] sm:text-xs text-slate-400",
              lang === "km" && "khmer-font"
            )}>
              {lang === "en" ? "24/7" : "២៤/៧"}
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;