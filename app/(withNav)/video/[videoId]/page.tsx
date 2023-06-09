import { getVideoDetail } from '@/lib/videos';
import { createNewStats, getStatsData } from '@/app/api/stats/route';
import { Stats } from '@/types/hasura';
import { VideoInfo } from '@/types/youtube';
import { cookies } from 'next/headers';
import VideoDetail from './video_client';

async function getData(
  videoId: string,
  token?: string
): Promise<{ video: VideoInfo | null; stats: Stats | null }> {
  if (!token) {
    const video = await getVideoDetail(videoId);
    return {
      video,
      stats: null,
    };
  }

  const [video, stats] = await Promise.all([getVideoDetail(videoId), getStatsData(token, videoId)]);

  if (stats) {
    return {
      video,
      stats,
    };
  }

  const newStats = await createNewStats(token, videoId);
  return {
    video,
    stats: newStats,
  };
}

export default async function Page({ params }: { params: { videoId: string } }) {
  const videoId = params.videoId;
  const token = cookies().get('token')?.value;

  const props = await getData(videoId, token);

  return <VideoDetail {...props} />;
}
