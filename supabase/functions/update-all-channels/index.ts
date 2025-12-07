import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YOUTUBE_API_KEY = Deno.env.get("VITE_YOUTUBE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ChannelData {
  channel_id: string;
  user_id: string;
}

async function getChannelDetails(channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const channel = data.items[0];
  return {
    subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
    viewCount: parseInt(channel.statistics.viewCount) || 0,
    videoCount: parseInt(channel.statistics.videoCount) || 0,
  };
}

async function updateChannel(
  supabase: any,
  channel: ChannelData,
  isScheduled: boolean = false
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verifica se já existe um registro de histórico para hoje
  const { data: existingHistory } = await supabase
    .from("channel_history")
    .select("id, subscriber_count, view_count, video_count")
    .eq("channel_id", channel.channel_id)
    .eq("user_id", channel.user_id)
    .gte("recorded_at", today.toISOString())
    .order("recorded_at", { ascending: false })
    .limit(1);

  // Busca dados atuais do YouTube
  const stats = await getChannelDetails(channel.channel_id);

  if (existingHistory && existingHistory.length > 0) {
    // Já existe registro hoje - atualiza o registro existente com dados mais recentes
    // Isso evita duplicação e o gráfico sempre reflete o último valor do dia
    const { error: updateHistoryError } = await supabase
      .from("channel_history")
      .update({
        subscriber_count: stats.subscriberCount,
        view_count: stats.viewCount,
        video_count: stats.videoCount,
      })
      .eq("id", existingHistory[0].id);

    if (updateHistoryError) {
      console.error(`Error updating history for ${channel.channel_id}:`, updateHistoryError);
    } else {
      console.log(`Updated existing history for ${channel.channel_id}`);
    }
  } else {
    // Não existe registro hoje - cria novo
    const { error: insertError } = await supabase.from("channel_history").insert({
      user_id: channel.user_id,
      channel_id: channel.channel_id,
      subscriber_count: stats.subscriberCount,
      view_count: stats.viewCount,
      video_count: stats.videoCount,
    });

    if (insertError) {
      console.error(`Error inserting history for ${channel.channel_id}:`, insertError);
    } else {
      console.log(`Created new history for ${channel.channel_id}`);
    }
  }

  // Atualiza tabela principal de canais monitorados
  const { error: updateError } = await supabase
    .from("monitored_channels")
    .update({
      subscriber_count: stats.subscriberCount,
      video_count: stats.videoCount,
      view_count: stats.viewCount,
      last_updated: new Date().toISOString(),
    })
    .eq("channel_id", channel.channel_id)
    .eq("user_id", channel.user_id);

  if (updateError) {
    console.error(`Error updating channel ${channel.channel_id}:`, updateError);
  }

  return stats;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Busca todos os canais monitorados (de todos os usuários)
    const { data: channels, error: fetchError } = await supabase
      .from("monitored_channels")
      .select("channel_id, user_id");

    if (fetchError) {
      throw fetchError;
    }

    if (!channels || channels.length === 0) {
      return new Response(
        JSON.stringify({ message: "No channels to update" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Updating ${channels.length} channels...`);

    let successCount = 0;
    let errorCount = 0;

    // Processa canais em lotes para evitar rate limiting da API do YouTube
    for (const channel of channels) {
      try {
        await updateChannel(supabase, channel, true);
        successCount++;
        // Aguarda 100ms entre cada canal para evitar rate limit
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error updating channel ${channel.channel_id}:`, error);
        errorCount++;
      }
    }

    console.log(`Update complete: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        message: "Channels updated",
        success: successCount,
        errors: errorCount,
        total: channels.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in update-all-channels:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
