import { createFileRoute } from "@tanstack/react-router";
import nube from "@/assets/nube.png";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/bienestar")({
  head: () => ({
    meta: [
      { title: "Zona de Recreación y Bienestar — Pixel Hack" },
      { name: "description", content: "Pausas activas, juegos y el Semáforo de Convivencia para cuidarnos durante el Pixel Hack." },
      { property: "og:title", content: "Zona de Recreación y Bienestar — Pixel Hack" },
      { property: "og:description", content: "Respirar, moverse, jugar y sentirnos seguros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bienestar,
});

const PAUSAS = [
  { n: 1, time: "1:40 p. m.", e: "🌬️", t: "Respiración divertida", d: "Inflamos un globo imaginario y soltamos todo lo que traemos." },
  { n: 2, time: "2:36 p. m.", e: "🤸", t: "Estiramiento creativo", d: "Nos movemos como animales, robots y superhéroes." },
  { n: 3, time: "3:02 p. m.", e: "🎯", t: "Juego de enfoque", d: "Un juego rapidito para calmarnos y concentrarnos." },
  { n: 4, time: "3:28 p. m.", e: "💪", t: "¡Súper confianza!", d: "Nos llenamos de energía antes de presentar el pitch." },
];

// Games get added as the organizers confirm them.
const JUEGOS = [
  { e: "🔴🟢", t: "Twister", d: "¡Mano en el verde, pie en el rojo! A ver quién no se cae." },
  { e: "❓", t: "Más juegos", d: "¡Muy pronto contaremos cuáles!" },
];

function Bienestar() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <img src={nube} alt="" className="w-36 floaty" />
        <div>
          <h1 className="text-5xl text-navy">Zona de Recreación y Bienestar 🧘</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Un solo lugar para descansar, jugar y cuidar cómo nos sentimos. Entre isla e isla venimos aquí <b className="text-ink">6 minutos</b> con nuestra psicóloga para recargar energía.
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-3xl text-ink">⏸️ Las 4 pausas activas</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {PAUSAS.map((p) => (
          <div key={p.n} onMouseEnter={() => sfx.hover()} className="flex gap-4 rounded-[2rem] bg-card p-5 pop">
            <span className="text-5xl">{p.e}</span>
            <div>
              <p className="text-sm font-bold text-pink">Pausa {p.n} · {p.time}</p>
              <p className="font-display text-xl text-ink">{p.t}</p>
              <p className="text-muted-foreground">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-3xl text-ink">🎲 Juegos</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {JUEGOS.map((j) => (
          <button key={j.t} onClick={() => sfx.laser()} className="rounded-[2rem] bg-sun p-5 text-left pop press">
            <span className="text-4xl">{j.e}</span>
            <p className="mt-2 font-display text-2xl text-ink">{j.t}</p>
            <p className="text-ink/80">{j.d}</p>
          </button>
        ))}
      </div>

      <h2 className="mt-12 text-3xl text-ink">🚦 Semáforo de Convivencia</h2>
      <p className="mt-2 text-muted-foreground">Al llegar te damos dos paletas. Úsalas cuando quieras, sin tener que decir nada:</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[2rem] bg-cyan p-6 pop">
          <p className="text-5xl">🟢</p>
          <p className="mt-2 font-display text-2xl text-ink">Paleta verde</p>
          <p className="text-ink">"¡Todo va genial! Quiero participar y dar mi idea."</p>
        </div>
        <div className="rounded-[2rem] bg-pink p-6 pop">
          <p className="text-5xl">🔴</p>
          <p className="mt-2 font-display text-2xl text-ink">Paleta roja</p>
          <p className="text-ink">"Necesito ayuda o algo me incomoda." Un adulto vendrá enseguida a acompañarte, con cariño.</p>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] bg-navy p-6 text-primary-foreground pop">
        <p className="font-display text-2xl">🤝 Nuestras reglas de espacio seguro</p>
        <ul className="mt-2 space-y-1">
          <li>❌ Cero bullying.</li>
          <li>🌈 Respetamos que todos pensamos y aprendemos distinto.</li>
          <li>💬 Todas las ideas valen y se escuchan.</li>
        </ul>
      </div>
    </div>
  );
}
