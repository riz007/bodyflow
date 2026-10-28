/** The Bodyflow mark (ring + concentration curve) for generated PNG icons. Matches src/app/icon.svg. */
export function BrandMark({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, display: "flex", background: "#05060a" }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5fe1ff" />
            <stop offset="0.55" stopColor="#9d8cff" />
            <stop offset="1" stopColor="#4fe3bf" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="15" fill="none" stroke="url(#g)" strokeWidth="4.5" />
        <path d="M17 37 C23 37 25 20 31 20 S39 44 47 30" fill="none" stroke="url(#g)" strokeWidth="3.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
