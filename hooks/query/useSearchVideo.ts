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
  searchKeyword: string;
  initialData?: YoutubeSnippetsWithPage;
  title?: string;
  order?: 'date' | 'viewCount';
}) => {
  const queryResult = useInfiniteQuery<{ title?: string; contents: YoutubeSnippetsWithPage }>(
    [queryKey, searchKeyword],
    async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/search?order=date&keyword=${searchKeyword}${
          pageParam ? `&pageToken=${pageParam}` : ''
        }${title ? `&title=${title}` : ''}${order ? `&order=${order}` : ''}`,
        { method: 'GET' }
      );
      return await res.json();
    },
    {
      getNextPageParam: (lastPage) => lastPage.contents.nextPageToken,
      initialData: initialData
        ? {
            pages: [{ title, contents: initialData }],
            pageParams: [null],
          }
        : undefined,
      refetchOnWindowFocus: false,
      enabled: searchKeyword !== '',
    }
  );

  const seenItems: Record<string, boolean> = {};

  const data = queryResult.data?.pages
    .flatMap((p) => (p ? p.contents.datas : []))
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

export default useSearchVideo;
