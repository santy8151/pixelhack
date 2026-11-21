import { Link } from "@tanstack/react-router";
import { useEffect, useSyncExternalStore } from "react";
import { ShieldCheck, Volume2, VolumeX } from "lucide-react";
import logo from "@/assets/logo.png";
import { HackathonTimerBar } from "@/components/HackathonTimerBar";
import { initMuted, isMuted, setMuted, sfx, subscribeMuted } from "@/lib/sound";

const NAV = [
  { to: "/", label: "Inicio", color: "bg-sun" },
  { to: "/retos", label: "Retos", color: "bg-pink" },
  { to: "/equipos", label: "Equipos", color: "bg-cyan" },
  { to: "/bienestar", label: "Bienestar", color: "bg-pink" },
  { to: "/recursos", label: "Recursos", color: "bg-sun" },
  { to: "/podio", label: "🏆 Podio", color: "bg-sun" },
] as const;

export function SiteHeader() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  useEffect(() => initMuted(), []);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        <Link to="/" onClick={() => sfx.select()} className="shrink-0">
          <img src={logo} alt="Pixel Hack Kids with Canva" className="h-14 w-auto wiggle" />
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onMouseEnter={() => sfx.hover()}
              onClick={() => sfx.click()}
              className="rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold text-ink pop-sm press sm:text-base"
              activeProps={{ className: `${n.color} !text-ink` }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => sfx.click()}
            onMouseEnter={() => sfx.hover()}
            aria-label="Panel de Admin"
            title="Panel de Admin"
            className="grid size-10 place-items-center rounded-full bg-card text-ink pop-sm press"
            activeProps={{ className: "bg-pink !text-ink" }}
          >
            <ShieldCheck className="size-5" />
          </Link>
          <button
            onClick={() => {
              setMuted(!muted);
              if (muted) setTimeout(() => sfx.step(), 30);
            }}
            aria-label={muted ? "Activar sonidos" : "Silenciar sonidos"}
            className="grid size-10 place-items-center rounded-full bg-navy text-primary-foreground pop-sm press"
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </nav>
      </div>
      <HackathonTimerBar />
    </header>
  );
}
