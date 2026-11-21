// Pure progress rules: an island is done when a tallerista approves it;
// islands unlock in order; the team wins when all 5 are approved.
export const STAGE_COUNT = 5;

export type ApprovalLike = { team_id: string; stage: number };

export function stageDone(aps: ApprovalLike[], teamId: string, stage: number) {
  return aps.some((a) => a.team_id === teamId && a.stage === stage);
}

export function stageUnlocked(aps: ApprovalLike[], teamId: string, stage: number) {
  for (let s = 0; s < stage; s++) if (!stageDone(aps, teamId, s)) return false;
  return true;
}

/** Consecutive approved islands from the start (approvals out of order don't count). */
export function stagesDone(aps: ApprovalLike[], teamId: string) {
  let n = 0;
  while (n < STAGE_COUNT && stageDone(aps, teamId, n)) n++;
  return n;
}

export const progressPercent = (aps: ApprovalLike[], teamId: string) =>
  Math.round((stagesDone(aps, teamId) / STAGE_COUNT) * 100);

export const hasWon = (aps: ApprovalLike[], teamId: string) => stagesDone(aps, teamId) === STAGE_COUNT;
