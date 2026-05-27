"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Reflect the active i18n language onto <html lang="..."> so SEO and
  // screen readers stay accurate after a client-side switch.
  useEffect(() => {
    const sync = (lng: string) => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = lng === "en" ? "en" : "zh-CN";
      }
    };
    sync(i18n.language || "zh");
    i18n.on("languageChanged", sync);
    return () => {
      i18n.off("languageChanged", sync);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
