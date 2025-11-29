-- Add content_type column to monitored_channels table
ALTER TABLE public.monitored_channels 
ADD COLUMN content_type text NOT NULL DEFAULT 'longform' 
CHECK (content_type IN ('longform', 'shorts'));

-- Add comment to explain the column
COMMENT ON COLUMN public.monitored_channels.content_type IS 'Type of content: longform (Videos Longos) or shorts (Shorts)';