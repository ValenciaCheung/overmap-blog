"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        zh: { translation: zh },
        en: { translation: en },
      },
      fallbackLng: "zh",
      supportedLngs: ["zh", "en"],
      // Treat zh-CN / zh-TW / zh-HK all as zh
      load: "languageOnly",
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage"],
      },
      react: { useSuspense: false },
    });
}

export default i18n;
