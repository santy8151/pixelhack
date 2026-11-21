import { createFileRoute, Link } from "@tanstack/react-router";
import { RETOS, IDEACION_VIDEO } from "@/lib/retos";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/retos")({
  head: () => ({
    meta: [
      { title: "Retos de ciudad — Pixel Hack" },
      { name: "description", content: "Los 3 retos de Medellín que los equipos de Pixel Hack van a resolver." },
      { property: "og:title", content: "Retos de ciudad — Pixel Hack" },
      { property: "og:description", content: "Agua y quebradas, amistad y espacios, y hogares seguros: los 3 retos de Pixel Hack." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Retos,
});

function Retos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-center text-5xl text-navy">Retos de ciudad 🏙️</h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-muted-foreground">
        Estos son 3 problemas reales de Medellín. En la Isla 2 cada equipo vota y elige el suyo.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {RETOS.map((r) => (
          <article key={r.n} onMouseEnter={() => sfx.hover()} className="flex flex-col rounded-[2rem] bg-card p-6 pop">
            <div className={`grid h-44 place-items-center rounded-2xl ${r.bg}`}>
              <img src={r.img} alt="" className="max-h-36 floaty" />
            </div>
            <video src={r.video} controls preload="metadata" playsInline className="mt-4 w-full rounded-2xl bg-ink" />
            <p className="mt-4 text-sm font-bold text-navy">Reto {r.n} · {r.short}</p>
            <h2 className="mt-1 text-2xl text-ink">{r.emoji} {r.title}</h2>
            <p className="mt-2 text-muted-foreground">{r.desc}</p>
            <div className={`mt-4 rounded-2xl ${r.bg} p-4 text-ink`}>
              <p className="font-display text-3xl">{r.fact.big}</p>
              <p className="text-sm">{r.fact.text}</p>
            </div>
            <p className="mt-4 font-semibold text-ink">🚀 Misión: {r.mission}</p>
          </article>
        ))}
      </div>
      <div className="mt-14 rounded-[2rem] bg-card p-6 pop">
        <h2 className="text-center text-3xl text-ink">💡 Isla 3 · Ideación</h2>
        <video src={IDEACION_VIDEO} controls preload="metadata" playsInline className="mx-auto mt-4 w-full max-w-3xl rounded-2xl bg-ink" />
      </div>
      <div className="mt-14 rounded-[2rem] bg-sun p-8 text-center pop">
        <h2 className="text-3xl text-ink">¿Listos para elegir?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-ink">Entra a tu equipo y avanza isla por isla con tu tallerista. 🌟</p>
        <Link to="/equipos" onClick={() => sfx.select()} className="mt-6 inline-block rounded-full bg-pink px-6 py-3 font-display text-lg text-ink pop-sm press">
          Ir a los equipos →
        </Link>
      </div>
    </div>
  );
}
