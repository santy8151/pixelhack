import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import chispa from "@/assets/chispa.png";
import cubo from "@/assets/cubo.png";
import bolita from "@/assets/bolita.png";
import nube from "@/assets/nube.png";
import { sfx } from "@/lib/sound";
import { STAGES } from "@/lib/teams";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Hack Kids with Canva — Hackathon infantil en Medellín" },
      { name: "description", content: "Niños y niñas resuelven 3 retos de ciudad de la Alcaldía de Medellín con Canva, código e inteligencia artificial." },
      { property: "og:title", content: "Pixel Hack Kids with Canva" },
      { property: "og:description", content: "El hackathon donde los niños crean soluciones para Medellín." },
    ],
  }),
  component: Index,
});

const CHARACTERS = [
  { img: chispa, name: "Chispa", say: "¡Yo traigo las ideas más locas!", bg: "bg-cyan" },
  { img: cubo, name: "Cubo", say: "¡Hola! Yo armo prototipos.", bg: "bg-pink" },
  { img: bolita, name: "Bolita", say: "¡Me encanta dibujar en Canva!", bg: "bg-cyan" },
  { img: nube, name: "Nube", say: "¡Escribo prompts para la IA!", bg: "bg-sun" },
];

function Index() {
  return (
    <div>
      {/* Portada */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-16 text-center">
        <img src={chispa} alt="" className="absolute left-2 top-24 hidden w-36 floaty md:block" />
        <img src={nube} alt="" className="absolute right-4 top-16 hidden w-28 floaty md:block" style={{ animationDelay: "1s" }} />
        <img src={logo} alt="Pixel Hack Kids with Canva" className="mx-auto w-full max-w-md drop-shadow-sm" />
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-muted-foreground sm:text-xl">
          ¡Un hackathon para niños y niñas creadores! Juntos vamos a resolver <b className="text-ink">3 retos de ciudad</b> de la Alcaldía de Medellín usando Canva, código e inteligencia artificial.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/equipos" onClick={() => sfx.select()} onMouseEnter={() => sfx.hover()}
            className="rounded-full bg-pink px-8 py-4 font-display text-xl text-ink pop press">
            🎮 ¡Crear mi equipo!
          </Link>
          <Link to="/retos" onClick={() => sfx.select()} onMouseEnter={() => sfx.hover()}
            className="rounded-full bg-sun px-8 py-4 font-display text-xl text-ink pop press">
            🏙️ Ver los retos
          </Link>
        </div>
      </section>

      {/* Qué es */}
      <section className="bg-wave border-y-[3px] border-ink py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {[
            { e: "🧠", t: "Pensamos", d: "Conocemos un problema real de Medellín y a las personas que lo viven." },
            { e: "🎨", t: "Creamos", d: "Diseñamos soluciones en Canva, con código y con ayuda de la IA." },
            { e: "🏆", t: "Ganamos", d: "Cada paso nos da estrellas. ¡Al terminar todo el camino, ganamos!" },
          ].map((c, i) => (
            <div key={c.t} onMouseEnter={() => sfx.hover()}
              className="rounded-3xl bg-card p-6 pop press" style={{ rotate: `${(i - 1) * 1.5}deg` }}>
              <div className="text-5xl">{c.e}</div>
              <h3 className="mt-3 text-2xl text-navy">{c.t}</h3>
              <p className="mt-2 text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personajes */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-4xl text-navy sm:text-5xl">¡Conoce a la pandilla!</h2>
        <p className="mt-2 text-center text-muted-foreground">Toca a cada personaje para saludarlo 👋</p>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {CHARACTERS.map((c, i) => (
            <button key={c.name} onClick={() => (i % 2 ? sfx.laser() : sfx.step())} onMouseEnter={() => sfx.hover()}
              className="group rounded-3xl bg-card p-4 text-center pop press">
              <div className={`mx-auto grid aspect-square place-items-center rounded-2xl ${c.bg}/30 p-3`}>
                <img src={c.img} alt={c.name} className="max-h-40 transition-transform group-hover:scale-110 group-active:rotate-12" />
              </div>
              <p className="mt-3 font-display text-xl text-ink">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.say}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Design thinking */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[2rem] bg-navy p-8 text-primary-foreground pop sm:p-12">
          <h2 className="text-4xl sm:text-5xl">El camino del <span className="text-sun">Design Thinking</span></h2>
          <p className="mt-3 max-w-2xl opacity-90">Así vamos a trabajar. Son 5 niveles, como en un videojuego. Cuando tu equipo completa los 5… ¡GANA! 🏆</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-5">
            {STAGES.map((s, i) => (
              <li key={s.key} onMouseEnter={() => sfx.hover()} className="rounded-2xl bg-card p-4 text-ink pop-sm">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-sun font-display">{i + 1}</span>
                  <span className="text-2xl">{s.emoji}</span>
                </div>
                <p className="mt-2 font-display text-lg">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Agenda */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-center text-4xl text-navy sm:text-5xl">La agenda del día 🗓️</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map((s) => (
            <li key={s.key} className={`rounded-2xl ${s.bg} p-4 text-ink pop-sm`}>
              <p className="font-display text-sm">{s.time}</p>
              <p className="mt-1 font-display text-lg">{s.emoji} {s.world}</p>
              <p className="text-sm">Con {s.guide}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-card p-5 text-center text-lg text-ink pop-sm">
          💡 <b>Las ideas son 100% de ustedes.</b> Los talleristas y la IA ayudan, pero quienes crean y deciden son los niños.
        </p>
      </section>
    </div>
  );
}
