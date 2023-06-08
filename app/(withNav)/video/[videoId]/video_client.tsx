'use client';

import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import Modal from 'react-modal';

import styles from '@/styles/Video.module.css';
import { VideoInfo } from '@/types/youtube';
import useVideoStatUpdateHandler, { LIKE } from '@/hooks/useVideoStatUpdateHandler';
import Like from '@/components/icons/Like';
import DisLike from '@/components/icons/DisLike';

import { Stats } from '@/types/hasura';
import Saved from '@/components/icons/Saved';

import Youtube from 'react-youtube';
import NoData from '@/components/error/NoData';

Modal.setAppElement('#root');

export default function VideoDetail({
  video,
  stats,
}: {
  video: VideoInfo | null;
  stats: Stats | null;
}) {
  const router = useRouter();
  const params = useParams();
  const videoId = params?.['videoId'];

  const updateHandler = useVideoStatUpdateHandler(stats);

  const youtubeRef = useRef<any>();

  useEffect(() => {
    return () => {
      handlePause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handlePause = () => {
    if (!updateHandler || !youtubeRef.current) return;
    const currentTime = youtubeRef.current.getCurrentTime();
    const isWatched = youtubeRef.current.playerInfo.duration - currentTime < 30;
    updateHandler.updatePlayedTimeAndWatched(currentTime, isWatched);
  };

  if (!video) {
    return <NoData />;
  }

  const { title, publishedAt, description, viewCount } = video;

  return (
    <div>
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
              start: stats?.playedTime ?? 0,
            },
          }}
          onReady={(e) => (youtubeRef.current = e.target)}
          onPause={handlePause}
        />

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <div className={styles.topContent}>
                <div className={styles.topContentLeft}>
                  <p className={styles.publishTime}>{publishedAt}</p>
                  {updateHandler && (
                    <div className={styles.likeDislikeBtnWrapper}>
                      <div className={styles.likeBtnWrapper}>
                        <button onClick={updateHandler.handleToggleLike}>
                          <div className={styles.btnWrapper}>
                            <Like selected={updateHandler.favourited === LIKE.LIKE} />
                          </div>
                        </button>
                      </div>
                      <button onClick={updateHandler.handleToggleDislike}>
                        <div className={styles.btnWrapper}>
                          <DisLike selected={updateHandler.favourited === LIKE.DISLIKE} />
                        </div>
                      </button>
                      <Saved saved={updateHandler.saved} onClick={updateHandler.handleToggleSave} />
                    </div>
                  )}
                </div>
                <p className={styles.subText}>
                  <span className={styles.labelText}>View Count: </span>
                  <span className={styles.valueText}>{viewCount}</span>
                </p>
              </div>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
