"use client";
import { AnimatePresence, motion } from "motion/react";
import Script from "next/script";
import { useEffect, useState } from "react";

type Consent = "granted" | "denied";
const KEY = "bodyflow-cookie-consent";
/** Dispatched by the footer's "Cookie settings" link to reopen the banner. */
export const OPEN_COOKIE_SETTINGS = "bodyflow:cookie-settings";

function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function saveConsent(v: Consent) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: the choice applies to this visit only */
  }
}

/** Remove Google Analytics cookies after consent is withdrawn. */
function clearAnalyticsCookies(id: string) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true;
  const host = window.location.hostname;
  const domains = [
    "",
    host,
    `.${host}`,
    `.${host.split(".").slice(-2).join(".")}`,
  ];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const d of domains)
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

/**
 * Cookie banner plus consent-gated Google Analytics. Nothing from Google loads, and no analytics
 * cookies are set, until the visitor chooses "Accept". Reject is offered with equal prominence.
 */
export function CookieConsent({
  gaId,
  analyticsEnabled,
}: {
  gaId: string;
  analyticsEnabled: boolean;
}) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setOpen(c === null);
    // No consent on record (or rejected): make sure no analytics cookies linger from earlier visits.
    if (c !== "granted") clearAnalyticsCookies(gaId);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen);
  }, [gaId]);

  const choose = (v: Consent) => {
    const wasGranted = consent === "granted";
    saveConsent(v);
    setConsent(v);
    setOpen(false);
    if (v === "granted")
      (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] =
        false;
    if (v === "denied" && wasGranted) {
      clearAnalyticsCookies(gaId);
      window.location.reload(); // unload the already-running tag
    }
  };

  return (
    <>
      {analyticsEnabled && consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 bottom-12 z-50 mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0c0e14]/95 p-5 text-[13px] leading-relaxed text-[var(--fg-2)] shadow-2xl backdrop-blur-md"
          >
            <h2
              id="cookie-title"
              className="text-[14px] font-semibold text-[var(--fg)]"
            >
              Cookies
            </h2>
            <p id="cookie-desc" className="mt-1.5">
              We&apos;d like to use Google Analytics cookies to understand how
              Bodyflow is used, such as which medicines people explore. They are
              only set if you accept. Bodyflow works the same either way, and
              you can change your choice any time under &ldquo;Cookie
              settings&rdquo; in the footer.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="flex-1 rounded-full border border-white/20 px-4 py-2 font-medium text-[var(--fg)] hover:border-white/40"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="flex-1 rounded-full border border-white/20 px-4 py-2 font-medium text-[var(--fg)] hover:border-white/40"
              >
                Accept
              </button>
            </div>
            {consent && (
              <p className="mt-3 text-[11.5px] text-[var(--muted)]">
                Current choice:{" "}
                {consent === "granted" ? "accepted" : "rejected"}.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
      className="underline decoration-white/20 underline-offset-2 hover:text-[var(--fg)]"
    >
      Cookie settings
    </button>
  );
}
