import { getPlaylists, getVideos, getVideosWithKeyword } from '@/lib/videos';
import getQueryClient from '@/utils/getQueryClient';
import RQHydrate from '@/utils/rq_hydrate_client';
import { dehydrate } from '@tanstack/react-query';
import { keywords } from './constant';
import Home from './home_client';

export const revalidate = 3600; // 1hour

export default async function Page() {
  const queryClient = getQueryClient();
  await Promise.allSettled([
    queryClient.prefetchInfiniteQuery(['recentVideos'], () => getVideos({ order: 'date' })),
    queryClient.prefetchInfiniteQuery(['popularVideos'], () => getVideos({ order: 'viewCount' })),
    queryClient.prefetchInfiniteQuery(['playlists'], () => getPlaylists(undefined)),
    keywords.map(({ title, keyword }) =>
      queryClient.prefetchInfiniteQuery(['searchVideo', keyword], () =>
        getVideosWithKeyword({ title, keyword })
      )
    ),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <RQHydrate state={dehydratedState}>
      <Home />
    </RQHydrate>
  );
}
