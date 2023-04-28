import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Modal from 'react-modal';
import clsx from 'classnames';

import styles from '@/styles/Video.module.css';
import { getVideoDetail } from '@/lib/videos';
import { VideoInfo } from '@/types/youtube';
import { GetServerSideProps } from 'next';
import NavBar from '@/components/nav/Navbar';
import useLikeHandler from '@/hooks/useLikeHandler';
import Like from '@/components/icons/Like';
import DisLike from '@/components/icons/DisLike';

import { createNewStats, getStatsData } from 'pages/api/stats';
import { Stats } from '@/types/hasura';

Modal.setAppElement('#__next');

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const videoId = String(params?.videoId);
  const token = String(req.cookies.token);

  const video: VideoInfo | null = await getVideoDetail(videoId);
  const stats: Stats | undefined = await getStatsData(token, videoId);
  console.log({ stats });

  if (stats) {
    return {
      props: {
        video,
        stats,
      },
    };
  }

  const newStats = await createNewStats(token, videoId);
  return {
    props: {
      video,
      stats: newStats,
    },
  };
};

const Video = ({ video, stats }: { video: VideoInfo; stats: Stats }) => {
  const router = useRouter();
  const { videoId } = router.query;

  const { toggleLike, toggleDisLike, handleToggleLike, handleToggleDislike } =
    useLikeHandler(stats);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const { title, publishedAt, description, viewCount } = video;

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel='Watch the video'
        onRequestClose={handleClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id='ytplayer'
          className={styles.videoPlayer}
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder='0'
          allowFullScreen
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishedAt}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.labelText}>View Count: </span>
                <span className={styles.valueText}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
