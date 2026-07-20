"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const LocaleContext = createContext(null);

const LOCALE_KEY = "app-locale";

const messagesMap = {};

function loadLocale(locale) {
  if (messagesMap[locale]) return messagesMap[locale];
  try {
    messagesMap[locale] = require(`../../locales/${locale}.json`);
  } catch {
    messagesMap[locale] = {};
  }
  return messagesMap[locale];
}

function interpolate(str, values) {
  return str.replace(/\{(\w+)\}/g, (_, key) =>
    values && values[key] !== undefined ? values[key] : `{${key}}`
  );
}

const FALLBACK_LOCALE = "en";

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState("en");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      if (stored && (stored === "en" || stored === "fa")) {
        setLocaleState(stored);
      }
    } catch {}
  }, []);

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_KEY, newLocale);
    } catch {}
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "fa" ? "rtl" : "ltr";
  }, []);

  const t = useCallback((key, values) => {
    const messages = loadLocale(locale);
    const fallbackMessages = loadLocale(FALLBACK_LOCALE);
    let msg = messages[key] || fallbackMessages[key] || key;
    return interpolate(msg, values);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within a LocaleProvider");
  return ctx.t;
}
