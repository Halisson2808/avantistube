-- Tabela para armazenar snapshots de vídeos recentes dos canais monitorados
CREATE TABLE public.video_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  channel_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  position INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_viral BOOLEAN DEFAULT false,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own video snapshots"
ON public.video_snapshots
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video snapshots"
ON public.video_snapshots
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video snapshots"
ON public.video_snapshots
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video snapshots"
ON public.video_snapshots
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_video_snapshots_user_channel ON public.video_snapshots(user_id, channel_id);
CREATE INDEX idx_video_snapshots_active ON public.video_snapshots(user_id, is_active);
CREATE UNIQUE INDEX idx_video_snapshots_unique ON public.video_snapshots(user_id, channel_id, video_id);