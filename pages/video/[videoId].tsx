import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import clsx from 'classnames';

import styles from '@/styles/Video.module.css';
import { getVideoDetail } from '@/lib/videos';
import { VideoInfo } from '@/types/youtube';
import { GetServerSideProps } from 'next';
import NavBar from '@/components/nav/Navbar';
import useVideoStatUpdateHandler, { LIKE } from '@/hooks/useVideoStatUpdateHandler';
import Like from '@/components/icons/Like';
import DisLike from '@/components/icons/DisLike';

import { createNewStats, getStatsData } from 'pages/api/stats';
import { Stats } from '@/types/hasura';
import Saved from '@/components/icons/Saved';

import Youtube from 'react-youtube';

Modal.setAppElement('#__next');

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const videoId = String(params?.videoId);
  const token = String(req.cookies.token);

  const [video, stats] = await Promise.all([getVideoDetail(videoId), getStatsData(token, videoId)]);

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

  const {
    favourited,
    watched,
    saved,
    handleToggleLike,
    handleToggleDislike,
    handleToggleSave,
    updateWatched,
    updatePlayedTime,
  } = useVideoStatUpdateHandler(stats);

  const youtubeRef = useRef<any>();

  useEffect(() => {
    return () => {
      if (youtubeRef.current) {
        const currentTime = youtubeRef.current.getCurrentTime();
        updatePlayedTime(currentTime);
        if (youtubeRef.current.playerInfo.duration - currentTime < 30) {
          updateWatched();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Youtube
          videoId={String(videoId)}
          iframeClassName={styles.videoPlayer}
          opts={{
            width: '100%',
            height: '360',
            playerVars: {
              autoplay: 1,
              start: stats.playedTime,
            },
          }}
          onReady={(e) => (youtubeRef.current = e.target)}
          onPause={(e) => {
            const currentTime = e.target.getCurrentTime();
            updatePlayedTime(currentTime);

            if (e.target.playerInfo.duration - currentTime < 30) {
              updateWatched();
            }
          }}
        />

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <div className={styles.topContent}>
                <p className={styles.publishTime}>{publishedAt}</p>
                <div className={styles.likeDislikeBtnWrapper}>
                  <div className={styles.likeBtnWrapper}>
                    <button onClick={handleToggleLike}>
                      <div className={styles.btnWrapper}>
                        <Like selected={favourited === LIKE.LIKE} />
                      </div>
                    </button>
                  </div>
                  <button onClick={handleToggleDislike}>
                    <div className={styles.btnWrapper}>
                      <DisLike selected={favourited === LIKE.DISLIKE} />
                    </div>
                  </button>
                  <Saved saved={saved} onClick={handleToggleSave} />
                </div>
              </div>
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
