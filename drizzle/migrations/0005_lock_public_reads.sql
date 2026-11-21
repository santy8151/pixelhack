DROP POLICY IF EXISTS "Event teams are public to read" ON public.teams;
DROP POLICY IF EXISTS "Evidences are public to read" ON public.evidences;
DROP POLICY IF EXISTS "Approvals are public to read" ON public.approvals;
REVOKE SELECT ON public.teams, public.evidences, public.approvals FROM anon, authenticated;