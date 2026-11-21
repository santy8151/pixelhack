import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import nube from "@/assets/nube.png";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos — Pixel Hack" },
      { name: "description", content: "Links de Canva, lenguajes de programación para niños y prompts de IA para crear soluciones." },
      { property: "og:title", content: "Recursos — Pixel Hack" },
      { property: "og:description", content: "Todo lo que necesitas para crear: Canva, código e IA." },
    ],
  }),
  component: Recursos,
});

const CANVA = [
  { t: "Canva para Educación", d: "Entra con tu cuenta de clase.", url: "https://www.canva.com/education/" },
  { t: "Plantillas de presentación", d: "Para mostrar tu solución.", url: "https://www.canva.com/presentations/templates/" },
  { t: "Plantillas de póster", d: "Haz un cartel de tu idea.", url: "https://www.canva.com/posters/templates/" },
  { t: "Canva Code", d: "Crea apps y juegos con IA.", url: "https://www.canva.com/canva-code/" },
];

const LANGS = [
  { t: "Scratch", d: "Programa con bloques de colores.", url: "https://scratch.mit.edu/", e: "🐱" },
  { t: "Code.org", d: "Juegos para aprender a programar.", url: "https://code.org/", e: "🧩" },
  { t: "MakeCode", d: "Crea juegos tipo arcade.", url: "https://arcade.makecode.com/", e: "🕹️" },
  { t: "HTML", d: "El idioma de las páginas web.", url: "https://developer.mozilla.org/es/docs/Learn/HTML", e: "🌐" },
];

const PROMPTS = [
  { t: "Entender el problema", p: "Soy un niño de Medellín. Explícame con palabras sencillas el problema de [tema] y a quién afecta." },
  { t: "Lluvia de ideas", p: "Dame 5 ideas divertidas y creativas para solucionar [problema] en mi barrio. Que sean fáciles de hacer." },
  { t: "Nombre genial", p: "Inventa 5 nombres cortos y chéveres para una app que ayuda a [qué hace]." },
  { t: "Mi prototipo", p: "Ayúdame a describir paso a paso cómo funcionaría mi idea: [idea]. Usa máximo 5 pasos." },
  { t: "Mejorar la idea", p: "Esta es mi solución: [idea]. ¿Qué 3 cosas podría mejorar para que más personas la usen?" },
  { t: "Presentarla", p: "Escribe un guion de 1 minuto para presentar mi proyecto [nombre] a la Alcaldía de Medellín." },
];

function LinkCard({ t, d, url, e, bg }: { t: string; d: string; url: string; e?: string; bg: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" onClick={() => sfx.click()} onMouseEnter={() => sfx.hover()}
      className={`flex items-start gap-3 rounded-2xl ${bg} p-4 pop-sm press`}>
      {e && <span className="text-3xl">{e}</span>}
      <div className="flex-1">
        <p className="font-display text-lg text-ink">{t}</p>
        <p className="text-sm text-ink/80">{d}</p>
      </div>
      <ExternalLink className="size-5 shrink-0 text-ink" />
    </a>
  );
}

function PromptCard({ t, p }: { t: string; p: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col rounded-2xl bg-card p-4 pop-sm">
      <p className="font-display text-lg text-navy">✨ {t}</p>
      <p className="mt-2 flex-1 rounded-xl bg-muted p-3 font-mono text-sm text-ink">{p}</p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(p);
          sfx.copy();
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        }}
        className="mt-3 flex items-center justify-center gap-2 rounded-full bg-sun py-2 font-bold text-ink pop-sm press"
      >
        {ok ? <><Check className="size-4" /> ¡Copiado!</> : <><Copy className="size-4" /> Copiar prompt</>}
      </button>
    </div>
  );
}

function Recursos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <img src={nube} alt="" className="w-28 floaty" />
        <div>
          <h1 className="text-5xl text-navy">Caja de recursos 🧰</h1>
          <p className="mt-2 text-lg text-muted-foreground">Todo lo que necesitas para crear tu solución.</p>
        </div>
      </div>

      <h2 className="mt-12 text-3xl text-ink">🎨 Canva</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CANVA.map((c) => <LinkCard key={c.t} {...c} bg="bg-cyan" />)}
      </div>

      <h2 className="mt-12 text-3xl text-ink">💻 Lenguajes de programación</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LANGS.map((c) => <LinkCard key={c.t} {...c} bg="bg-pink" />)}
      </div>

      <h2 className="mt-12 text-3xl text-ink">🤖 Prompts para la IA</h2>
      <p className="text-muted-foreground">Cópialos y cambia lo que está entre [corchetes].</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map((p) => <PromptCard key={p.t} {...p} />)}
      </div>
    </div>
  );
}
