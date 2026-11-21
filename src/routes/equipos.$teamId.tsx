import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Lock, Undo2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Confetti } from "@/components/Confetti";
import { sfx } from "@/lib/sound";
import { STAGES, teamsApi, useLiveData, type Team } from "@/lib/teams";
import { hasWon, progressPercent, stageDone, stageUnlocked } from "@/lib/progress";
import { IDEACION_VIDEO, RETOS, retoOf } from "@/lib/retos";

export const Route = createFileRoute("/equipos/$teamId")({
  head: () => ({
    meta: [
      { title: "Las 5 islas de mi equipo — Pixel Hack" },
      { name: "description", content: "Recorre las 5 islas del Design Thinking con tu equipo y avanza con la aprobación del tallerista." },
      { property: "og:title", content: "Las 5 islas de mi equipo — Pixel Hack" },
      { property: "og:description", content: "Empatía, Definición, Ideación, Prototipado y Probar y Comunicar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeamPage,
});

function narrator(t: Team, current: number) {
  const r = retoOf(t.reto);
  const s = STAGES[Math.min(current, 4)]!;
  const lines = [`¡Hola, ${t.name}! Soy su avatar y los voy a acompañar por las 5 islas. 🚀`];
  if (current >= 5) return [...lines, "¡Lo lograron! Aprobaron las 5 islas. ¡Son unos creadores increíbles! 🏆"];
  if (r) lines.push(`Nuestro reto es ${r.emoji} ${r.title}.`, r.desc, `Nuestra misión: ${r.mission}`);
  else lines.push("Hoy hay 3 retos de Medellín: la salud mental y la soledad, las oportunidades y la convivencia segura. En la Isla 2 votamos cuál resolver.");
  lines.push(`Ahora vamos a la ${s.world}: ${s.desc}`, `Cuando terminen, guarden ${s.deliverable.toLowerCase()} en su carpeta de Drive y llamen al tallerista. 📁`);
  return lines;
}

function Narrator({ t, current }: { t: Team; current: number }) {
  const lines = useMemo(() => narrator(t, current), [t, current]);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  useEffect(() => setI(0), [lines]);
  useEffect(() => {
    const line = lines[i] ?? "";
    setTyped("");
    let n = 0;
    const id = setInterval(() => {
      n++;
      setTyped(line.slice(0, n));
      if (n % 3 === 0) sfx.hover();
      if (n >= line.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [i, lines]);
  const talking = typed.length < (lines[i]?.length ?? 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
      <div className={talking ? "wiggle" : "floaty"}><Avatar config={t.avatar} animate className="w-40 shrink-0" /></div>
      <div className="relative flex-1 rounded-[2rem] bg-card p-5 pop">
        <p className="min-h-[4.5rem] text-lg font-semibold text-ink">{typed}<span className="animate-pulse">▍</span></p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{i + 1}/{lines.length}</span>
          <button onClick={() => { sfx.step(); setI((i + 1) % lines.length); }}
            className="rounded-full bg-sun px-4 py-1.5 font-bold text-ink pop-sm press">{i + 1 < lines.length ? "Siguiente ▶" : "Otra vez ↺"}</button>
        </div>
      </div>
    </div>
  );
}

function TeamPage() {
  const { teamId } = Route.useParams();
  const { teams, approvals, loading } = useLiveData();
  const t = teams.find((x) => x.id === teamId);
  const [vote, setVote] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [party, setParty] = useState(false);

  if (!t) return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-display text-3xl text-navy">{loading ? "Cargando… ⏳" : "No encontramos este equipo 🤔"}</p>
      <Link to="/equipos" className="mt-6 inline-block rounded-full bg-pink px-6 py-3 font-display text-ink pop-sm press">← Volver a equipos</Link>
    </div>
  );

  const pct = progressPercent(approvals, t.id);
  const current = STAGES.findIndex((_, s) => !stageDone(approvals, t.id, s));
  const cur = current === -1 ? 5 : current;
  const won = hasWon(approvals, t.id);

  const approve = async (s: number, ok: boolean) => {
    setBusy(true);
    try {
      await teamsApi.setApproval(t.id, s, ok, s === 1 ? (vote ?? undefined) : undefined);
      if (ok) { sfx.win(); if (s === 4) setParty(true); } else sfx.undo();
    } catch { /* message already shown */ } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/equipos" onClick={() => sfx.back()} className="font-bold text-navy hover:underline">← Todos los equipos</Link>
      <h1 className="mt-2 text-5xl text-navy">{t.name}</h1>

      <div className="mt-4 rounded-[2rem] bg-card p-4 pop-sm">
        <div className="flex items-center justify-between font-display text-ink"><span>Progreso</span><span>{pct}%</span></div>
        <div className="mt-2 h-5 overflow-hidden rounded-full bg-muted pop-sm"><div className="h-full bg-wave transition-all duration-700" style={{ width: `${pct}%` }} /></div>
        {t.drive_url ? (
          <a href={t.drive_url} target="_blank" rel="noreferrer" onClick={() => sfx.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-2 font-bold text-ink pop-sm press"><FolderOpen className="size-5" /> Abrir nuestra carpeta de Drive</a>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">📁 Su tallerista pegará aquí el enlace de la carpeta de Drive (botón ✏️ en la tarjeta del equipo).</p>
        )}
      </div>

      <div className="mt-8"><Narrator t={t} current={cur} /></div>

      <ol className="mt-10 space-y-6">
        {STAGES.map((s, i) => {
          const done = stageDone(approvals, t.id, i);
          const open = stageUnlocked(approvals, t.id, i);
          return (
            <li key={s.key} className={`rounded-[2rem] p-6 pop ${done ? "bg-cyan/40" : open ? "bg-card" : "bg-muted opacity-70"}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`grid size-14 place-items-center rounded-2xl text-3xl pop-sm ${s.bg}`}>{s.emoji}</span>
                <div className="flex-1">
                  <h2 className="text-2xl text-ink">{s.world}</h2>
                  <p className="text-sm font-semibold text-muted-foreground">🕐 {s.time} · 🧑‍🏫 {s.guide} · {s.tool}</p>
                </div>
                {done ? <span className="inline-flex items-center gap-1 rounded-full bg-cyan px-3 py-1 font-bold text-ink"><CheckCircle2 className="size-4" /> Aprobada</span>
                  : !open && <span className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-sm font-bold text-primary-foreground"><Lock className="size-4" /> Bloqueada</span>}
              </div>

              {open && (
                <>
                  <p className="mt-4 text-lg text-ink">{s.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {s.steps.map((x, k) => <li key={k} className="flex gap-2 text-ink"><span className="font-display text-pink">{k + 1}.</span>{x}</li>)}
                  </ul>

                  {i === 0 && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {RETOS.map((r) => (
                        <div key={r.n} className="rounded-2xl bg-background p-3 pop-sm">
                          <video src={r.video} controls preload="metadata" playsInline className="aspect-video w-full rounded-xl bg-ink" />
                          <p className="mt-2 font-display text-ink">{r.emoji} {r.title}</p>
                          <p className="text-xs text-muted-foreground">Reto {r.n} · {r.short}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {i === 1 && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {RETOS.map((r) => {
                        const on = done ? t.reto === r.n : vote === r.n;
                        return (
                          <button key={r.n} disabled={done} onClick={() => { sfx.select(); setVote(r.n); }}
                            className={`rounded-2xl p-3 text-left pop-sm press ${on ? `${r.bg} ring-4 ring-ring` : "bg-background"}`}>
                            <img src={r.img} alt="" className="mx-auto h-20" />
                            <p className="mt-2 font-display text-ink">{r.emoji} {r.title}</p>
                            <p className="text-xs text-ink/80">{r.mission}</p>
                            {on && <p className="mt-1 font-bold text-ink">🏅 ¡Nuestro reto!</p>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {i === 2 && (
                    <div className="mt-5 rounded-2xl bg-background p-3 pop-sm">
                      <video src={IDEACION_VIDEO} controls preload="metadata" playsInline className="mx-auto aspect-video w-full max-w-2xl rounded-xl bg-ink" />
                      <p className="mt-2 text-center font-display text-ink">💡 Video guía · Isla 3: Ideación</p>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl bg-sun/40 p-4">
                    <p className="font-display text-ink">📦 Entregable: <span className="font-sans font-semibold">{s.deliverable}</span></p>
                    <p className="text-sm text-ink/80">Súbanlo a su carpeta de Drive y muéstrenselo al tallerista.</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {!done ? (
                      <button disabled={busy || (i === 1 && !vote)} onClick={() => approve(i, true)}
                        className="rounded-full bg-pink px-6 py-3 font-display text-lg text-ink pop press disabled:opacity-50">
                        ✅ Aprobado por tallerista
                      </button>
                    ) : (
                      <button disabled={busy} onClick={() => { if (confirm("¿Quitar la aprobación de esta isla (y las siguientes)?")) void approve(i, false); }}
                        className="inline-flex items-center gap-1 rounded-full bg-background px-4 py-2 text-sm font-bold text-ink pop-sm press"><Undo2 className="size-4" /> Quitar aprobación</button>
                    )}
                    {i === 1 && !done && !vote && <p className="self-center text-sm text-muted-foreground">Primero toquen el reto que ganó la votación.</p>}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>

      {won && <p className="mt-10 text-center font-display text-4xl text-navy pulse-pop">🏆 ¡GANARON! 🏆</p>}

      {party && (
        <>
          <Confetti />
          <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" onClick={() => setParty(false)}>
            <div className="w-full max-w-md rounded-[2rem] bg-sun p-8 text-center pop">
              <p className="font-display text-5xl text-ink pulse-pop">¡GANARON!</p>
              <Avatar config={t.avatar} animate className="mx-auto mt-4 w-48" />
              <p className="mt-2 font-display text-3xl text-navy">{t.name}</p>
              <p className="mt-2 text-ink">Recorrieron las 5 islas del Design Thinking 🏆</p>
              <button className="mt-6 rounded-full bg-pink px-6 py-3 font-display text-lg text-ink pop-sm press">¡Yupi! 🎉</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
