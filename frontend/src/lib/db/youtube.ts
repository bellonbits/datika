const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;       // high-res thumbnail URL
  embedUrl: string;        // https://www.youtube.com/embed/{id}
  watchUrl: string;        // https://www.youtube.com/watch?v={id}
  duration?: string;       // ISO 8601 if fetched
}

/**
 * Search YouTube for the best short educational video matching the query.
 * Returns null if API key is missing or no results found.
 */
export async function searchEducationalVideo(
  query: string,
  maxDurationMinutes = 15,
): Promise<YouTubeResult | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('[youtube] YOUTUBE_API_KEY not set');
    return null;
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: `${query} tutorial explained`,
      type: 'video',
      videoCategoryId: '27',   // Education
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      order: 'relevance',
      maxResults: '5',
      safeSearch: 'strict',
      key: YOUTUBE_API_KEY,
    });

    const searchRes = await fetch(`${BASE}/search?${params}`);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const items: any[] = searchData.items ?? [];
    if (!items.length) return null;

    // Get video durations to filter out long videos
    const ids = items.map((i: any) => i.id.videoId).join(',');
    const detailParams = new URLSearchParams({
      part: 'contentDetails',
      id: ids,
      key: YOUTUBE_API_KEY,
    });

    const detailRes = await fetch(`${BASE}/videos?${detailParams}`);
    const detailData = detailRes.ok ? await detailRes.json() : { items: [] };
    const durations: Record<string, number> = {};

    for (const v of detailData.items ?? []) {
      durations[v.id] = parseIsoDuration(v.contentDetails?.duration ?? 'PT0S');
    }

    // Pick first video under maxDurationMinutes
    const maxSec = maxDurationMinutes * 60;
    const pick = items.find((i: any) => {
      const sec = durations[i.id.videoId] ?? 0;
      return sec > 60 && sec <= maxSec; // at least 1 min, at most max
    }) ?? items[0];

    const videoId = pick.id.videoId;
    const snippet = pick.snippet;

    return {
      videoId,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnail:
        snippet.thumbnails?.maxres?.url ??
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ?? '',
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      duration: formatDuration(durations[videoId] ?? 0),
    };
  } catch (e) {
    console.error('[youtube] search failed:', e);
    return null;
  }
}

/** Parse ISO 8601 duration (PT4M30S) → seconds */
function parseIsoDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? '0') * 3600) +
         (parseInt(m[2] ?? '0') * 60) +
          parseInt(m[3] ?? '0');
}

/** Format seconds → "4m 30s" */
function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
