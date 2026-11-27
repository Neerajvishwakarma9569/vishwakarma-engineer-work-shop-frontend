import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (enText, hiText) => enText,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("vew_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("vew_language", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const t = (enText, hiText) => {
    return lang === "hi" && hiText ? hiText : enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
