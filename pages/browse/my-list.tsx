import Head from 'next/head';
import NavBar from '@/components/nav/Navbar';

import SectionCards from '@/components/card/SectionCards';

import styles from '@/styles/MyList.module.css';
import { GetServerSideProps } from 'next';
import { getSavedVideos } from '@/lib/db/hasura';
import { getIssuerFromToken } from '@/lib/token';
import { YoutubeSnippet } from '@/types/youtube';

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const token = String(req.cookies.token);

  const issuer = getIssuerFromToken(token);

  const videos = await getSavedVideos(token, issuer);

  return {
    props: {
      myListVideos: videos?.saved || [],
    },
  };
};

const MyList = ({ myListVideos }: { myListVideos: YoutubeSnippet[] }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards title='My List' datas={myListVideos} size='small' type='video' />
        </div>
      </main>
    </div>
  );
};

export default MyList;
