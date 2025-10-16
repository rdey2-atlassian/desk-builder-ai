-- Create solutions table to store manifests
CREATE TABLE public.solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_id TEXT,
  manifest JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create solution_versions table for version history
CREATE TABLE public.solution_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  manifest JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT
);

-- Create validation_results table for preflight checks
CREATE TABLE public.validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
  message TEXT NOT NULL,
  block_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_results ENABLE ROW LEVEL SECURITY;

-- Public read access (solutions are shareable)
CREATE POLICY "Solutions are viewable by everyone"
  ON public.solutions FOR SELECT
  USING (true);

CREATE POLICY "Solution versions are viewable by everyone"
  ON public.solution_versions FOR SELECT
  USING (true);

CREATE POLICY "Validation results are viewable by everyone"
  ON public.validation_results FOR SELECT
  USING (true);

-- Anyone can create/update solutions (no auth required for now)
CREATE POLICY "Anyone can create solutions"
  ON public.solutions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update solutions"
  ON public.solutions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can create solution versions"
  ON public.solution_versions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create validation results"
  ON public.validation_results FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_solutions_template_id ON public.solutions(template_id);
CREATE INDEX idx_solutions_category ON public.solutions(category);
CREATE INDEX idx_solution_versions_solution_id ON public.solution_versions(solution_id);
CREATE INDEX idx_validation_results_solution_id ON public.validation_results(solution_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_solutions_updated_at
  BEFORE UPDATE ON public.solutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();