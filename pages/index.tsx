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
import { YoutubeSnippet } from '../types/youtube';
import { useEffect, useState } from 'react';

import useSearchVideo from '@/hooks/query/useSearchVideo';

type IndexPageServerData = {
  initialRecentVideos: YoutubeSnippetsWithPage;
  initialPopularVideos: YoutubeSnippetsWithPage;
  initialPlaylist: YoutubeSnippetsWithPage;
  initialOtherContents: { title: string; contents: YoutubeSnippet[] }[];
};
export const getStaticProps: GetStaticProps<IndexPageServerData> = async () => {
  const [initialRecentVideos, popularVideos, playlist, ...initialOtherContents] = await Promise.all(
    [
      getVideos({ order: 'date' }),
      [], // getVideos({ order: 'viewCount' }),
      [], // getPlaylists(),
      // getVideosWithKeyword({ title: '월드컵 모음', keyword: '월드컵' }),
      // getVideosWithKeyword({
      //   title: '도라지 도라지 배도라지',
      //   keyword: '배도라지',
      // }),
      // getVideosWithKeyword({ title: '침.철.단', keyword: '침철단' }),
      // getVideosWithKeyword({ title: '다양한 손님들과', keyword: '초대석' }),
      // getVideosWithKeyword({ title: '유익함까지 챙기기', keyword: '특강' }),
    ]
  );

  const emptyData: YoutubeSnippetsWithPage = {
    datas: [],
    nextPageToken: null,
  };

  console.log({ initialRecentVideos });
  return {
    props: {
      initialRecentVideos,
      initialPopularVideos: emptyData,
      initialPlaylist: emptyData,
      initialOtherContents,
    },
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
    hasNextPage: recentVideosHasNextPage,
    fetchNextPage: fetchNextRecentVideos,
  } = useSearchVideo({
    queryKey: 'recentVideos',
    initialData: initialRecentVideos,
  });

  console.log({
    recentVideos,
    isRecentVideosFetching,
    recentVideosHasNextPage,
    fetchNextRecentVideos,
  });
  const [watched, setWatched] = useState<YoutubeSnippet[]>([]);
  // useEffect(() => {
  //   fetch('/api/watched', { method: 'GET' })
  //     .then((r) => r.json())
  //     .then((r) => setWatched(r.watched));
  // }, []);

  const bannerVideo = initialRecentVideos.datas[0];
  return (
    <div className={styles.container}>
      <Head>
        <title>Chimflix</title>
        <meta name='description' content='침플릭스 chimflix - 침착맨을 위한 넷플릭스' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.main}>
        <NavBar />
        {bannerVideo && (
          <Banner videoId={bannerVideo.id} title={bannerVideo.title} imgUrl={bannerVideo.imgUrl} />
        )}
        <div className={styles.sectionWrapper}>
          <SectionCards
            title='최신 컨텐츠'
            datas={recentVideos}
            size={'large'}
            type={'video'}
            nextDataFetchOption={{
              isFetching: isRecentVideosFetching,
              hasNext: recentVideos.length <= 100 && Boolean(recentVideosHasNextPage),
              fetchNextData: fetchNextRecentVideos,
            }}
          />
          {/* <SectionCards title='인기 컨텐츠' datas={[]} size={'medium'} type={'video'} />
          <SectionCards title='플레이리스트' datas={[]} size={'medium'} type={'playlist'} />
          <SectionCards title='평가한 컨텐츠' datas={watched} size={'medium'} type={'video'} />
          {initialOtherContents.map((c) => (
            <SectionCards
              key={c.title}
              title={c.title}
              datas={c.contents}
              size={'medium'}
              type={'video'}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Home;
