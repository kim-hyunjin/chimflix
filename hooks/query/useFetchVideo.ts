import { YoutubeSnippetsWithPage } from '@/lib/videos';

import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchVideo = ({
  queryKey,
  initialData,
  order,
}: {
  queryKey: string;
  initialData?: YoutubeSnippetsWithPage;
  order?: 'date' | 'viewCount';
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey],
    async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/search?order=date${pageParam ? `&pageToken=${pageParam}` : ''}${
          order ? `&order=${order}` : ''
        }`,
        { method: 'GET' }
      );
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [null],
          }
        : undefined,
      refetchOnWindowFocus: false,
    }
  );

  const seenItems: Record<string, boolean> = {};

  const data = queryResult.data?.pages
    .flatMap((p) => p.datas)
    .filter((el) => {
      if (!el?.id) return false;
      if (seenItems[el.id]) {
        return false;
      }
      seenItems[el.id] = true;
      return true;
    });

  return {
    ...queryResult,
    data,
  };
};

export default useFetchVideo;
