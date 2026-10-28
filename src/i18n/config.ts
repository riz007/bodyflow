export const LOCALES = [
  "en",
  "es",
  "zh",
  "ko",
  "ja",
  "fr",
  "de",
  "th",
  "bn",
  "ru",
] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: string | undefined | null): v is Locale =>
  !!v && (LOCALES as readonly string[]).includes(v);

/** Shown in the language switcher, each in its own language. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "中文（简体）",
  ko: "한국어",
  ja: "日本語",
  fr: "Français",
  de: "Deutsch",
  th: "ไทย",
  bn: "বাংলা",
  ru: "Русский",
};

/** BCP 47 tags for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  es: "es",
  zh: "zh-Hans",
  ko: "ko",
  ja: "ja",
  fr: "fr",
  de: "de",
  th: "th",
  bn: "bn",
  ru: "ru",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  es: "es_ES",
  zh: "zh_CN",
  ko: "ko_KR",
  ja: "ja_JP",
  fr: "fr_FR",
  de: "de_DE",
  th: "th_TH",
  bn: "bn_BD",
  ru: "ru_RU",
};

/** URL prefix for a locale: English lives at the root, others under /<locale>. */
export const localePrefix = (l: Locale) =>
  l === DEFAULT_LOCALE ? "" : `/${l}`;

/** Locale-prefixed path, e.g. localePath("es", "/drug/aspirin") → "/es/drug/aspirin". */
export const localePath = (l: Locale, path: string) => {
  const p = localePrefix(l);
  return path === "/" ? p || "/" : `${p}${path}`;
};
