-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create monitored_channels table
CREATE TABLE public.monitored_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_thumbnail TEXT,
  subscriber_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  description TEXT,
  custom_url TEXT,
  published_at TIMESTAMPTZ,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

ALTER TABLE public.monitored_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own monitored channels"
  ON public.monitored_channels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitored channels"
  ON public.monitored_channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitored channels"
  ON public.monitored_channels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitored channels"
  ON public.monitored_channels FOR DELETE
  USING (auth.uid() = user_id);

-- Create my_channels table
CREATE TABLE public.my_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_thumbnail TEXT,
  subscriber_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  description TEXT,
  custom_url TEXT,
  published_at TIMESTAMPTZ,
  is_primary BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

ALTER TABLE public.my_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own channels"
  ON public.my_channels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own channels"
  ON public.my_channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own channels"
  ON public.my_channels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channels"
  ON public.my_channels FOR DELETE
  USING (auth.uid() = user_id);

-- Create channel_history table for tracking metrics over time
CREATE TABLE public.channel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscriber_count BIGINT,
  video_count INTEGER,
  view_count BIGINT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.channel_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own channel history"
  ON public.channel_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own channel history"
  ON public.channel_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance on history queries
CREATE INDEX idx_channel_history_channel_id ON public.channel_history(channel_id);
CREATE INDEX idx_channel_history_recorded_at ON public.channel_history(recorded_at DESC);

-- Create channel_videos table
CREATE TABLE public.channel_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  duration TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.channel_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own channel videos"
  ON public.channel_videos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own channel videos"
  ON public.channel_videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own channel videos"
  ON public.channel_videos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channel videos"
  ON public.channel_videos FOR DELETE
  USING (auth.uid() = user_id);

-- Create search_history table
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own search history"
  ON public.search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON public.search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
  ON public.search_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for search history
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_searched_at ON public.search_history(searched_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_monitored_channels
  BEFORE UPDATE ON public.monitored_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_my_channels
  BEFORE UPDATE ON public.my_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();