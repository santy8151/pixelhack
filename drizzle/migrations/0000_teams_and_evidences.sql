CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  reto smallint NOT NULL CHECK (reto BETWEEN 1 AND 3),
  avatar jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO anon, authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event teams are public to read" ON public.teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Event teams can be created" ON public.teams FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Event teams can be edited" ON public.teams FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Event teams can be removed" ON public.teams FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.evidences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  stage smallint NOT NULL CHECK (stage BETWEEN 0 AND 4),
  mission smallint NOT NULL CHECK (mission BETWEEN 0 AND 2),
  file_path text NOT NULL,
  file_type text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX evidences_team_idx ON public.evidences(team_id);
GRANT SELECT, INSERT, DELETE ON public.evidences TO anon, authenticated;
GRANT ALL ON public.evidences TO service_role;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evidences are public to read" ON public.evidences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Evidences can be uploaded" ON public.evidences FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Evidences can be removed" ON public.evidences FOR DELETE TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evidences;