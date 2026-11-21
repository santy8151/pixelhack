import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Dices, Pencil, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Confetti } from "@/components/Confetti";
import { sfx } from "@/lib/sound";
import { randomAvatar, STAGES, teamsApi, useLiveData, type Approval, type AvatarConfig, type Team } from "@/lib/teams";
import { hasWon, progressPercent, stageDone, stagesDone } from "@/lib/progress";
import { retoOf } from "@/lib/retos";

export const Route = createFileRoute("/equipos/")({
  head: () => ({
    meta: [
      { title: "Equipos y avatares — Pixel Hack" },
      { name: "description", content: "Crea el avatar de tu equipo y sigue su progreso en el camino del Design Thinking." },
      { property: "og:title", content: "Equipos y avatares — Pixel Hack" },
      { property: "og:description", content: "Crea tu avatar y avanza isla por isla hasta ganar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Equipos,
});

const OPTIONS: { key: keyof AvatarConfig; label: string; values: { v: string; l: string }[] }[] = [
  { key: "shape", label: "Cuerpo", values: [{ v: "estrella", l: "⭐ Estrella" }, { v: "cubo", l: "🟪 Cubo" }, { v: "bolita", l: "🔵 Bolita" }, { v: "nube", l: "☁️ Nube" }] },
  { key: "color", label: "Color", values: [{ v: "cyan", l: "Cian" }, { v: "pink", l: "Rosa" }, { v: "sun", l: "Amarillo" }, { v: "navy", l: "Azul" }] },
  { key: "eyes", label: "Ojitos", values: [{ v: "grandes", l: "👀 Grandes" }, { v: "felices", l: "😊 Felices" }, { v: "guino", l: "😉 Guiño" }, { v: "estrellas", l: "🤩 Estrellas" }] },
  { key: "mouth", label: "Boca", values: [{ v: "sonrisa", l: "🙂 Sonrisa" }, { v: "abierta", l: "😃 Feliz" }, { v: "lengua", l: "😛 Lengua" }, { v: "o", l: "😮 Sorpresa" }] },
  { key: "extra", label: "Accesorio", values: [{ v: "nada", l: "Nada" }, { v: "gorra", l: "🧢 Gorra" }, { v: "lentes", l: "🤓 Lentes" }, { v: "corona", l: "👑 Corona" }, { v: "antena", l: "📡 Antena" }] },
];

const SWATCH: Record<string, string> = { cyan: "bg-cyan", pink: "bg-pink", sun: "bg-sun", navy: "bg-navy" };

function newTeam(): Team {
  return { id: "", name: "", reto: 0, avatar: randomAvatar(), drive_url: "", created_at: "" };
}

function Editor({ initial, onClose }: { initial: Team; onClose: () => void }) {
  const [t, setT] = useState(initial);
  const set = (k: keyof AvatarConfig, v: string) => {
    sfx.click();
    setT({ ...t, avatar: { ...t.avatar, [k]: v } as AvatarConfig });
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/60 p-4">
      <div className="relative w-full max-w-3xl rounded-[2rem] bg-card p-6 pop">
        <button onClick={() => { sfx.back(); onClose(); }} aria-label="Cerrar" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-muted pop-sm press">
          <X className="size-5" />
        </button>
        <h2 className="text-3xl text-navy">Crea tu avatar 🎨</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="text-center">
            <div className="rounded-3xl bg-muted p-2 pop-sm"><Avatar config={t.avatar} animate className="w-full" /></div>
            <button onClick={() => { sfx.laser(); setT({ ...t, avatar: randomAvatar() }); }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 font-bold text-ink pop-sm press">
              <Dices className="size-4" /> ¡Sorpréndeme!
            </button>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="font-display text-lg">Nombre del equipo</span>
              <input value={t.name} maxLength={24} onChange={(e) => { sfx.hover(); setT({ ...t, name: e.target.value }); }}
                placeholder="Ej: Los Pixelitos" className="mt-1 w-full rounded-2xl bg-background px-4 py-3 text-lg font-semibold pop-sm outline-none focus:ring-4 focus:ring-ring" />
            </label>
            <label className="block">
              <span className="font-display text-lg">📁 Carpeta de Drive del equipo <span className="text-sm text-muted-foreground">(la pega el tallerista)</span></span>
              <input value={t.drive_url} onChange={(e) => setT({ ...t, drive_url: e.target.value })}
                placeholder="https://drive.google.com/..." className="mt-1 w-full rounded-2xl bg-background px-4 py-2 text-sm pop-sm outline-none focus:ring-4 focus:ring-ring" />
            </label>
            {OPTIONS.map((o) => (
              <div key={o.key}>
                <span className="font-display text-lg">{o.label}</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {o.values.map((v) => {
                    const on = t.avatar[o.key] === v.v;
                    return o.key === "color" ? (
                      <button key={v.v} aria-label={v.l} onClick={() => set(o.key, v.v)}
                        className={`size-10 rounded-full pop-sm press ${SWATCH[v.v]} ${on ? "ring-4 ring-ring ring-offset-2" : ""}`} />
                    ) : (
                      <button key={v.v} onClick={() => set(o.key, v.v)}
                        className={`rounded-full px-3 py-1.5 text-sm font-bold pop-sm press ${on ? "bg-cyan" : "bg-background"}`}>{v.l}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button disabled={!t.name.trim()} onClick={async () => {
              try {
                await teamsApi.save({ ...(t.id ? { id: t.id } : {}), name: t.name.trim(), avatar: t.avatar, drive_url: t.drive_url.trim() });
                sfx.win(); onClose();
              } catch { alert("No se pudo guardar. Revisa la conexión e intenta otra vez."); }
            }}
              className="w-full rounded-full bg-pink py-3 font-display text-xl text-ink pop press disabled:opacity-50">
              ✅ ¡Listo, guardar equipo!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ t, evs, onEdit }: { t: Team; evs: Approval[]; onEdit: () => void }) {
  const reto = retoOf(t.reto);
  const p = stagesDone(evs, t.id);
  const pct = progressPercent(evs, t.id);
  const won = hasWon(evs, t.id);
  return (
    <div className={`rounded-[2rem] p-5 pop ${won ? "bg-sun" : "bg-card"}`}>
      <div className="flex items-center gap-4">
        <Avatar config={t.avatar} animate={won} className="size-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <Link to="/equipos/$teamId" params={{ teamId: t.id }} onClick={() => sfx.select()} className="block truncate font-display text-2xl text-ink hover:underline">{t.name}</Link>
          <p className="text-sm font-semibold text-muted-foreground">{reto ? `${reto.emoji} Reto ${reto.n}` : "🗳️ Reto por votar"} · {"⭐".repeat(p)}{"☆".repeat(STAGES.length - p)} · {pct}%</p>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted pop-sm">
            <div className="h-full bg-wave transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => { sfx.click(); onEdit(); }} aria-label="Editar" className="grid size-9 place-items-center rounded-full bg-cyan pop-sm press"><Pencil className="size-4" /></button>
          <button onClick={() => { if (confirm(`¿Borrar el equipo ${t.name}?`)) { sfx.undo(); void teamsApi.remove(t.id, []); } }} aria-label="Borrar" className="grid size-9 place-items-center rounded-full bg-muted pop-sm press"><Trash2 className="size-4" /></button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {STAGES.map((s, i) => {
          const done = stageDone(evs, t.id, i);
          return (
            <div key={s.key} title={s.desc}
              className={`flex flex-col items-center rounded-2xl p-2 text-center pop-sm ${done ? "bg-cyan" : "bg-background"}`}>
              <span className={`text-2xl ${done ? "" : "grayscale opacity-60"}`}>{s.emoji}</span>
              <span className="text-[9px] font-bold leading-tight text-ink break-words w-full">{s.title}</span>
            </div>
          );
        })}
      </div>
      <Link to="/equipos/$teamId" params={{ teamId: t.id }} onClick={() => sfx.select()}
        className="mt-4 block rounded-full bg-pink py-2 text-center font-display text-lg text-ink pop-sm press">🗺️ Entrar a las islas</Link>
      {won && <p className="mt-3 text-center font-display text-xl text-ink pulse-pop">🏆 ¡GANARON! 🏆</p>}
    </div>
  );
}

function Equipos() {
  const { teams, approvals } = useLiveData();
  const [editing, setEditing] = useState<Team | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl text-navy">Equipos 🎮</h1>
          <p className="mt-2 max-w-xl text-lg text-muted-foreground">Crea el avatar de tu equipo y entra a sus islas. Cuando el tallerista aprueba una isla, ¡avanzan! Con las 5 islas, ganan.</p>
        </div>
        <button onClick={() => { sfx.select(); setEditing(newTeam()); }}
          className="rounded-full bg-pink px-6 py-3 font-display text-xl text-ink pop press">➕ Nuevo equipo</button>
      </div>

      {teams.length === 0 ? (
        <button onClick={() => { sfx.select(); setEditing(newTeam()); }}
          className="mt-10 w-full rounded-[2rem] border-[3px] border-dashed border-ink bg-card/60 p-8 font-display text-xl text-muted-foreground press">
          Aún no hay equipos. ¡Toca para crear el primero! ✨
        </button>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => <TeamCard key={t.id} t={t} evs={approvals} onEdit={() => setEditing(t)} />)}
        </div>
      )}

      {editing && <Editor initial={editing} onClose={() => setEditing(null)} />}

      {winner && (
        <>
          <Confetti />
          <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" onClick={() => setWinner(null)}>
            <div className="w-full max-w-md rounded-[2rem] bg-sun p-8 text-center pop">
              <p className="font-display text-5xl text-ink pulse-pop">¡GANARON!</p>
              <Avatar config={winner.avatar} animate className="mx-auto mt-4 w-48" />
              <p className="mt-2 font-display text-3xl text-navy">{winner.name}</p>
              <p className="mt-2 text-ink">Completaron todo el camino del Design Thinking 🏆</p>
              <button className="mt-6 rounded-full bg-pink px-6 py-3 font-display text-lg text-ink pop-sm press">¡Yupi! 🎉</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
