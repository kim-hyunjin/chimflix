import { YoutubeSnippet } from '@/types/youtube';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchWatched = () => {
  const queryResult = useInfiniteQuery<{
    watched: YoutubeSnippet[];
    total: number;
  }>(
    ['watched'],
    async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/watched
        ${pageParam ? `?offset=${pageParam}` : ''}
        `,
        { method: 'GET' }
      );
      return await res.json();
    },
    {
      getNextPageParam: (lastPage, allPage) => {
        const fetchedLen = allPage.flatMap((p) => p.watched).length;
        if (lastPage.total > fetchedLen) {
          return fetchedLen;
        } else {
          null;
        }
      },

      refetchOnWindowFocus: false,
    }
  );

  const seenItems: Record<string, boolean> = {};
  const data =
    queryResult.data?.pages
      .flatMap((p) => p.watched)
      .filter((el) => {
        if (seenItems[el.id]) {
          return false;
        }
        seenItems[el.id] = true;
        return true;
      }) || [];

  return {
    ...queryResult,
    data,
  };
};

export default useFetchWatched;