import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as fns from "./teams.functions";

export { STAGES } from "./missions";

export type AvatarConfig = {
  shape: "estrella" | "cubo" | "bolita" | "nube";
  color: "cyan" | "pink" | "sun" | "navy";
  eyes: "felices" | "grandes" | "guino" | "estrellas";
  mouth: "sonrisa" | "abierta" | "lengua" | "o";
  extra: "nada" | "gorra" | "lentes" | "corona" | "antena";
};

export type Team = {
  id: string;
  name: string;
  reto: number; // 0 = not chosen yet (chosen by vote in island 2)
  avatar: AvatarConfig;
  drive_url: string;
  created_at: string;
};

export type Evidence = {
  id: string;
  team_id: string;
  stage: number;
  mission: number;
  file_path: string;
  file_type: string;
  file_name: string;
  created_at: string;
};

export const randomAvatar = (): AvatarConfig => {
  const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]!;
  return {
    shape: pick(["estrella", "cubo", "bolita", "nube"] as const),
    color: pick(["cyan", "pink", "sun", "navy"] as const),
    eyes: pick(["felices", "grandes", "guino", "estrellas"] as const),
    mouth: pick(["sonrisa", "abierta", "lengua", "o"] as const),
    extra: pick(["nada", "gorra", "lentes", "corona", "antena"] as const),
  };
};

const BUCKET = "evidencias";

export type Approval = { id: string; team_id: string; stage: number; created_at: string };

/** Live data: reads go through the server with the event code; refreshes every few seconds on every device. */
export function useLiveData() {
  const board = useQuery({
    queryKey: ["board"],
    retry: false,
    refetchInterval: 4000,
    queryFn: () => withCode((code) => fns.getBoard({ data: { code } })),
  });
  return {
    teams: (board.data?.teams ?? []) as unknown as Team[],
    evidences: (board.data?.evidences ?? []) as Evidence[],
    approvals: (board.data?.approvals ?? []) as Approval[],
    loading: board.isLoading,
    error: board.error,
  };
}

async function withCode<T>(fn: (code: string) => Promise<T>): Promise<T> {
  try {
    return await fn("abierto");
  } catch (e) {
    alert(e instanceof Error ? e.message : "Error");
    throw e;
  }
}

export const teamsApi = {
  async setApproval(team_id: string, stage: number, approved: boolean, reto?: number) {
    await withCode((code) => fns.setApproval({ data: { code, team_id, stage, approved, ...(reto ? { reto } : {}) } }));
  },
  async save(t: { id?: string; name: string; avatar: AvatarConfig; drive_url: string }) {
    await withCode((code) => fns.saveTeam({ data: { code, ...t } }));
  },
  async remove(id: string, _evidences: Evidence[]) {
    await withCode((code) => fns.removeTeam({ data: { code, id } }));
  },
  async uploadEvidence(teamId: string, stage: number, mission: number, file: File) {
    await withCode(async (code) => {
      const { path, token } = await fns.createEvidenceUpload({ data: { code, team_id: teamId, stage, mission, file_name: file.name.slice(0, 255) } });
      const up = await supabase.storage.from(BUCKET).uploadToSignedUrl(path, token, file, file.type ? { contentType: file.type } : {});
      if (up.error) throw up.error;
      await fns.addEvidence({ data: { code, team_id: teamId, stage, mission, file_path: path, file_type: file.type, file_name: file.name.slice(0, 255) } });
    });
  },
  async removeEvidence(e: Evidence) {
    await withCode((code) => fns.removeEvidence({ data: { code, id: e.id } }));
  },
};

export function useEvidenceUrl(path: string) {
  return useQuery({
    queryKey: ["evidence-url", path],
    staleTime: 50 * 60 * 1000,
    queryFn: async () => {
      const { url } = await fns.getEvidenceUrl({ data: { path } });
      return url;
    },
  });
}
