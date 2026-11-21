import type { AvatarConfig } from "@/lib/teams";

const FILL: Record<AvatarConfig["color"], string> = {
  cyan: "var(--cyan)",
  pink: "var(--pink)",
  sun: "var(--sun)",
  navy: "var(--navy)",
};

function Body({ shape, fill }: { shape: AvatarConfig["shape"]; fill: string }) {
  const s = { fill, stroke: "var(--ink)", strokeWidth: 4 } as const;
  switch (shape) {
    case "estrella": {
      const pts: string[] = [];
      for (let i = 0; i < 24; i++) {
        const r = i % 2 ? 54 : 70;
        const a = (Math.PI * 2 * i) / 24;
        pts.push(`${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`);
      }
      return <polygon points={pts.join(" ")} strokeLinejoin="round" {...s} />;
    }
    case "cubo":
      return <rect x="35" y="35" width="130" height="130" rx="22" {...s} />;
    case "bolita":
      return <circle cx="100" cy="100" r="68" {...s} />;
    case "nube":
      return (
        <path
          d="M60 160 C30 160 28 120 45 108 C30 80 55 50 80 60 C88 32 125 30 135 55 C165 48 180 85 160 105 C180 125 165 162 140 160 Z"
          strokeLinejoin="round"
          {...s}
        />
      );
  }
}

function Eyes({ eyes }: { eyes: AvatarConfig["eyes"] }) {
  const ink = "var(--ink)";
  const white = "var(--paper)";
  if (eyes === "estrellas")
    return (
      <g fill="var(--sun)" stroke={ink} strokeWidth="2.5">
        {[75, 125].map((x) => (
          <path key={x} d={`M${x} 78 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1z`} />
        ))}
      </g>
    );
  if (eyes === "felices")
    return (
      <g fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round">
        <path d="M64 92 q11 -14 22 0" />
        <path d="M114 92 q11 -14 22 0" />
      </g>
    );
  if (eyes === "guino")
    return (
      <g>
        <ellipse cx="76" cy="90" rx="13" ry="15" fill={white} stroke={ink} strokeWidth="3" />
        <circle cx="79" cy="92" r="7" fill={ink} />
        <path d="M112 92 q12 -10 24 0" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      </g>
    );
  return (
    <g>
      {[76, 124].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="88" rx="17" ry="19" fill={white} stroke={ink} strokeWidth="3" />
          <circle cx={x + 4} cy="91" r="9" fill={ink} />
          <circle cx={x + 7} cy="87" r="3" fill={white} />
        </g>
      ))}
    </g>
  );
}

function Mouth({ mouth }: { mouth: AvatarConfig["mouth"] }) {
  const ink = "var(--ink)";
  switch (mouth) {
    case "sonrisa":
      return <path d="M80 120 q20 18 40 0" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />;
    case "abierta":
      return <path d="M78 116 q22 32 44 0 z" fill={ink} stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    case "lengua":
      return (
        <g>
          <path d="M80 118 q20 16 40 0" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M96 126 q6 14 12 0" fill="var(--pink)" stroke={ink} strokeWidth="3" />
        </g>
      );
    case "o":
      return <ellipse cx="100" cy="124" rx="9" ry="11" fill={ink} />;
  }
}

function Extra({ extra }: { extra: AvatarConfig["extra"] }) {
  const ink = "var(--ink)";
  switch (extra) {
    case "gorra":
      return (
        <g stroke={ink} strokeWidth="4" strokeLinejoin="round">
          <path d="M58 52 q42 -40 84 0 z" fill="var(--pink)" />
          <path d="M120 52 h45 q-5 10 -45 8z" fill="var(--pink)" />
        </g>
      );
    case "lentes":
      return (
        <g fill="color-mix(in oklab, var(--cyan) 35%, transparent)" stroke={ink} strokeWidth="4">
          <rect x="54" y="72" width="42" height="32" rx="8" />
          <rect x="104" y="72" width="42" height="32" rx="8" />
          <path d="M96 86 h8" />
        </g>
      );
    case "corona":
      return (
        <path
          d="M65 50 l10 -32 20 22 15 -28 15 28 20 -22 10 32 z"
          fill="var(--sun)"
          stroke={ink}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );
    case "antena":
      return (
        <g stroke={ink} strokeWidth="4">
          <path d="M100 34 v-22" />
          <circle cx="100" cy="10" r="8" fill="var(--pink)" />
        </g>
      );
    default:
      return null;
  }
}

export function Avatar({ config, className, animate }: { config: AvatarConfig; className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Avatar del equipo">
      <g className={animate ? "floaty" : undefined} style={{ transformOrigin: "center" }}>
        {/* legs */}
        <g stroke="var(--ink)" strokeWidth="4" strokeLinecap="round">
          <path d="M82 160 v28 h-12" fill="none" />
          <path d="M118 160 v28 h12" fill="none" />
        </g>
        <Body shape={config.shape} fill={FILL[config.color]} />
        {config.shape === "nube" || config.shape === "estrella" ? null : null}
        <Eyes eyes={config.eyes} />
        <circle cx="62" cy="112" r="7" fill="var(--pink)" opacity="0.55" />
        <circle cx="138" cy="112" r="7" fill="var(--pink)" opacity="0.55" />
        <Mouth mouth={config.mouth} />
        <Extra extra={config.extra} />
      </g>
    </svg>
  );
}
