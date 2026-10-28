"use client";
import { cameraApi, ZOOM_STEP } from "@/scene/cameraApi";
import { useI18n } from "@/i18n/I18nProvider";

/** On-screen zoom: in, out and reset view. Keyboard: + / − / 0. */
export function ZoomControls() {
  const { t } = useI18n();
  const btn =
    "grid h-9 w-9 place-items-center text-[var(--fg-2)] transition hover:bg-white/10 hover:text-[var(--fg)] active:scale-95 focus-visible:z-10";
  return (
    <div
      role="group"
      aria-label={t.zoom.group}
      className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col overflow-hidden rounded-full border border-white/12 bg-black/50 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => cameraApi.zoom(ZOOM_STEP)}
        aria-label={t.zoom.in}
        title={`${t.zoom.in} (+)`}
        className={btn}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M7 2v10M2 7h10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="mx-2 h-px bg-white/10" aria-hidden />
      <button
        type="button"
        onClick={() => cameraApi.zoom(1 / ZOOM_STEP)}
        aria-label={t.zoom.out}
        title={`${t.zoom.out} (−)`}
        className={btn}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M2 7h10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="mx-2 h-px bg-white/10" aria-hidden />
      <button
        type="button"
        onClick={() => cameraApi.reset()}
        aria-label={t.zoom.reset}
        title={`${t.zoom.reset} (0)`}
        className={btn}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M2.5 5V2.5H5M9 2.5h2.5V5M11.5 9v2.5H9M5 11.5H2.5V9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
