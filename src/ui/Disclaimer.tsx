"use client";
import { useRef } from "react";

export const DISCLAIMER_SHORT =
  "Educational visualisation only, not medical advice. Always check with a doctor or pharmacist before starting, stopping or changing any medicine. If you feel unwell or think something is wrong, seek medical care or go to hospital.";

/** Header button that opens the full disclaimer in a native, accessible <dialog>. */
export function DisclaimerButton() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="rounded-full border border-amber-200/25 px-3.5 py-1.5 text-[12.5px] text-amber-100/90 hover:border-amber-200/50"
      >
        Medical disclaimer
      </button>
      <dialog
        ref={ref}
        aria-labelledby="disclaimer-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto max-w-lg rounded-2xl border border-white/10 bg-[#0c0e14] p-0 text-[var(--fg)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="space-y-4 p-6 text-[14px] leading-relaxed text-[var(--fg-2)]">
          <h2 id="disclaimer-title" className="text-lg font-semibold text-[var(--fg)]">
            Medical disclaimer
          </h2>
          <p>
            Bodyflow is an <strong className="text-[var(--fg)]">educational visualisation</strong>. It is not medical advice, a diagnosis, or a substitute
            for care from a qualified health professional.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-[var(--fg)]">Always check with a doctor, specialist or pharmacist</strong> before starting, stopping or changing any
              medicine or dose.
            </li>
            <li>
              Curves are simplified models of population averages for a single dose in a 70 kg adult. Your body, other medicines, age, pregnancy, kidney
              or liver function can change everything shown here.
            </li>
            <li>Organ glow is an illustrative approximation, not a measurement.</li>
            <li>
              <strong className="text-[var(--fg)]">If you feel unwell, have taken too much of a medicine, or think something is wrong, go to hospital or
              contact your local emergency number or poison control now.</strong>
            </li>
          </ul>
          <p className="text-[13px]">
            If you&apos;re struggling, free and confidential support is available at{" "}
            <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--fg)]">
              findahelpline.com
            </a>
            .
          </p>
          <form method="dialog" className="pt-2 text-right">
            <button className="rounded-full bg-[var(--fg)] px-4 py-2 text-[13px] font-medium text-[var(--bg)]">I understand</button>
          </form>
        </div>
      </dialog>
    </>
  );
}

/** Short note placed at the end of every drug and organ panel. */
export function PanelDisclaimer() {
  return (
    <p className="rounded-xl border border-amber-200/15 bg-amber-200/[0.03] px-4 py-3 text-[12px] leading-relaxed text-[var(--fg-2)]">
      <span className="font-medium text-amber-100/90">Always cross-check with a doctor.</span> This is a simplified educational model. Talk to a
      specialist or pharmacist about your own treatment, and go to hospital if you feel unwell.
    </p>
  );
}
