-- Create video_snapshots table for caching recent videos
CREATE TABLE public.video_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  position INTEGER NOT NULL, -- Position in top 5 (1-5)
  is_active BOOLEAN DEFAULT TRUE, -- If still in top 5
  is_viral BOOLEAN DEFAULT FALSE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, channel_id, video_id)
);

ALTER TABLE public.video_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own video snapshots"
  ON public.video_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video snapshots"
  ON public.video_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video snapshots"
  ON public.video_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video snapshots"
  ON public.video_snapshots FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_video_snapshots_channel_id ON public.video_snapshots(channel_id);
CREATE INDEX idx_video_snapshots_is_active ON public.video_snapshots(is_active);
CREATE INDEX idx_video_snapshots_position ON public.video_snapshots(position);
CREATE INDEX idx_video_snapshots_user_channel_active ON public.video_snapshots(user_id, channel_id, is_active);

-- Add field to track last video fetch time per channel
-- We'll use monitored_channels.last_updated for this, but can add a specific field if needed
-- For now, we'll track it via video_snapshots.fetched_at (most recent fetch)

