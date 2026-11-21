import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock,
  ExternalLink,
  LogOut,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Star,
  Trophy,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import {
  computeRemainingSeconds,
  formatDuration,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  PAUSE_PRESETS,
  updateHackathonState,
  useHackathonState,
  type TeamReview,
} from "@/lib/hackathon";
import { progressPercent } from "@/lib/progress";
import { retoOf } from "@/lib/retos";
import { sfx } from "@/lib/sound";
import { useLiveData, type Team } from "@/lib/teams";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Admin — Pixel Hack" },
      { name: "description", content: "Control del cronómetro, pausas, calificaciones, reviews y podio de Pixel Hack." },
    ],
  }),
  component: AdminPage,
});

type TabKey = "timer" | "reviews" | "podium";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const ok = await loginAdmin(username, password);
    setBusy(false);
    if (ok) {
      sfx.win();
      onSuccess();
    } else {
      sfx.back();
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="rounded-[2rem] bg-card p-8 pop">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-sun text-ink pop-sm">
          <ShieldCheck className="size-8" />
        </div>
        <h1 className="mt-4 text-center text-4xl text-navy">Panel de Admin</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Inicia sesión para controlar el cronómetro, calificar trabajos y presentar el podio.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block font-display text-sm text-ink">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="root"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-xl border-2 border-ink bg-background px-4 py-2.5 font-semibold text-ink outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block font-display text-sm text-ink">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-xl border-2 border-ink bg-background px-4 py-2.5 font-semibold text-ink outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-pink/40 px-3 py-2 text-center text-sm font-bold text-ink">
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-pink py-3 font-display text-lg text-ink pop-sm press disabled:opacity-50"
        >
          {busy ? "Entrando..." : "Entrar al panel 🔐"}
        </button>
      </form>
    </div>
  );
}

