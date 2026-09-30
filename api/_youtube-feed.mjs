

/** One page per request keeps large channels within serverless execution limits. */
export async function getFeedVideoPage(ytFetch, channelId, since, pageToken = "") {
  // Every channel's uploads playlist has the same suffix as its UC identifier.
  const playlistId = `UU${channelId.slice(2)}`;
  const params = new URLSearchParams({ part: "contentDetails,snippet", playlistId, maxResults: "50" });
  if (pageToken) params.set("pageToken", pageToken);
  let page;
  try {
    page = await ytFetch(`/playlistItems?${params}`);
  } catch (error) {
    // Deleted channels or missing public uploads playlists have no feed items.
    // Authentication, quota and network errors must still reach the caller.
    if (/^YouTube API error 404:/.test(error.message || "")) return { videos: [] };
    throw error;
  }
  const cutoff = Date.parse(since);
  const items = page.items || [];
  const dates = items.map(item => Date.parse(item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt));
  const ids = items.filter((item, index) => !Number.isFinite(dates[index]) || dates[index] >= cutoff)
    .map(item => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId).filter(Boolean);
  const data = ids.length
    ? await ytFetch(`/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(ids.join(","))}`)
    : { items: [] };
  const videos = (data.items || [])
    .filter(video => Date.parse(video.snippet.publishedAt) >= cutoff)
    .map(video => ({
      videoId: video.id,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails?.maxres?.url || video.snippet.thumbnails?.standard?.url
        || video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
      viewCount: Number(video.statistics?.viewCount || 0),
      likeCount: Number(video.statistics?.likeCount || 0),
      commentCount: Number(video.statistics?.commentCount || 0),
      duration: video.contentDetails?.duration,

    }));
  // Uploads are newest first. Stop only after reaching a complete older page,
  // so one removed/private entry cannot prematurely truncate this period.
  const reachedEnd = dates.length > 0 && dates.every(date => Number.isFinite(date) && date < cutoff);
  return { videos, nextPageToken: reachedEnd ? undefined : page.nextPageToken };
}
