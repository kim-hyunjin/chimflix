import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';
import NavBar from '../components/nav/Navbar';
import styles from '../styles/Home.module.css';
import {
  getPlaylists,
  getVideos,
  getVideosWithKeyword,
  YoutubeSnippetsWithPage,
} from '../lib/videos';

import useFetchPlaylist from '@/hooks/query/useFetchPlaylist';
import useFetchWatched from '@/hooks/query/useFetchWatched';
import SectionCardsWithKeyword from '@/components/card/SectionCardsWithKeyword';
import useFetchVideo from '@/hooks/query/useFetchVideo';
import useFetchSaved from '@/hooks/query/useFetchSaved';
import useFetchWatchingNow from '@/hooks/query/useFetchWatchingNow';
import useGlobalSearch from '@/hooks/query/useGlobalSearch';
import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import NoData from '@/components/error/NoData';

type IndexPageServerData = {
  initialRecentVideos: YoutubeSnippetsWithPage;
  initialPopularVideos: YoutubeSnippetsWithPage;
  initialPlaylist: YoutubeSnippetsWithPage;
  initialOtherContents:
    | { title: string; keyword: string; contents: YoutubeSnippetsWithPage }[]
    | null;
};
export const getStaticProps: GetStaticProps<IndexPageServerData> = async () => {
  const noData = { datas: [], nextPageToken: null };

  const [initialRecentVideos, initialPopularVideos, initialPlaylist, ...initialOtherContents] =
    await Promise.allSettled([
      getVideos({ order: 'date' }),
      getVideos({ order: 'viewCount' }),
      getPlaylists(),
      getVideosWithKeyword({ title: '월드컵 모음', keyword: '월드컵' }),
      getVideosWithKeyword({
        title: '도라지 도라지 배도라지',
        keyword: '배도라지',
      }),
      getVideosWithKeyword({ title: '침.철.단', keyword: '침철단' }),
      getVideosWithKeyword({ title: '다양한 손님들과', keyword: '초대석' }),
      getVideosWithKeyword({ title: '유익함까지 챙기기', keyword: '특강' }),
    ]);

  const fulfilledOtherContents = initialOtherContents
    .filter((c) => c.status === 'fulfilled')
    .map((f: any) => f.value);

  const props = {
    initialRecentVideos:
      initialRecentVideos.status === 'fulfilled' ? initialRecentVideos.value : noData,
    initialPopularVideos:
      initialPopularVideos.status === 'fulfilled' ? initialPopularVideos.value : noData,
    initialPlaylist: initialPlaylist.status === 'fulfilled' ? initialPlaylist.value : noData,
    initialOtherContents: fulfilledOtherContents.length > 0 ? fulfilledOtherContents : null,
  };

  return {
    props,
    revalidate: 60 * 60, // 1hour
  };
};

