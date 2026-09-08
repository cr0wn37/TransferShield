import { Languages } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } =
    useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
      aria-label="Language"
    >
      <Languages className="mx-2 h-4 w-4 text-slate-500" />

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
          language === "en"
            ? "bg-slate-950 text-white"
            : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
          language === "hi"
            ? "bg-slate-950 text-white"
            : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
      >
        हिंदी
      </button>
    </div>
  );
}