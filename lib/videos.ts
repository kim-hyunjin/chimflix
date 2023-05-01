import { YoutubeSnippet, VideoInfo, PlaylistInfo } from '../types/youtube';
import { getWatchedVideos } from './db/hasura';
import { getIssuerFromToken } from './token';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const calmdownman_id = 'UCUj6rrhMTR9pipbAWBAMvUQ';

interface GetVideoOption {
  order?: 'date' | 'viewCount';
  pageToken?: string;
}

interface GetVideoWithKeywordParam extends GetVideoOption {
  title: string;
  keyword: string;
}

const fetchYoutubeDatas = async <T = any>(
  url: string,
  dataMapper?: (v: any) => T
): Promise<T[]> => {
  try {
    const response = await fetch(url);

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return [];
    }

    if (dataMapper) {
      return data.items.map(dataMapper);
    }
    return data.items;
  } catch (e) {
    console.error('error while call youtube api', e);
    return [];
  }
};

const getImgUrl = (videoId: string) => {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
};

const commonSnippetMapper = (v: any) => ({
  id: v.id?.videoId || v.id,
  imgUrl: v.id?.videoId ? getImgUrl(v.id?.videoId) : v.snippet.thumbnails.high.url,
  title: v.snippet.title,
  description: v.snippet.description,
});

/**
 * /search
 */
export const getVideos = (option?: GetVideoOption): Promise<YoutubeSnippet[]> => {
  let URL = `${YOUTUBE_API_URL}/search?part=snippet&channelId=${calmdownman_id}&order=${
    option?.order || 'date'
  }&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`;
  if (option?.pageToken) {
    URL = URL.concat(`&pageToken=${option.pageToken}`);
  }

  return fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
};

export const getVideosWithKeyword = async ({
  title,
  keyword,
  order,
  pageToken,
}: GetVideoWithKeywordParam): Promise<{ title: string; contents: YoutubeSnippet[] }> => {
  let URL = `${YOUTUBE_API_URL}/search?part=snippet&channelId=${calmdownman_id}&order=${
    order || 'date'
  }&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}&q=${keyword}`;
  if (pageToken) {
    URL = URL.concat(`&pageToken=${pageToken}`);
  }

  const contents = await fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
  return {
    title,
    contents,
  };
};

/**
 * /playlists
 */
export const getPlaylists = (): Promise<YoutubeSnippet[]> => {
  const URL = `${YOUTUBE_API_URL}/playlists?part=snippet&channelId=${calmdownman_id}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`;

  return fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
};

export const getPlaylistDetail = async (playlistId: string): Promise<PlaylistInfo | null> => {
  const URL = `${YOUTUBE_API_URL}/playlists?part=snippet&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`;

  try {
    const items = await fetchYoutubeDatas(URL);

    const { title, description, publishedAt } = items[0].snippet;

    return {
      title,
      description,
      publishedAt: new Date(publishedAt).getFullYear().toString(),
    };
  } catch (e) {
    return null;
  }
};

/**
 * /videos
 */
const videoDetailParts = ['snippet', 'contentDetails', 'statistics'].join('%2C');
export const getVideoDetail = async (id: string): Promise<VideoInfo | null> => {
  const URL = `${YOUTUBE_API_URL}/videos?part=${videoDetailParts}&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;

  try {
    const items = await fetchYoutubeDatas(URL);

    const video = items[0];
    const { title, description, publishedAt } = video.snippet;

    return {
      id,
      title,
      description,
      publishedAt: publishedAt.split('T')[0],
      viewCount: video.statistics.viewCount || 0,
      imgUrl: getImgUrl(id),
    };
  } catch (e) {
    return null;
  }
};

/**
 * /playlistItems
 */
const playlistItemMapper = (v: any): YoutubeSnippet => ({
  id: v.contentDetails.videoId,
  title: v.snippet.title,
  description: v.snippet.description,
  imgUrl: getImgUrl(v.contentDetails.videoId),
});

export const getPlaylistItems = async (playlistId: string): Promise<YoutubeSnippet[]> => {
  const URL = `${YOUTUBE_API_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;

  return fetchYoutubeDatas(URL, playlistItemMapper);
};

export const getWatchItAgainVideos = async (
  token: string,
  offset?: number
): Promise<{ watched: YoutubeSnippet[]; total: number }> => {
  try {
    const issuer = getIssuerFromToken(token);
    const watchedInfo = await getWatchedVideos(token, issuer, offset);
    if (watchedInfo) {
      return watchedInfo;
    }

    return { watched: [], total: 0 };
  } catch (e) {
    console.error('error while call youtube api', e);
    return { watched: [], total: 0 };
  }
};