const Home: NextPage<IndexPageServerData> = ({
  initialRecentVideos,
  initialPopularVideos,
  initialPlaylist,
  initialOtherContents,
}) => {
  const {
    data: recentVideos,
    isFetching: isRecentVideosFetching,
    hasNextPage: isRecentVideosHasNextPage,
    fetchNextPage: fetchNextRecentVideos,
  } = useFetchVideo({
    queryKey: 'recentVideos',
    initialData: initialRecentVideos,
  });

  const {
    data: popularVideos,
    isFetching: isPopularVideoFetching,
    hasNextPage: isPopularVideoHasNextPage,
    fetchNextPage: fetchNextPopularVideos,
  } = useFetchVideo({
    queryKey: 'popularVideos',
    initialData: initialPopularVideos,
  });

  const {
    data: playlists,
    isFetching: isPlaylistFetching,
    hasNextPage: isPlaylistHasNextPage,
    fetchNextPage: fetchNextPlaylist,
  } = useFetchPlaylist({
    queryKey: 'playlists',
    initialData: initialPlaylist,
  });

  const {
    data: watched,
    isFetching: isWatchedFetching,
    hasNextPage: isWatchedHasNextPage,
    fetchNextPage: fetchNextWatched,
  } = useFetchWatched();

  const {
    data: saved,
    isFetching: isSavedFetching,
    hasNextPage: isSavedHasNextPage,
    fetchNextPage: fetchNextSaved,
  } = useFetchSaved();

  const {
    data: watching,
    isFetching: isWatchingNowFetching,
    hasNextPage: isWatchingNowHasNextPage,
    fetchNextPage: fetchNextWatchingNow,
  } = useFetchWatchingNow();

  const [gsk] = useAtom(globalSearchKeyword);
  const {
    data: globalSearchResult,
    isFetching: isGlobalSearchFetching,
    hasNextPage: isGlobalSearchHasNextPage,
    fetchNextPage: fetchNextGlobalSearch,
  } = useGlobalSearch();

  const bannerVideo = initialRecentVideos.datas[0];
  if (gsk === '') {
    return (
      <Layout>
        {bannerVideo && (
          <Banner videoId={bannerVideo.id} title={bannerVideo.title} imgUrl={bannerVideo.imgUrl} />
        )}
        <div className={styles.sectionWrapper}>
          <SectionCards
            title='시청중인 컨텐츠'
            datas={watching}
            size={'large'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isWatchingNowFetching,
              hasNext: Boolean(isWatchingNowHasNextPage),
              fetchNextData: fetchNextWatchingNow,
            }}
          />
          <SectionCards
            title='최신 컨텐츠'
            datas={recentVideos || []}
            size={'large'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isRecentVideosFetching,
              hasNext: (recentVideos || []).length <= 100 && Boolean(isRecentVideosHasNextPage),
              fetchNextData: fetchNextRecentVideos,
            }}
          />
          <SectionCards
            title='인기 컨텐츠'
            datas={popularVideos || []}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isPopularVideoFetching,
              hasNext: (popularVideos || []).length <= 100 && Boolean(isPopularVideoHasNextPage),
              fetchNextData: fetchNextPopularVideos,
            }}
          />
          <SectionCards
            title='내가 찜한 컨텐츠'
            datas={saved}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isSavedFetching,
              hasNext: Boolean(isSavedHasNextPage),
              fetchNextData: fetchNextSaved,
            }}
          />
          <SectionCards
            title='플레이리스트'
            datas={playlists}
            size={'medium'}
            type={'playlist'}
            nextDataFetchOption={{
              isFetching: isPlaylistFetching,
              hasNext: Boolean(isPlaylistHasNextPage),
              fetchNextData: fetchNextPlaylist,
            }}
          />
          <SectionCards
            title='다시보기'
            datas={watched}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isWatchedFetching,
              hasNext: Boolean(isWatchedHasNextPage),
              fetchNextData: fetchNextWatched,
            }}
          />
          {initialOtherContents?.map((c) => (
            <SectionCardsWithKeyword
              key={c.title}
              title={c.title}
              keyword={c.keyword}
              initialData={c.contents}
              size={'medium'}
            />
          ))}
        </div>
      </Layout>
    );
  }
  if (globalSearchResult && globalSearchResult.length > 0) {
    return (
      <Layout>
        <div className={styles.sectionWrapperWithoutBanner}>
          <SectionCards
            title=''
            datas={globalSearchResult}
            size='small'
            type='video'
            shouldWrap={true}
            nextDataFetchOption={{
              isFetching: isGlobalSearchFetching,
              hasNext: Boolean(isGlobalSearchHasNextPage),
              fetchNextData: fetchNextGlobalSearch,
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.sectionWrapper}>
        <NoData />
      </div>
    </Layout>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chimflix</title>
        <meta name='description' content='침플릭스 chimflix - 침착맨을 위한 넷플릭스' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.main}>
        <NavBar />
        {children}
      </div>
    </div>
  );
};

export default Home;
