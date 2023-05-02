import Head from 'next/head';
import NavBar from '@/components/nav/Navbar';

import SectionCards from '@/components/card/SectionCards';

import styles from '@/styles/MyList.module.css';
import { GetServerSideProps } from 'next';
import { getSavedVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { YoutubeSnippet } from '@/types/youtube';
import useFetchSaved from '@/hooks/query/useFetchSaved';

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

  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
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
        </div>
      </main>
    </div>
  );
};

export default MyList;
