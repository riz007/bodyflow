"use client";
import { makeFormatters, type Formatters } from "@/ui/format";
import { createContext, useContext, useMemo } from "react";
import { localePrefix, type Locale } from "./config";
import type { Dict } from "./dictionaries/en";

interface I18n {
  locale: Locale;
  /** "" for English, "/es" etc. otherwise. */
  prefix: string;
  t: Dict;
  f: Formatters;
}

const Ctx = createContext<I18n | null>(null);

/** Receives only the active locale's dictionary from the server, so other languages never ship to the client. */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      locale,
      prefix: localePrefix(locale),
      t: dict,
      f: makeFormatters(dict.units),
    }),
    [locale, dict],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
