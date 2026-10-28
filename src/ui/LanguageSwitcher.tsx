"use client";
import {
  LOCALES,
  LOCALE_NAMES,
  localePrefix,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/** Switches language while keeping the current page and view state (drug, dose, time…). */
export function LanguageSwitcher() {
  const { locale, prefix, t } = useI18n();

  const change = (next: Locale) => {
    const { pathname, search } = window.location;
    const rest =
      prefix && pathname.startsWith(prefix)
        ? pathname.slice(prefix.length) || "/"
        : pathname;
    const nextPrefix = localePrefix(next);
    const path = rest === "/" ? nextPrefix || "/" : `${nextPrefix}${rest}`;
    window.location.assign(`${path}${search}`);
  };

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t.header.language}</span>
      <svg
        className="pointer-events-none absolute left-2.5 text-[var(--muted)]"
        width="13"
        height="13"
        viewBox="0 0 16 16"
        aria-hidden
      >
        <circle
          cx="8"
          cy="8"
          r="6.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M1.8 8h12.4M8 1.7c1.8 1.9 2.6 4 2.6 6.3S9.8 12.4 8 14.3M8 1.7C6.2 3.6 5.4 5.7 5.4 8s.8 4.4 2.6 6.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
      <select
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        aria-label={t.header.language}
        className="max-w-[9.5rem] cursor-pointer appearance-none truncate rounded-full border border-[var(--line)] bg-transparent py-1.5 pl-7 pr-3 text-[12.5px] text-[var(--fg)] hover:border-white/30"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l} className="bg-[#0c0e14]">
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
