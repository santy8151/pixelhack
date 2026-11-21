import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PauseCircle, Timer, Trophy } from "lucide-react";
import { computeRemainingSeconds, formatDuration, useHackathonState } from "@/lib/hackathon";
import { sfx } from "@/lib/sound";

export function HackathonTimerBar() {
  const { timer, podiumPublished } = useHackathonState();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (timer.status !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timer.status]);

  const showTimer = timer.status !== "idle";
  if (!showTimer && !podiumPublished) return null;

  const remaining = computeRemainingSeconds(timer, now);
  const isPaused = timer.status === "paused";
  const isFinished = timer.status === "finished" || (timer.status === "running" && remaining === 0);

  return (
    <div
      className={`border-t-[2px] border-ink px-4 py-1.5 text-sm font-bold ${
        isPaused
          ? "bg-sun text-ink"
          : isFinished
            ? "bg-pink text-ink"
            : "bg-navy text-primary-foreground"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3">
        {showTimer && (
          <div className="flex items-center gap-2">
            {isPaused ? <PauseCircle className="size-4 shrink-0" /> : <Timer className="size-4 shrink-0" />}
            {isPaused ? (
              <span>
                PAUSA: {timer.pauseReason || "Hackathon en pausa"} ·{" "}
                <span className="font-mono text-base">{formatDuration(remaining)}</span>
              </span>
            ) : isFinished ? (
              <span>⏰ ¡Tiempo de la Hackathon finalizado!</span>
            ) : (
              <span>
                Tiempo de Hackathon:{" "}
                <span className="rounded-md bg-card/15 px-2 py-0.5 font-mono text-base tracking-wider">
                  {formatDuration(remaining)}
                </span>
              </span>
            )}
          </div>
        )}

        {podiumPublished && (
          <Link
            to="/podio"
            onClick={() => sfx.select()}
            className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-0.5 font-display text-xs text-ink pop-sm press"
          >
            <Trophy className="size-3.5" /> ¡Ver el Podio!
          </Link>
        )}
      </div>
    </div>
  );
}
