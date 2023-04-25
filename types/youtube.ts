export interface YoutubeSnippet {
  id: string;
  imgUrl: string;
  title: string;
  description: string;
}

export interface VideoInfo {
  title: string;
  description: string;
  publishedAt: string;
  viewCount: number;
}

export interface PlaylistInfo {
  title: string;
  description: string;
  publishedAt: string;
}
