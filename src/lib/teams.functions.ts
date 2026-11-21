import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const avatar = z.object({
  shape: z.enum(["estrella", "cubo", "bolita", "nube"]),
  color: z.enum(["cyan", "pink", "sun", "navy"]),
  eyes: z.enum(["felices", "grandes", "guino", "estrellas"]),
  mouth: z.enum(["sonrisa", "abierta", "lengua", "o"]),
  extra: z.enum(["nada", "gorra", "lentes", "corona", "antena"]),
});
const code = z.string().min(1).max(100);

function checkCode(c: string) {
  // Event code no longer required: anyone using the site can save.
  void c;
}
async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

export const saveTeam = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, id: z.string().uuid().optional(), name: z.string().trim().min(1).max(60), avatar, drive_url: z.string().trim().max(500).refine((u) => u === "" || /^https:\/\//.test(u), "Enlace inválido") }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const row = { name: data.name, avatar: data.avatar, drive_url: data.drive_url };
    const res = data.id ? await db.from("teams").update(row).eq("id", data.id) : await db.from("teams").insert({ ...row, reto: 0 });
    if (res.error) { console.error("saveTeam", res.error); throw new Error("No se pudo guardar"); }
    return { ok: true };
  });

export const removeTeam = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const { data: evs } = await db.from("evidences").select("file_path").eq("team_id", data.id);
    const paths = (evs ?? []).map((e) => e.file_path);
    if (paths.length) await db.storage.from("evidencias").remove(paths);
    const { error } = await db.from("teams").delete().eq("id", data.id);
    if (error) throw new Error("No se pudo borrar");
    return { ok: true };
  });

export const addEvidence = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, team_id: z.string().uuid(), stage: z.number().int().min(1).max(5), mission: z.number().int().min(1).max(10), file_path: z.string().min(1).max(300), file_type: z.string().max(100), file_name: z.string().max(255) }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    if (!data.file_path.startsWith(`${data.team_id}/`)) throw new Error("Ruta inválida");
    const { code: _c, ...row } = data;
    const { error } = await (await admin()).from("evidences").insert(row);
    if (error) throw new Error("No se pudo guardar");
    return { ok: true };
  });

export const removeEvidence = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const { data: ev } = await db.from("evidences").select("file_path").eq("id", data.id).maybeSingle();
    if (ev) await db.storage.from("evidencias").remove([ev.file_path]);
    const { error } = await db.from("evidences").delete().eq("id", data.id);
    if (error) throw new Error("No se pudo borrar");
    return { ok: true };
  });

export const createEvidenceUpload = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, team_id: z.string().uuid(), stage: z.number().int().min(1).max(5), mission: z.number().int().min(1).max(10), file_name: z.string().max(255) }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const { data: team } = await db.from("teams").select("id").eq("id", data.team_id).maybeSingle();
    if (!team) throw new Error("Equipo no encontrado");
    const safe = data.file_name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
    const path = `${data.team_id}/${data.stage}-${data.mission}/${crypto.randomUUID()}-${safe}`;
    const { data: up, error } = await db.storage.from("evidencias").createSignedUploadUrl(path);
    if (error || !up) throw new Error("No se pudo preparar la subida");
    return { path, token: up.token };
  });

export const getEvidenceUrl = createServerFn({ method: "POST" })
  .inputValidator(z.object({ path: z.string().min(1).max(300) }))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: ev } = await db.from("evidences").select("id").eq("file_path", data.path).maybeSingle();
    if (!ev) throw new Error("No encontrado");
    const { data: s, error } = await db.storage.from("evidencias").createSignedUrl(data.path, 60 * 60);
    if (error || !s) throw new Error("No disponible");
    return { url: s.signedUrl };
  });

export const setApproval = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code, team_id: z.string().uuid(), stage: z.number().int().min(0).max(4), approved: z.boolean(), reto: z.number().int().min(1).max(3).optional() }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    if (data.approved) {
      if (data.stage === 1) {
        if (!data.reto) throw new Error("Elige el reto ganador");
        const { error: e } = await db.from("teams").update({ reto: data.reto }).eq("id", data.team_id);
        if (e) throw new Error("No se pudo guardar el reto");
      }
      const { error } = await db.from("approvals").upsert({ team_id: data.team_id, stage: data.stage }, { onConflict: "team_id,stage" });
      if (error) throw new Error("No se pudo aprobar");
    } else {
      const { error } = await db.from("approvals").delete().eq("team_id", data.team_id).gte("stage", data.stage);
      if (error) throw new Error("No se pudo quitar");
    }
    return { ok: true };
  });

export const getBoard = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code }))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const [t, e, a] = await Promise.all([
      db.from("teams").select("*").order("created_at"),
      db.from("evidences").select("*").order("created_at"),
      db.from("approvals").select("*"),
    ]);
    if (t.error || e.error || a.error) throw new Error("No se pudo cargar");
    return { teams: t.data ?? [], evidences: e.data ?? [], approvals: a.data ?? [] };
  });
