import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Modal from 'react-modal';
import clsx from 'classnames';

import styles from '@/styles/Video.module.css';
import {
  getPlaylistDetail,
  getPlaylistItems,
  getPlaylists,
  YoutubeSnippetsWithPage,
} from '@/lib/videos';
import { PlaylistInfo, YoutubeSnippet } from '@/types/youtube';
import { GetStaticProps } from 'next';
import NavBar from '@/components/nav/Navbar';
import VideoList from '@/components/videos/VideoList';
import useFetchPlaylistItem from '@/hooks/query/useFetchPlaylistItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

Modal.setAppElement('#__next');

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const playlistId = String(params?.playlistId);
  const videos: YoutubeSnippetsWithPage = await getPlaylistItems(playlistId);
  const playlistInfo: PlaylistInfo | null = await getPlaylistDetail(playlistId);

  return {
    props: {
      playlistId,
      videos,
      playlistInfo,
    },
    revalidate: 60 * 30, // 30min
  };
};

export async function getStaticPaths() {
  const listOfPlaylists = await getPlaylists();

  const paths = listOfPlaylists.datas.map((p) => ({
    params: { playlistId: p.id },
  }));

  return { paths, fallback: true };
}

const Video = ({
  playlistId,
  videos,
  playlistInfo,
}: {
  playlistId: string;
  videos: YoutubeSnippetsWithPage;
  playlistInfo: PlaylistInfo | null;
}) => {
  const { data, isFetching, hasNextPage, fetchNextPage } = useFetchPlaylistItem({
    queryKey: 'playlistItems',
    playlistId,
    initialData: videos,
  });

  const { setTargeEl } = useInfiniteScroll(isFetching, fetchNextPage);

  const router = useRouter();

  const handleClose = useCallback(() => {
    router.push('/');
  }, [router]);

  if (!playlistInfo) throw new Error('playlist 정보가 없습니다.');

  const { title, description, publishedAt } = playlistInfo;

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel='Watch the series'
        onRequestClose={handleClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id='ytplayer'
          className={styles.videoPlayer}
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videos.datas[0]?.id}?autoplay=1`}
          frameBorder='0'
          allowFullScreen
        ></iframe>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishedAt}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
          <VideoList videos={data} />
          {hasNextPage && <div ref={setTargeEl}></div>}
        </div>
      </Modal>
    </div>
  );
};

export default Video;
