import { useMemo } from "react";

const COLORS = ["var(--cyan)", "var(--pink)", "var(--sun)", "var(--navy)"];

export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 2.5,
        size: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "999px" : "3px",
            animation: `confetti-fall ${p.dur}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