function TeamReviewCard({
  team,
  progress,
  existing,
  evidenceCount,
}: {
  team: Team;
  progress: number;
  existing?: TeamReview | undefined;
  evidenceCount: number;
}) {
  const [creativity, setCreativity] = useState(existing?.creativity ?? 8);
  const [design, setDesign] = useState(existing?.design ?? 8);
  const [impact, setImpact] = useState(existing?.impact ?? 8);
  const [pitch, setPitch] = useState(existing?.pitch ?? 8);
  const [review, setReview] = useState(existing?.review ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setCreativity(existing.creativity);
    setDesign(existing.design);
    setImpact(existing.impact);
    setPitch(existing.pitch);
    setReview(existing.review);
  }, [existing]);

  const total = creativity + design + impact + pitch;
  const reto = retoOf(team.reto);

  const save = async () => {
    const next: TeamReview = {
      teamId: team.id,
      teamName: team.name,
      creativity,
      design,
      impact,
      pitch,
      total,
      review: review.trim(),
      updatedAt: new Date().toISOString(),
    };
    await updateHackathonState((prev) => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [team.id]: next,
      },
    }));
    sfx.step();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <article className="rounded-[2rem] bg-card p-6 pop">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar config={team.avatar} className="w-20 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl text-navy">{team.name}</h3>
            {existing && (
              <span className="rounded-full bg-sun px-3 py-0.5 font-display text-sm text-ink">
                ⭐ {existing.total} / 40 pts
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {reto ? `${reto.emoji} Reto ${reto.n}: ${reto.title}` : "🗳️ Reto aún sin votar"} · Progreso: {progress}% · {evidenceCount} evidencias
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/equipos/$teamId"
              params={{ teamId: team.id }}
              onClick={() => sfx.click()}
              className="inline-flex items-center gap-1 rounded-full bg-cyan px-3 py-1 text-xs font-bold text-ink pop-sm press"
            >
              👀 Ver islas del equipo
            </Link>
            {team.drive_url ? (
              <a
                href={team.drive_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => sfx.click()}
                className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink pop-sm press"
              >
                <ExternalLink className="size-3.5" /> Abrir trabajo en Drive
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Sin enlace de Drive aún
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "💡 Creatividad", val: creativity, set: setCreativity },
          { label: "🎨 Diseño / Prototipo", val: design, set: setDesign },
          { label: "🌍 Impacto Medellín", val: impact, set: setImpact },
          { label: "🎤 Pitch", val: pitch, set: setPitch },
        ].map((c) => (
          <label key={c.label} className="rounded-2xl bg-background p-3 pop-sm">
            <div className="flex items-center justify-between text-sm font-bold text-ink">
              <span>{c.label}</span>
              <span className="font-display text-lg text-navy">{c.val}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={c.val}
              onChange={(e) => c.set(Number(e.target.value))}
              className="mt-2 w-full accent-pink"
            />
          </label>
        ))}
      </div>

      <div className="mt-4">
        <label className="block font-display text-sm text-ink">✍️ Review del jurado / tallerista</label>
        <textarea
          rows={2}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Ej: ¡Excelente prototipo en Canva! Muy clara la explicación del cuidado de las quebradas..."
          className="mt-1 w-full rounded-2xl border-2 border-ink bg-background p-3 text-sm text-ink outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg text-navy">
          Total: <span className="text-2xl text-ink">{total}</span> / 40 puntos
        </p>
        <button
          onClick={() => void save()}
          className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 font-display text-base text-ink pop-sm press"
        >
          {saved ? (
            <>
              <Check className="size-4" /> ¡Calificación guardada!
            </>
          ) : (
            <>
              <Star className="size-4" /> Guardar calificación y review
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabKey>("timer");
  const state = useHackathonState();
  const { teams, approvals, evidences, loading } = useLiveData();

  const [now, setNow] = useState(() => Date.now());
  const [customMinutes, setCustomMinutes] = useState("120");
  const [customPauseReason, setCustomPauseReason] = useState("");

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
  }, []);

  useEffect(() => {
    if (state.timer.status !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [state.timer.status]);

  const remaining = computeRemainingSeconds(state.timer, now);

  const rankedTeams = useMemo(() => {
    return teams
      .map((t) => ({
        team: t,
        review: state.reviews[t.id],
        progress: progressPercent(approvals, t.id),
      }))
      .sort((a, b) => (b.review?.total ?? -1) - (a.review?.total ?? -1) || b.progress - a.progress);
  }, [teams, state.reviews, approvals]);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  const startTimer = async () => {
    sfx.win();
    await updateHackathonState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        status: "running",
        startedAt: Date.now(),
        pauseReason: "",
      },
    }));
  };

  const pauseTimer = async (reason: string) => {
    sfx.back();
    const rem = computeRemainingSeconds(state.timer, Date.now());
    await updateHackathonState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        status: "paused",
        remainingSeconds: rem,
        startedAt: null,
        pauseReason: reason.trim() || "Hackathon en pausa",
      },
    }));
  };

  const resetTimer = async (minutes?: number) => {
    sfx.click();
    const secs = Math.max(60, Math.round((minutes ?? state.timer.durationSeconds / 60) * 60));
    await updateHackathonState((prev) => ({
      ...prev,
      timer: {
        status: "idle",
        durationSeconds: secs,
        remainingSeconds: secs,
        startedAt: null,
        pauseReason: "",
      },
    }));
  };

  const togglePodium = async () => {
    sfx.select();
    await updateHackathonState((prev) => ({
      ...prev,
      podiumPublished: !prev.podiumPublished,
    }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-navy sm:text-5xl">Panel de Admin 🛠️</h1>
          <p className="text-muted-foreground">Controla el cronómetro, las pausas, las calificaciones y la presentación del podio.</p>
        </div>
        <button
          onClick={() => {
            logoutAdmin();
            setAuthed(false);
            sfx.back();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 font-bold text-ink pop-sm press"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-3">
        {[
          { key: "timer" as const, label: "⏱️ Cronómetro y Pausas", bg: "bg-sun" },
          { key: "reviews" as const, label: `📝 Trabajos y Reviews (${teams.length})`, bg: "bg-cyan" },
          { key: "podium" as const, label: "🏆 Podio y Premiación", bg: "bg-pink" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              sfx.click();
              setTab(t.key);
            }}
            className={`rounded-full px-6 py-3 font-display text-base text-ink pop-sm press ${
              tab === t.key ? `${t.bg} ring-4 ring-ring` : "bg-card"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Cronómetro y Pausas */}
      {tab === "timer" && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-navy p-8 text-primary-foreground pop">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-card/15 px-4 py-1 text-sm font-bold">
                <Clock className="size-4" />
                {state.timer.status === "idle" && "En espera"}
                {state.timer.status === "running" && "🟢 En curso"}
                {state.timer.status === "paused" && "🟡 En pausa"}
                {state.timer.status === "finished" && "🔴 Finalizado"}
              </span>
              <span className="text-sm opacity-80">Total: {Math.round(state.timer.durationSeconds / 60)} min</span>
            </div>

            <p className="mt-6 text-center font-mono text-6xl font-extrabold tracking-wider text-sun sm:text-7xl">
              {formatDuration(remaining)}
            </p>

            {state.timer.status === "paused" && (
              <div className="mt-4 rounded-2xl bg-sun px-4 py-3 text-center font-display text-lg text-ink">
                ⏸️ PAUSA ACTIVA: {state.timer.pauseReason}
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {state.timer.status !== "running" ? (
                <button
                  onClick={() => void startTimer()}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan px-7 py-3 font-display text-lg text-ink pop-sm press"
                >
                  <Play className="size-5" />
                  {state.timer.status === "paused" ? "Reanudar Hackathon" : "Iniciar Hackathon"}
                </button>
              ) : (
                <button
                  onClick={() => void pauseTimer("⏸️ Pausa rápida")}
                  className="inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3 font-display text-lg text-ink pop-sm press"
                >
                  <Pause className="size-5" /> Pausar ahora
                </button>
              )}

              <button
                onClick={() => void resetTimer()}
                className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 font-display text-base text-ink pop-sm press"
              >
                <RotateCcw className="size-4" /> Reiniciar
              </button>
            </div>

            <div className="mt-8 border-t border-card/20 pt-5">
              <p className="text-sm font-bold opacity-90">Configurar duración:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[30, 60, 120, 180].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCustomMinutes(String(m));
                      void resetTimer(m);
                    }}
                    className="rounded-full bg-card/15 px-3 py-1 text-sm font-bold hover:bg-card/25"
                  >
                    {m < 60 ? `${m} min` : `${m / 60} h`}
                  </button>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const mins = Number(customMinutes);
                    if (mins >= 1 && mins <= 1440) void resetTimer(mins);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-20 rounded-full bg-card px-3 py-1 text-center text-sm font-bold text-ink"
                  />
                  <button type="submit" className="rounded-full bg-pink px-3 py-1 text-sm font-bold text-ink">
                    Aplicar min
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Motivos de pausa */}
          <div className="rounded-[2rem] bg-card p-8 pop">
            <h2 className="text-3xl text-navy">⏸️ Pausar con motivo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Todos los participantes verán el aviso en la parte superior de la pantalla mientras dure la pausa.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PAUSE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => void pauseTimer(p.value)}
                  className="rounded-2xl bg-sun/80 p-4 text-left font-display text-lg text-ink pop-sm press hover:bg-sun"
                >
                  {p.value}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customPauseReason.trim()) {
                  void pauseTimer(customPauseReason);
                  setCustomPauseReason("");
                }
              }}
              className="mt-6"
            >
              <label className="block font-display text-sm text-ink">Otro motivo de pausa</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={customPauseReason}
                  onChange={(e) => setCustomPauseReason(e.target.value)}
                  placeholder="Ej: Ajustando proyectores en el salón..."
                  className="flex-1 rounded-xl border-2 border-ink bg-background px-4 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-pink px-4 py-2 font-display text-sm text-ink pop-sm press"
                >
                  Pausar
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Tab 2: Trabajos y Reviews */}
      {tab === "reviews" && (
        <section className="mt-8 space-y-6">
          {loading ? (
            <p className="rounded-[2rem] bg-card p-8 text-center font-display text-xl text-navy pop">
              Cargando equipos...
            </p>
          ) : teams.length === 0 ? (
            <div className="rounded-[2rem] bg-card p-8 text-center pop">
              <p className="font-display text-2xl text-navy">Aún no hay equipos creados</p>
              <p className="mt-2 text-muted-foreground">
                Crea los equipos en la sección de Equipos para poder revisar sus carpetas de Drive y calificarlos aquí.
              </p>
              <Link
                to="/equipos"
                className="mt-5 inline-block rounded-full bg-cyan px-6 py-3 font-display text-ink pop-sm press"
              >
                Ir a Equipos →
              </Link>
            </div>
          ) : (
            teams.map((t) => (
              <TeamReviewCard
                key={t.id}
                team={t}
                progress={progressPercent(approvals, t.id)}
                existing={state.reviews[t.id]}
                evidenceCount={evidences.filter((e) => e.team_id === t.id).length}
              />
            ))
          )}
        </section>
      )}

      {/* Tab 3: Podio */}
      {tab === "podium" && (
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-sun p-6 pop">
            <div>
              <h2 className="text-3xl text-ink">🏆 Presentación del Podio</h2>
              <p className="text-sm font-semibold text-ink/80">
                {state.podiumPublished
                  ? "El podio está publicado: todos los equipos pueden ver el botón para abrirlo."
                  : "El podio está oculto para los equipos hasta que lo publiques."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void togglePodium()}
                className={`rounded-full px-5 py-2.5 font-display text-base text-ink pop-sm press ${
                  state.podiumPublished ? "bg-card" : "bg-cyan"
                }`}
              >
                {state.podiumPublished ? "🙈 Ocultar Podio" : "🚀 Publicar Podio"}
              </button>
              <Link
                to="/podio"
                onClick={() => sfx.win()}
                className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 font-display text-base text-ink pop-sm press"
              >
                <Trophy className="size-5" /> Abrir Presentación de Podio →
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-card p-6 pop">
            <h3 className="text-2xl text-navy">Vista previa de posiciones</h3>
            <div className="mt-4 space-y-3">
              {rankedTeams.length === 0 ? (
                <p className="text-muted-foreground">No hay equipos registrados todavía.</p>
              ) : (
                rankedTeams.map((item, idx) => (
                  <div
                    key={item.team.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-background p-4 pop-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl text-navy">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                      <Avatar config={item.team.avatar} className="w-12" />
                      <div>
                        <p className="font-display text-lg text-ink">{item.team.name}</p>
                        {item.review?.review && (
                          <p className="text-xs text-muted-foreground">“{item.review.review}”</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-navy">
                        {item.review ? `${item.review.total} / 40 pts` : "Sin calificar"}
                      </p>
                      <p className="text-xs text-muted-foreground">Progreso islas: {item.progress}%</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
