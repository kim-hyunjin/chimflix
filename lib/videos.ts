import { YoutubeSnippet, VideoInfo, PlaylistInfo } from '../types/youtube';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const calmdownman_id = 'UCUj6rrhMTR9pipbAWBAMvUQ';

type GetVideoOption = {
  order?: 'date' | 'viewCount';
};
export const getVideos = async (option?: GetVideoOption): Promise<YoutubeSnippet[]> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&channelId=${calmdownman_id}&order=${
        option?.order || 'date'
      }&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return [];
    }

    return data.items.map((v: any) => ({
      id: v.id.videoId,
      imgUrl: v.snippet.thumbnails.high.url,
      title: v.snippet.title,
      description: v.snippet.description,
    }));
  } catch (e) {
    console.error('error while call youtube api', e);
    return [];
  }
};

export const getPlaylists = async (): Promise<YoutubeSnippet[]> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/playlists?part=snippet&channelId=${calmdownman_id}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return [];
    }

    return data.items.map((p: any) => ({
      id: p.id,
      imgUrl: p.snippet.thumbnails.high.url,
      title: p.snippet.title,
      description: p.snippet.description,
    }));
  } catch (e) {
    console.error('error while call youtube api', e);
    return [];
  }
};

const videoDetailParts = ['snippet', 'contentDetails', 'statistics'].join('%2C');
export const getVideoDetail = async (id: string): Promise<VideoInfo | null> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/videos?part=${videoDetailParts}&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return null;
    }

    const video = data.items[0];
    const { title, description, publishedAt } = video.snippet;

    return {
      title,
      description,
      publishedAt: publishedAt.split('T')[0],
      viewCount: video.statistics.viewCount || 0,
    };
  } catch (e) {
    console.error('error while call youtube api', e);
    return null;
  }
};

export const getPlaylistItems = async (playlistId: string): Promise<YoutubeSnippet[]> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return [];
    }

    return data.items.map((v: any) => ({
      id: v.contentDetails.videoId,
      title: v.snippet.title,
      description: v.snippet.description,
      imgUrl: v.snippet.thumbnails.high.url,
    }));
  } catch (e) {
    console.error('error while call youtube api', e);
    return [];
  }
};

export const getPlaylistDetail = async (playlistId: string): Promise<PlaylistInfo | null> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/playlists?part=snippet&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('youtube api error', data.error);
      return null;
    }

    const { title, description, publishedAt } = data.items[0].snippet;

    return {
      title,
      description,
      publishedAt: new Date(publishedAt).getFullYear().toString(),
    };
  } catch (e) {
    console.error('error while call youtube api', e);
    return null;
  }
};
