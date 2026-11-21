ALTER TABLE public.teams DROP CONSTRAINT teams_reto_check;
ALTER TABLE public.teams ADD CONSTRAINT teams_reto_check CHECK (reto BETWEEN 0 AND 3);