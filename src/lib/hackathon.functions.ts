import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const timerSchema = z.object({
  status: z.enum(["idle", "running", "paused", "finished"]),
  durationSeconds: z.number().int().min(60).max(24 * 3600),
  remainingSeconds: z.number().int().min(0).max(24 * 3600),
  startedAt: z.number().nullable(),
  pauseReason: z.string().max(120),
});

const reviewSchema = z.object({
  teamId: z.string().min(1).max(120),
  teamName: z.string().max(120).optional(),
  creativity: z.number().min(0).max(10),
  design: z.number().min(0).max(10),
  impact: z.number().min(0).max(10),
  pitch: z.number().min(0).max(10),
  total: z.number().min(0).max(40),
  review: z.string().max(1000),
  updatedAt: z.string(),
});

const stateSchema = z.object({
  timer: timerSchema,
  reviews: z.record(z.string(), reviewSchema),
  podiumPublished: z.boolean(),
  updatedAt: z.number(),
});

export type ServerHackathonState = z.infer<typeof stateSchema>;

const DEFAULT_STATE: ServerHackathonState = {
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

let memoryState: ServerHackathonState = DEFAULT_STATE;
const STATE_FILE = "/tmp/pixelhack-hackathon-state.json";

async function readDiskState(): Promise<ServerHackathonState> {
  try {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(STATE_FILE, "utf8");
    const parsed = stateSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      memoryState = parsed.data;
    }
  } catch {
    // Ignore when file does not exist or filesystem is read-only
  }
  return memoryState;
}

async function writeDiskState(next: ServerHackathonState): Promise<void> {
  memoryState = next;
  try {
    const fs = await import("node:fs/promises");
    await fs.writeFile(STATE_FILE, JSON.stringify(next), "utf8");
  } catch {
    // Ignore on read-only serverless filesystems
  }
}

export const verifyAdminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const ok = data.username.trim() === "root" && data.password === "123";
    return { ok };
  });

export const getHackathonState = createServerFn({ method: "GET" }).handler(async () => {
  return readDiskState();
});

export const saveHackathonState = createServerFn({ method: "POST" })
  .inputValidator(stateSchema)
  .handler(async ({ data }) => {
    const current = await readDiskState();
    if (data.updatedAt >= current.updatedAt) {
      await writeDiskState(data);
      return data;
    }
    return current;
  });
