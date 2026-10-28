"use client";
import { useMemo, useState } from "react";
import { DRUGS, CATEGORIES, type Category, type Drug } from "@/data";
import { useApp } from "@/state/store";
import { useI18n } from "@/i18n/I18nProvider";
import { tf } from "@/i18n/dictionaries/en";
import { CLASS_ACCENT } from "./theme";
import { ClassIcon } from "./ClassIcon";

function matches(d: Drug, q: string) {
  if (!q) return true;
  const hay = [d.name, ...d.altNames, ...d.brands, d.classLabel]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

export function DrugPicker({ onPicked }: { onPicked?: () => void }) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const drugId = useApp((s) => s.drugId);
  const compareId = useApp((s) => s.compareId);
  const [compareToggle, setCompareMode] = useState(false);
  const compareMode = compareToggle || !!compareId;
  const { selectDrug, setCompare } = useApp.getState();

  const list = useMemo(
    () =>
      DRUGS.filter(
        (d) => (!cat || d.categories.includes(cat)) && matches(d, q),
      ),
    [q, cat],
  );

  const pick = (id: string) => {
    if (compareMode && drugId && id !== drugId) {
      setCompare(compareId === id ? null : id);
    } else {
      selectDrug(id);
    }
    onPicked?.();
  };

  return (
    <nav aria-label={t.picker.nav} className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-4">
        <label className="relative block">
          <span className="sr-only">{t.picker.search}</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            aria-hidden
          >
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="m11 11 3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.picker.placeholder}
            className="w-full rounded-xl border border-[var(--line)] bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-white/30"
          />
        </label>
        <div
          className="chip-row mt-3 flex flex-wrap gap-1.5"
          role="group"
          aria-label={t.picker.filter}
        >
          <Chip active={!cat} onClick={() => setCat(null)}>
            {t.picker.all}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={cat === c}
              onClick={() => setCat(cat === c ? null : c)}
            >
              {t.categories[c]}
            </Chip>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs leading-snug text-[var(--muted)]">
          <input
            type="checkbox"
            checked={compareMode}
            disabled={!drugId}
            onChange={(e) => {
              setCompareMode(e.target.checked);
              if (!e.target.checked) setCompare(null);
            }}
            className="mt-0.5 shrink-0 accent-white"
          />
          {t.picker.compare}
        </label>
      </div>

      <ul
        className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 pb-4"
        aria-label={tf(t.picker.count, { n: list.length })}
      >
        {list.map((d) => {
          const accent = CLASS_ACCENT[d.drugClass];
          const selected = d.id === drugId;
          const compared = d.id === compareId;
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => pick(d.id)}
                aria-pressed={selected || compared}
                className={`drug-card group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  selected
                    ? "border-white/25 bg-white/[0.07]"
                    : compared
                      ? "border-[#ff9f43]/50 bg-[#ff9f43]/[0.06]"
                      : "border-transparent hover:bg-white/[0.04]"
                }`}
                style={{ ["--accent" as string]: accent }}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                  style={{ background: `${accent}1a`, color: accent }}
                >
                  <ClassIcon cls={d.drugClass} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--fg)]">
                    {d.shortName ?? d.name}
                  </span>
                  <span className="block truncate text-[11.5px] text-[var(--muted)]">
                    {d.subtitle ??
                      [d.altNames[0], ...d.brands.slice(0, 2)]
                        .filter(Boolean)
                        .join(" · ")}
                  </span>
                </span>
                {compared && (
                  <span className="font-mono text-[10px] text-[#ff9f43]">
                    VS
                  </span>
                )}
              </button>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">
            {tf(t.picker.none, { q })}
          </li>
        )}
      </ul>
    </nav>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] transition ${
        active
          ? "border-white/30 bg-white/10 text-[var(--fg)]"
          : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}
