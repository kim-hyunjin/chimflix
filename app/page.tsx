import { getPlaylists, getVideos, getVideosWithKeyword } from '@/lib/videos';
import getQueryClient from '@/utils/getQueryClient';
import RQHydrate from '@/utils/rq_hydrate_client';
import { dehydrate } from '@tanstack/react-query';
import { keywords } from './constant';
import Home from './home_client';

const requestInit = { next: { revalidate: 60 * 60 } };

export default async function Page() {
  // const noData = { datas: [], nextPageToken: null };

  // const [initialRecentVideos, initialPopularVideos, initialPlaylist, ...initialOtherContents] =
  //   await Promise.allSettled([
  //     getVideos({ order: 'date', requestInit }),
  //     getVideos({ order: 'viewCount', requestInit }),
  //     getPlaylists(undefined, requestInit),
  //     keywords.map(({ title, keyword }) => getVideosWithKeyword({ title, keyword, requestInit })),
  //   ]);

  // const fulfilledOtherContents = initialOtherContents
  //   .filter((c) => c.status === 'fulfilled')
  //   .map((f: any) => f.value);

  // const props = {
  //   initialRecentVideos:
  //     initialRecentVideos.status === 'fulfilled' ? initialRecentVideos.value : noData,
  //   initialPopularVideos:
  //     initialPopularVideos.status === 'fulfilled' ? initialPopularVideos.value : noData,
  //   initialPlaylist: initialPlaylist.status === 'fulfilled' ? initialPlaylist.value : noData,
  //   initialOtherContents: fulfilledOtherContents.length > 0 ? fulfilledOtherContents : null,
  // };

  const queryClient = getQueryClient();
  await Promise.allSettled([
    queryClient.prefetchInfiniteQuery(['recentVideos'], () =>
      getVideos({ order: 'date', requestInit })
    ),
    queryClient.prefetchInfiniteQuery(['popularVideos'], () =>
      getVideos({ order: 'viewCount', requestInit })
    ),
    queryClient.prefetchInfiniteQuery(['playlists'], () => getPlaylists(undefined, requestInit)),
    keywords.map(({ title, keyword }) =>
      queryClient.prefetchInfiniteQuery(['searchVideo', keyword], () =>
        getVideosWithKeyword({ title, keyword, requestInit })
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
