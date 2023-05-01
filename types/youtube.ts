export interface YoutubeSnippet {
  id: string;
  imgUrl: string;
  title: string;
  description: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  viewCount: number;
  imgUrl: string;
}

export interface PlaylistInfo {
  title: string;
  description: string;
  publishedAt: string;
}
