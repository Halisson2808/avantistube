-- Add niche and notes columns to monitored_channels table
ALTER TABLE public.monitored_channels
ADD COLUMN niche TEXT,
ADD COLUMN notes TEXT;