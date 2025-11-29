import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = Deno.env.get('VITE_YOUTUBE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const jwt = authHeader.replace('Bearer ', '').trim();

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { channelInput, niche, notes } = await req.json();

    console.log('Received channelInput:', channelInput);

    // Extract channel ID from various formats
    let channelId = await extractChannelId(channelInput);
    
    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Invalid channel URL, username or ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracted channelId:', channelId);

    // Get channel details from YouTube API
    const channelDetails = await getChannelDetails(channelId);

    if (!channelDetails) {
      return new Response(
        JSON.stringify({ error: 'Channel not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Channel details:', channelDetails);

    // Check if channel already exists for this user
    const { data: existingChannel } = await supabaseClient
      .from('monitored_channels')
      .select('id')
      .eq('channel_id', channelDetails.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingChannel) {
      return new Response(
        JSON.stringify({ error: 'Channel already being monitored' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert channel into database
    const { data: newChannel, error: insertError } = await supabaseClient
      .from('monitored_channels')
      .insert({
        user_id: user.id,
        channel_id: channelDetails.id,
        channel_name: channelDetails.title,
        channel_thumbnail: channelDetails.thumbnail,
        description: channelDetails.description,
        subscriber_count: channelDetails.subscriberCount,
        video_count: channelDetails.videoCount,
        view_count: channelDetails.viewCount,
        published_at: channelDetails.publishedAt,
        custom_url: channelDetails.customUrl,
        niche: niche || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert initial history record
    await supabaseClient
      .from('channel_history')
      .insert({
        user_id: user.id,
        channel_id: channelDetails.id,
        subscriber_count: channelDetails.subscriberCount,
        video_count: channelDetails.videoCount,
        view_count: channelDetails.viewCount,
      });

    console.log('Channel added successfully:', newChannel);

    return new Response(
      JSON.stringify({ 
        success: true, 
        channel: {
          ...newChannel,
          niche,
          notes,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in add-channel function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractChannelId(input: string): Promise<string | null> {
  const trimmed = input.trim();
  
  // 1. Direct Channel ID: UCxxxxxx (24 characters)
  if (trimmed.startsWith('UC') && trimmed.length === 24) {
    return trimmed;
  }
  
  // 2. Full URL: youtube.com/channel/UCxxxxxx
  const channelMatch = trimmed.match(/youtube\.com\/channel\/([^/?]+)/);
  if (channelMatch) {
    return channelMatch[1];
  }
  
  // 3. Username with @: youtube.com/@username or just @username
  const atMatch = trimmed.match(/@([^/?]+)/);
  if (atMatch) {
    const username = atMatch[1];
    return await getChannelIdFromUsername(username);
  }
  
  // 4. Custom URL: youtube.com/c/username
  const customMatch = trimmed.match(/youtube\.com\/c\/([^/?]+)/);
  if (customMatch) {
    const username = customMatch[1];
    return await getChannelIdFromUsername(username);
  }

  // 5. Direct username (without @)
  if (!trimmed.includes('/') && !trimmed.includes('.')) {
    return await getChannelIdFromUsername(trimmed);
  }
  
  return null;
}

async function getChannelIdFromUsername(username: string): Promise<string | null> {
  try {
    // Try forUsername parameter
    let url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(username)}&key=${YOUTUBE_API_KEY}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }

    // If not found, try searching by custom URL (handle parameter)
    url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(username)}&key=${YOUTUBE_API_KEY}`;
    response = await fetch(url);
    data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }

    console.log('Username not found:', username);
    return null;
  } catch (error) {
    console.error('Error getting channel ID from username:', error);
    return null;
  }
}

async function getChannelDetails(channelId: string) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
      videoCount: parseInt(channel.statistics.videoCount || '0'),
      viewCount: parseInt(channel.statistics.viewCount || '0'),
    };
  } catch (error) {
    console.error('Error getting channel details:', error);
    return null;
  }
}