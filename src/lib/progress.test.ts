import { describe, expect, it } from "vitest";
import { hasWon, progressPercent, stageUnlocked, stagesDone, type ApprovalLike } from "./progress";

const ap = (stage: number, team_id = "t1"): ApprovalLike => ({ team_id, stage });

describe("progreso por islas aprobadas", () => {
  it("la isla 2 está bloqueada hasta que el tallerista apruebe la isla 1", () => {
    expect(stageUnlocked([], "t1", 1)).toBe(false);
    expect(stageUnlocked([ap(0)], "t1", 1)).toBe(true);
  });
  it("aprobaciones fuera de orden no suman", () => {
    expect(stagesDone([ap(0), ap(2)], "t1")).toBe(1);
  });
  it("las aprobaciones de otro equipo no cuentan", () => {
    expect(stagesDone([ap(0, "otro")], "t1")).toBe(0);
  });
  it("cada isla aprobada vale 20%", () => {
    expect(progressPercent([ap(0), ap(1)], "t1")).toBe(40);
  });
  it("gana el equipo con las 5 islas aprobadas", () => {
    const all = [0, 1, 2, 3, 4].map((s) => ap(s));
    expect(hasWon(all, "t1")).toBe(true);
    expect(hasWon(all.slice(0, 4), "t1")).toBe(false);
  });
});
