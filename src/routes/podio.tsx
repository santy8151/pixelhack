import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Confetti } from "@/components/Confetti";
import { useHackathonState } from "@/lib/hackathon";
import { progressPercent } from "@/lib/progress";
import { retoOf } from "@/lib/retos";
import { sfx } from "@/lib/sound";
import { useLiveData } from "@/lib/teams";

export const Route = createFileRoute("/podio")({
  head: () => ({
    meta: [
      { title: "Podio de Ganadores — Pixel Hack" },
      { name: "description", content: "Presentación oficial del podio y premiación de Pixel Hack Kids with Canva." },
    ],
  }),
  component: PodioPage,
});

function PodioPage() {
  const { reviews } = useHackathonState();
  const { teams, approvals, loading } = useLiveData();
  const [revealed, setRevealed] = useState<number>(3); // 0=none, 1=3rd, 2=3rd+2nd, 3=all

  const ranked = useMemo(() => {
    return teams
      .map((team) => ({
        team,
        review: reviews[team.id],
        progress: progressPercent(approvals, team.id),
      }))
      .sort((a, b) => (b.review?.total ?? -1) - (a.review?.total ?? -1) || b.progress - a.progress);
  }, [teams, reviews, approvals]);

  const first = ranked[0];
  const second = ranked[1];
  const third = ranked[2];
  const rest = ranked.slice(3);

  const revealNext = () => {
    if (revealed < 3) {
      const next = revealed + 1;
      setRevealed(next);
      if (next === 3) sfx.win();
      else sfx.step();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {revealed >= 3 && ranked.length > 0 && <Confetti count={100} />}

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-1 font-display text-sm text-ink pop-sm">
          <Trophy className="size-4" /> Premiación Pixel Hack
        </span>
        <h1 className="mt-3 text-5xl text-navy sm:text-6xl">🏆 Podio de Ganadores 🏆</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          ¡Felicitaciones a todos los equipos creadores de Medellín por su esfuerzo, creatividad y trabajo en equipo!
        </p>

        {/* Controles de presentación */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {revealed < 3 ? (
            <button
              onClick={revealNext}
              className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 font-display text-lg text-ink pop press"
            >
              <Sparkles className="size-5" />
              {revealed === 0 && "Revelar 3.º Lugar 🥉"}
              {revealed === 1 && "Revelar 2.º Lugar 🥈"}
              {revealed === 2 && "Revelar 1.º Lugar 🥇"}
            </button>
          ) : (
            <button
              onClick={() => {
                sfx.click();
                setRevealed(0);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 font-display text-sm text-ink pop-sm press"
            >
              <RotateCcw className="size-4" /> Modo suspenso (revelar uno por uno)
            </button>
          )}
          {revealed < 3 && (
            <button
              onClick={() => {
                sfx.win();
                setRevealed(3);
              }}
              className="rounded-full bg-sun px-5 py-2.5 font-display text-sm text-ink pop-sm press"
            >
              Mostrar todo el podio
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="mt-12 rounded-[2rem] bg-card p-10 text-center font-display text-2xl text-navy pop">
          Cargando resultados...
        </p>
      ) : ranked.length === 0 ? (
        <div className="mt-12 rounded-[2rem] bg-card p-10 text-center pop">
          <p className="font-display text-2xl text-navy">Aún no hay equipos en el podio</p>
          <p className="mt-2 text-muted-foreground">
            Registra los equipos y califica sus trabajos desde el Panel de Admin.
          </p>
          <Link
            to="/admin"
            className="mt-5 inline-block rounded-full bg-pink px-6 py-3 font-display text-ink pop-sm press"
          >
            Ir al Panel de Admin →
          </Link>
        </div>
      ) : (
        <>
          {/* Escalones del Podio: 2do - 1ro - 3ro */}
          <div className="mt-12 grid items-end gap-6 md:grid-cols-3">
            {/* 2do Lugar */}
            <div className="order-2 md:order-1">
              {second && (
                <div
                  className={`rounded-[2rem] bg-cyan p-6 text-center pop transition-all duration-500 ${
                    revealed >= 2 ? "opacity-100 translate-y-0" : "opacity-20 translate-y-4 blur-sm"
                  }`}
                >
                  <p className="font-display text-4xl">🥈 2.º Lugar</p>
                  <Avatar config={second.team.avatar} animate={revealed >= 2} className="mx-auto mt-4 w-32" />
                  <h2 className="mt-3 text-3xl text-ink">{second.team.name}</h2>
                  {retoOf(second.team.reto) && (
                    <p className="mt-1 text-sm font-bold text-ink/80">
                      {retoOf(second.team.reto)?.emoji} {retoOf(second.team.reto)?.title}
                    </p>
                  )}
                  <p className="mt-3 inline-block rounded-full bg-card px-4 py-1 font-display text-xl text-navy pop-sm">
                    {second.review ? `${second.review.total} / 40 pts` : `${second.progress}% progreso`}
                  </p>
                  {second.review?.review && (
                    <p className="mt-3 rounded-2xl bg-card/80 p-3 text-sm italic text-ink">
                      “{second.review.review}”
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 1er Lugar */}
            <div className="order-1 md:order-2">
              {first && (
                <div
                  className={`rounded-[2rem] bg-sun p-8 text-center pop transition-all duration-500 md:pb-12 ${
                    revealed >= 3 ? "opacity-100 scale-100" : "opacity-20 scale-95 blur-sm"
                  }`}
                >
                  <p className="font-display text-5xl pulse-pop">🥇 1.º Lugar</p>
                  <Avatar config={first.team.avatar} animate={revealed >= 3} className="mx-auto mt-4 w-44" />
                  <h2 className="mt-3 text-4xl text-navy">{first.team.name}</h2>
                  {retoOf(first.team.reto) && (
                    <p className="mt-1 text-sm font-bold text-ink/80">
                      {retoOf(first.team.reto)?.emoji} {retoOf(first.team.reto)?.title}
                    </p>
                  )}
                  <p className="mt-4 inline-block rounded-full bg-pink px-5 py-1.5 font-display text-2xl text-ink pop-sm">
                    {first.review ? `⭐ ${first.review.total} / 40 pts` : `${first.progress}% progreso`}
                  </p>
                  {first.review?.review && (
                    <p className="mt-4 rounded-2xl bg-card/90 p-3 text-sm italic text-ink">
                      “{first.review.review}”
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3er Lugar */}
            <div className="order-3">
              {third && (
                <div
                  className={`rounded-[2rem] bg-pink p-6 text-center pop transition-all duration-500 ${
                    revealed >= 1 ? "opacity-100 translate-y-0" : "opacity-20 translate-y-4 blur-sm"
                  }`}
                >
                  <p className="font-display text-4xl">🥉 3.º Lugar</p>
                  <Avatar config={third.team.avatar} animate={revealed >= 1} className="mx-auto mt-4 w-28" />
                  <h2 className="mt-3 text-3xl text-ink">{third.team.name}</h2>
                  {retoOf(third.team.reto) && (
                    <p className="mt-1 text-sm font-bold text-ink/80">
                      {retoOf(third.team.reto)?.emoji} {retoOf(third.team.reto)?.title}
                    </p>
                  )}
                  <p className="mt-3 inline-block rounded-full bg-card px-4 py-1 font-display text-xl text-navy pop-sm">
                    {third.review ? `${third.review.total} / 40 pts` : `${third.progress}% progreso`}
                  </p>
                  {third.review?.review && (
                    <p className="mt-3 rounded-2xl bg-card/80 p-3 text-sm italic text-ink">
                      “{third.review.review}”
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Menciones especiales */}
          {rest.length > 0 && (
            <section className="mt-14 rounded-[2rem] bg-card p-6 pop">
              <h2 className="text-center text-3xl text-navy">🌟 Menciones Especiales</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, idx) => (
                  <div key={item.team.id} className="flex items-center gap-3 rounded-2xl bg-background p-4 pop-sm">
                    <span className="font-display text-xl text-navy">#{idx + 4}</span>
                    <Avatar config={item.team.avatar} className="w-14 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg text-ink">{item.team.name}</p>
                      <p className="text-xs font-bold text-muted-foreground">
                        {item.review ? `${item.review.total} / 40 pts` : `${item.progress}% progreso`}
                      </p>
                      {item.review?.review && (
                        <p className="mt-1 line-clamp-2 text-xs italic text-ink/80">“{item.review.review}”</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
