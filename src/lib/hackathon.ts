import { useEffect, useState } from "react";
import * as fns from "./hackathon.functions";
import type { ServerHackathonState } from "./hackathon.functions";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export type HackathonTimerState = ServerHackathonState["timer"];

export type TeamReview = ServerHackathonState["reviews"][string];

export type HackathonState = ServerHackathonState;

export const PAUSE_PRESETS = [
  { label: "Se movieron de isla", value: "🏝️ Se movieron de isla" },
  { label: "Están comiendo", value: "🍕 Están comiendo" },
  { label: "Descanso / Baño", value: "🚻 Descanso / Baño" },
  { label: "Anuncio del tallerista", value: "📢 Anuncio del tallerista" },
] as const;

const STORAGE_KEY = "pixelhack:hackathon-state:v1";
const AUTH_KEY = "pixelhack:admin-auth:v1";
const CHANNEL_NAME = "pixelhack-hackathon-sync";

const DEFAULT_STATE: HackathonState = {
  timer: {
    status: "idle",
    durationSeconds: 2 * 3600,
    remainingSeconds: 2 * 3600,
    startedAt: null,
    pauseReason: "",
  },
  reviews: {},
  podiumPublished: false,
  updatedAt: 0,
};

let cachedState: HackathonState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function readLocalState(): HackathonState {
  if (typeof window === "undefined") return cachedState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cachedState;
    const parsed = JSON.parse(raw) as HackathonState;
    if (parsed && parsed.timer && typeof parsed.updatedAt === "number") {
      return parsed;
    }
  } catch {
    // ignore invalid JSON
  }
  return cachedState;
}

function broadcastLocal(next: HackathonState) {
  cachedState = next;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage(next);
      ch.close();
    } catch {
      // ignore storage/channel errors
    }
  }
  listeners.forEach((l) => l());
}

export async function updateHackathonState(updater: (prev: HackathonState) => HackathonState) {
  const base = readLocalState();
  const next: HackathonState = {
    ...updater(base),
    updatedAt: Date.now(),
  };
  broadcastLocal(next);
  try {
    const synced = await fns.saveHackathonState({ data: next });
    if (synced.updatedAt > next.updatedAt) {
      broadcastLocal(synced);
    }
  } catch {
    // Keep local state even if server sync fails
  }
}

export function useHackathonState() {
  const [state, setState] = useState<HackathonState>(() => readLocalState());

  useEffect(() => {
    const syncFromLocal = () => setState(readLocalState());
    listeners.add(syncFromLocal);
    syncFromLocal();

    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (ev) => {
        const incoming = ev.data as HackathonState | undefined;
        if (incoming && typeof incoming.updatedAt === "number" && incoming.updatedAt >= cachedState.updatedAt) {
          cachedState = incoming;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
          } catch {}
          setState(incoming);
        }
      };
    } catch {}

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) syncFromLocal();
    };
    window.addEventListener("storage", onStorage);

    let active = true;
    const pullServer = async () => {
      try {
        const remote = await fns.getHackathonState();
        if (!active) return;
        const local = readLocalState();
        if (remote.updatedAt > local.updatedAt) {
          broadcastLocal(remote);
        } else if (local.updatedAt > remote.updatedAt && local.updatedAt > 0) {
          await fns.saveHackathonState({ data: local });
        }
      } catch {
        // ignore transient network errors
      }
    };

    void pullServer();
    const id = window.setInterval(() => void pullServer(), 4000);

    return () => {
      active = false;
      listeners.delete(syncFromLocal);
      window.removeEventListener("storage", onStorage);
      ch?.close();
      window.clearInterval(id);
    };
  }, []);

  return state;
}

export function computeRemainingSeconds(timer: HackathonTimerState, now = Date.now()): number {
  if (timer.status === "running" && timer.startedAt !== null) {
    const elapsed = Math.floor((now - timer.startedAt) / 1000);
    return Math.max(0, timer.remainingSeconds - elapsed);
  }
  if (timer.status === "finished") return 0;
  return Math.max(0, timer.remainingSeconds);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1" || localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  let ok = username.trim() === "root" && password === "123";
  try {
    const res = await fns.verifyAdminLogin({ data: { username, password } });
    ok = res.ok;
  } catch {
    // Fallback already checked
  }
  if (ok && typeof window !== "undefined") {
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
      localStorage.setItem(AUTH_KEY, "1");
    } catch {}
  }
  return ok;
}

export function logoutAdmin() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}
