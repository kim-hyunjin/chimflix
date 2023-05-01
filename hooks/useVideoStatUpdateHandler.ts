import { Stats } from '@/types/hasura';
import { useState } from 'react';
import { flushSync } from 'react-dom';

export enum LIKE {
  DISLIKE,
  LIKE,
}

const updateStats = async (newStats: {
  videoId: string;
  favourited: LIKE | null;
  watched: boolean;
  saved: boolean;
  playedTime: number;
}): Promise<Stats> => {
  console.log({ newStats });
  const res = await fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });

  return await res.json();
};

const useVideoStatUpdateHandler = (stats: Stats) => {
  const [favourited, setFavourited] = useState<LIKE | null>(stats.favourited);
  const [watched, setWatched] = useState(stats.watched);
  const [saved, setSaved] = useState(stats.saved);
  const [playedTime, setPlayedTime] = useState(stats.playedTime);

  const handleToggleDislike = async () => {
    const newFav = favourited === LIKE.DISLIKE ? null : LIKE.DISLIKE;
    flushSync(() => {
      setFavourited(newFav);
      setWatched(true);
    });

    const res = await updateStats({
      videoId: stats.videoId,
      favourited: newFav,
      watched: true,
      saved,
      playedTime,
    });
    console.log('updated', res);
  };

  const handleToggleLike = async () => {
    const newFav = favourited === LIKE.LIKE ? null : LIKE.LIKE;
    flushSync(() => {
      setFavourited(newFav);
      setWatched(true);
    });

    const res = await updateStats({
      videoId: stats.videoId,
      favourited: newFav,
      watched: true,
      saved,
      playedTime,
    });

    console.log('updated', res);
  };

  const handleToggleSave = async () => {
    const newVal = !saved;
    const res = await updateStats({
      videoId: stats.videoId,
      favourited,
      watched,
      saved: newVal,
      playedTime,
    });
    console.log('updated', res);

    setSaved(newVal);
  };

  const handlePlay = async () => {
    if (!watched) {
      console.log('lets play stats update');
      const res = await updateStats({
        videoId: stats.videoId,
        favourited,
        watched: true,
        saved,
        playedTime,
      });
      console.log('updated', res);

      setWatched(true);
    }
  };

  const updatePlayedTime = async (time: number) => {
    const intTime = Math.floor(time);
    const res = await updateStats({
      videoId: stats.videoId,
      favourited,
      watched,
      saved,
      playedTime: intTime,
    });
    console.log('updated', res);
    setPlayedTime(intTime);
  };

  return {
    favourited,
    watched,
    saved,
    handleToggleLike,
    handleToggleDislike,
    handleToggleSave,
    handlePlay,
    updatePlayedTime,
  };
};

export default useVideoStatUpdateHandler;