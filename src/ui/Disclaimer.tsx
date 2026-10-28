"use client";
import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

/** Header button that opens the full disclaimer in a native, accessible <dialog>. */
export function DisclaimerButton() {
  const { t } = useI18n();
  const d = t.disclaimer;
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={d.button}
        title={d.button}
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200/25 px-3 py-1.5 text-[12.5px] text-amber-100/90 hover:border-amber-200/50"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          aria-hidden
          className="shrink-0"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M8 7v4.2M8 4.6v.1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {/* Label hides on narrow headers; the icon, aria-label and title remain. */}
        <span className="hidden lg:inline">{d.button}</span>
      </button>
      <dialog
        ref={ref}
        aria-labelledby="disclaimer-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto max-h-[90dvh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0e14] p-0 text-[var(--fg)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="space-y-4 p-6 text-[14px] leading-relaxed text-[var(--fg-2)]">
          <h2
            id="disclaimer-title"
            className="text-lg font-semibold text-[var(--fg)]"
          >
            {d.title}
          </h2>
          <p>{d.intro}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-[var(--fg)]">{d.check}</strong>
            </li>
            <li>{d.model}</li>
            <li>{d.anatomy}</li>
            <li>{d.glow}</li>
            <li>
              <strong className="text-[var(--fg)]">{d.urgent}</strong>
            </li>
          </ul>
          <p className="text-[13px]">
            {d.struggling}{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-[var(--fg)]"
            >
              findahelpline.com
            </a>
          </p>
          <form method="dialog" className="pt-2 text-right">
            <button className="rounded-full bg-[var(--fg)] px-4 py-2 text-[13px] font-medium text-[var(--bg)]">
              {d.ok}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

/** Short note placed at the end of every drug and organ panel. */
export function PanelDisclaimer() {
  const { t } = useI18n();
  return (
    <p className="rounded-xl border border-amber-200/15 bg-amber-200/[0.03] px-4 py-3 text-[12px] leading-relaxed text-[var(--fg-2)]">
      <span className="font-medium text-amber-100/90">
        {t.disclaimer.panelStrong}
      </span>{" "}
      {t.disclaimer.panelText}
    </p>
  );
}
