import { YoutubeSnippetsWithPage } from '@/lib/videos';

import { useInfiniteQuery } from '@tanstack/react-query';

const useSearchVideo = ({
  queryKey,
  initialData,
  title,
  searchKeyword,
  order,
}: {
  queryKey: string;
  initialData: YoutubeSnippetsWithPage;
  title?: string;
  searchKeyword?: string;
  order?: 'date' | 'viewCount';
}) => {
  const queryResult = useInfiniteQuery<YoutubeSnippetsWithPage>(
    [queryKey],
    async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/search?order=date
        ${pageParam ? `&pageToken=${pageParam}` : ''}
        ${title ? `&title=${title}` : ''}
        ${searchKeyword ? `&keyword=${searchKeyword}` : ''}
        ${order ? `&order=${order}` : ''}`,
        { method: 'GET' }
      );
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => {
        console.log({ lastPage });
        return lastPage.nextPageToken;
      },
      initialData: {
        pages: [initialData],
        pageParams: [null],
      },
      refetchOnWindowFocus: false,
    }
  );

  const seenItems: Record<string, boolean> = {};
  const data =
    queryResult.data?.pages
      .flatMap((p) => p.datas)
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

export default useSearchVideo;
