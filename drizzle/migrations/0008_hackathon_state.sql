CREATE TABLE IF NOT EXISTS public.hackathon_state (
  id text PRIMARY KEY DEFAULT 'main',
  timer jsonb NOT NULL DEFAULT '{"status":"idle","durationSeconds":7200,"remainingSeconds":7200,"startedAt":null,"pauseReason":""}'::jsonb,
  reviews jsonb NOT NULL DEFAULT '{}'::jsonb,
  podium_published boolean NOT NULL DEFAULT false,
  updated_at bigint NOT NULL DEFAULT 0
);

ALTER TABLE public.hackathon_state ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.hackathon_state FROM anon, authenticated;
GRANT ALL ON public.hackathon_state TO service_role;

INSERT INTO public.hackathon_state (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;
