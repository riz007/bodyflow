import { isLocale, HTML_LANG, LOCALES, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { siteMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { CookieConsent } from "@/ui/CookieConsent";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans-face",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
const mono = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? siteMetadata(locale) : {};
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale as Locale);
  return (
    <html lang={HTML_LANG[locale]}>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <I18nProvider locale={locale} dict={dict}>
          {children}
          {/* Google Analytics loads only after cookie consent, and only in production builds. */}
          <CookieConsent
            gaId={SITE.gaId}
            analyticsEnabled={process.env.NODE_ENV === "production"}
          />
        </I18nProvider>
      </body>
    </html>
  );
}
