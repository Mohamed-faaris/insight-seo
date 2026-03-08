
CREATE TABLE public.seo_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  final_url text,
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text NOT NULL DEFAULT 'pending',
  seo_score integer,
  report jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scans" ON public.seo_scans
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert scans" ON public.seo_scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update scans" ON public.seo_scans
  FOR UPDATE USING (true);

CREATE INDEX idx_seo_scans_share_token ON public.seo_scans(share_token);
CREATE INDEX idx_seo_scans_created_at ON public.seo_scans(created_at DESC);
