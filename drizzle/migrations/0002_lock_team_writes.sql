DROP POLICY IF EXISTS "Event teams can be created" ON public.teams;
DROP POLICY IF EXISTS "Event teams can be edited" ON public.teams;
DROP POLICY IF EXISTS "Event teams can be removed" ON public.teams;
DROP POLICY IF EXISTS "Evidences can be uploaded" ON public.evidences;
DROP POLICY IF EXISTS "Evidences can be removed" ON public.evidences;
REVOKE INSERT, UPDATE, DELETE ON public.teams FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.evidences FROM anon, authenticated;
GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.evidences TO service_role;