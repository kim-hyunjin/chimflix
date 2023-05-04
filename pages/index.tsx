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
  const recentVideos = useFetchVideo({
    queryKey: 'recentVideos',
    initialData: initialRecentVideos,
  });

  const popularVideos = useFetchVideo({
    queryKey: 'popularVideos',
    initialData: initialPopularVideos,
  });

  const playlists = useFetchPlaylist({
    queryKey: 'playlists',
    initialData: initialPlaylist,
  });

  const watched = useFetchWatched();

  const saved = useFetchSaved();

  const watching = useFetchWatchingNow();

  const [gsk] = useAtom(globalSearchKeyword);
  const globalSearch = useGlobalSearch();

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
            datas={watching.data}
            size={'large'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: watching.isFetching,
              hasNext: Boolean(watching.hasNextPage),
              fetchNextData: watching.fetchNextPage,
            }}
          />
          <SectionCards
            title='최신 컨텐츠'
            datas={recentVideos.data || []}
            size={'large'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: recentVideos.isFetching,
              hasNext: (recentVideos.data || []).length <= 100 && Boolean(recentVideos.hasNextPage),
              fetchNextData: recentVideos.fetchNextPage,
            }}
          />
          <SectionCards
            title='인기 컨텐츠'
            datas={popularVideos.data || []}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: popularVideos.isFetching,
              hasNext:
                (popularVideos.data || []).length <= 100 && Boolean(popularVideos.hasNextPage),
              fetchNextData: popularVideos.fetchNextPage,
            }}
          />
          <SectionCards
            title='내가 찜한 컨텐츠'
            datas={saved.data}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: saved.isFetching,
              hasNext: Boolean(saved.hasNextPage),
              fetchNextData: saved.fetchNextPage,
            }}
          />
          <SectionCards
            title='플레이리스트'
            datas={playlists.data}
            size={'medium'}
            type={'playlist'}
            nextDataFetchOption={{
              isFetching: playlists.isFetching,
              hasNext: Boolean(playlists.hasNextPage),
              fetchNextData: playlists.fetchNextPage,
            }}
          />
          <SectionCards
            title='다시보기'
            datas={watched.data}
            size={'medium'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: watched.isFetching,
              hasNext: Boolean(watched.hasNextPage),
              fetchNextData: watched.fetchNextPage,
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
  if (globalSearch.data && globalSearch.data.length > 0) {
    return (
      <Layout>
        <div className={styles.sectionWrapperWithoutBanner}>
          <SectionCards
            title=''
            datas={globalSearch.data}
            size='small'
            type='video'
            shouldWrap={true}
            nextDataFetchOption={{
              isFetching: globalSearch.isFetching,
              hasNext: Boolean(globalSearch.hasNextPage),
              fetchNextData: globalSearch.fetchNextPage,
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
