import {
  fetchDummyData,
  fetchDummyPlaylist,
  fetchDummyPlaylistItem,
} from '@/fixture/dummyVideoData';
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
  keyword: string;
  title?: string;
}

export interface YoutubeSnippetsWithPage {
  datas: YoutubeSnippet[];
  nextPageToken: string | null;
}

const fetchYoutubeDatas = async <T = any>(
  url: string,
  dataMapper?: (v: any) => T
): Promise<{ datas: T[]; nextPageToken: string | null }> => {
  try {
    const response = await fetch(url);

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      throw Error();
    }

    if (dataMapper) {
      return {
        datas: data.items.map(dataMapper),
        nextPageToken: data.nextPageToken ?? null,
      };
    }
    return {
      datas: data.items,
      nextPageToken: data.nextPageToken ?? null,
    };
  } catch (e: any) {
    console.error('error while call youtube api');
    throw Error('error while call youtube api');
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
export const getVideos = (option?: GetVideoOption): Promise<YoutubeSnippetsWithPage> => {
  if (process.env.NODE_ENV !== 'production') {
    return new Promise((res) => {
      res(fetchDummyData(option?.pageToken));
    });
  }

  const URL = `${YOUTUBE_API_URL}/search?part=snippet&channelId=${calmdownman_id}&order=${
    option?.order || 'date'
  }&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}${
    option?.pageToken ? `&pageToken=${option.pageToken}` : ''
  }`;

  return fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
};

export const getVideosWithKeyword = async ({
  title,
  keyword,
  order,
  pageToken,
}: GetVideoWithKeywordParam): Promise<{
  title?: string;
  keyword: string;
  contents: YoutubeSnippetsWithPage;
}> => {
  if (process.env.NODE_ENV !== 'production') {
    return new Promise((res) => {
      const contents = fetchDummyData(pageToken);
      res({ title, keyword, contents });
    });
  }
  const URL = `${YOUTUBE_API_URL}/search?part=snippet&channelId=${calmdownman_id}&order=${
    order || 'date'
  }&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}&q=${keyword}${
    pageToken ? `&pageToken=${pageToken}` : ''
  }`;

  const contents = await fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
  return {
    title,
    keyword,
    contents,
  };
};

/**
 * /playlists
 */
export const getPlaylists = (pageToken?: string): Promise<YoutubeSnippetsWithPage> => {
  if (process.env.NODE_ENV === 'production') {
    return new Promise((res) => {
      res(fetchDummyPlaylist());
    });
  }

  const URL = `${YOUTUBE_API_URL}/playlists?part=snippet&channelId=${calmdownman_id}&maxResults=25&key=${
    process.env.YOUTUBE_API_KEY
  }${pageToken ? `&pageToken=${pageToken}` : ''}`;

  return fetchYoutubeDatas<YoutubeSnippet>(URL, commonSnippetMapper);
};

export const getPlaylistDetail = async (playlistId: string): Promise<PlaylistInfo | null> => {
  const URL = `${YOUTUBE_API_URL}/playlists?part=snippet&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`;

  try {
    const data = (await fetchYoutubeDatas(URL)).datas[0];

    const { title, description, publishedAt } = data.snippet;

    return {
      title,
      description,
      publishedAt: new Date(publishedAt).getFullYear().toString(),
    };
  } catch (e) {
    console.error(e);
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
    const video = (await fetchYoutubeDatas(URL)).datas[0];

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

export const getPlaylistItems = async (
  playlistId: string,
  pageToken?: string
): Promise<YoutubeSnippetsWithPage> => {
  if (process.env.NODE_ENV === 'production') {
    return new Promise((res) => {
      res(fetchDummyPlaylistItem());
    });
  }
  const URL = `${YOUTUBE_API_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=10&key=${
    process.env.YOUTUBE_API_KEY
  }${pageToken ? `&pageToken=${pageToken}` : ''}`;

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
