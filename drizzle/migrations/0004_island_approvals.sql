CREATE TABLE public.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  stage smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, stage)
);
GRANT SELECT ON public.approvals TO anon, authenticated;
GRANT ALL ON public.approvals TO service_role;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approvals are public to read" ON public.approvals FOR SELECT TO anon, authenticated USING (true);
ALTER TABLE public.teams ADD COLUMN drive_url text NOT NULL DEFAULT '';
ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;