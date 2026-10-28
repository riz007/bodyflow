import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

/**
 * English lives at the root (/, /drug/aspirin); other languages are prefixed (/es/drug/aspirin).
 * Unprefixed paths are rewritten to /en internally, and an explicit /en prefix redirects to the
 * unprefixed canonical URL so each page has exactly one address.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (first === DEFAULT_LOCALE) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, metadata routes and any file with an extension (models, icons).
  matcher: [
    "/((?!api|_next|icon|apple-icon|manifest|robots|sitemap|models|.*\\..*).*)",
  ],
};
