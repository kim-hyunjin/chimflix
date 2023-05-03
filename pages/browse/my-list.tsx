import Head from 'next/head';
import NavBar from '@/components/nav/Navbar';

import SectionCards from '@/components/card/SectionCards';

import styles from '@/styles/MyList.module.css';
import { GetServerSideProps } from 'next';
import { getSavedVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { YoutubeSnippet } from '@/types/youtube';
import useFetchSaved from '@/hooks/query/useFetchSaved';
import useGlobalSearch from '@/hooks/query/useGlobalSearch';
import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import NoData from '@/components/error/NoData';

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const token = String(req.cookies.token);

  const issuer = getIssuerFromToken(token);

  const videos = await getSavedVideos(token, issuer);

  return {
    props: {
      myListVideos: videos?.saved || [],
      total: videos?.total || 0,
    },
  };
};

const MyList = ({ myListVideos, total }: { myListVideos: YoutubeSnippet[]; total: number }) => {
  const { data, isFetching, hasNextPage, fetchNextPage } = useFetchSaved({
    saved: myListVideos,
    total,
  });
  const [gsk] = useAtom(globalSearchKeyword);
  const {
    data: globalSearch,
    isFetching: isGlobalSearchFetching,
    hasNextPage: isGlobalSearchHasNextPage,
    fetchNextPage: fetchNextGlobalSearch,
  } = useGlobalSearch();

  if (gsk === '') {
    return (
      <Layout>
        <SectionCards
          title='My List'
          datas={data}
          size='small'
          type='video'
          shouldWrap={true}
          nextDataFetchOption={{
            isFetching,
            hasNext: Boolean(hasNextPage),
            fetchNextData: fetchNextPage,
          }}
        />
      </Layout>
    );
  }

  if (globalSearch && globalSearch.length > 0) {
    return (
      <Layout>
        <SectionCards
          title=''
          datas={globalSearch}
          size='small'
          type='video'
          shouldWrap={true}
          nextDataFetchOption={{
            isFetching: isGlobalSearchFetching,
            hasNext: Boolean(isGlobalSearchHasNextPage),
            fetchNextData: fetchNextGlobalSearch,
          }}
        />
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
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>{children}</div>
      </main>
    </div>
  );
};

export default MyList;
