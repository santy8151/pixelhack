// Synthesized "techy" sound effects with the Web Audio API (no audio files).
let ctx: AudioContext | null = null;
let muted = false;
const listeners = new Set<() => void>();

export function isMuted() {
  return muted;
}
export function setMuted(v: boolean) {
  muted = v;
  try {
    localStorage.setItem("ph-muted", v ? "1" : "0");
  } catch {}
  listeners.forEach((l) => l());
}
export function subscribeMuted(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function initMuted() {
  try {
    muted = localStorage.getItem("ph-muted") === "1";
  } catch {}
  listeners.forEach((l) => l());
}

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.08, slideTo?: number) {
  const a = ac();
  if (!a || muted) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  const t = a.currentTime + start;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  hover: () => tone(1200, 0, 0.04, "sine", 0.03),
  click: () => {
    tone(660, 0, 0.06, "square", 0.05);
    tone(990, 0.05, 0.08, "square", 0.05);
  },
  select: () => tone(400, 0, 0.15, "triangle", 0.08, 1200),
  back: () => tone(800, 0, 0.15, "triangle", 0.07, 300),
  step: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.07, 0.12, "square", 0.06)),
  undo: () => [784, 523].forEach((f, i) => tone(f, i * 0.08, 0.12, "sawtooth", 0.04)),
  copy: () => {
    tone(1500, 0, 0.05, "sine", 0.06);
    tone(2000, 0.06, 0.08, "sine", 0.06);
  },
  laser: () => tone(1800, 0, 0.25, "sawtooth", 0.05, 120),
  win: () => {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, i * 0.12, 0.2, "square", 0.07));
    tone(130, 0, 0.9, "triangle", 0.08);
  },
};
