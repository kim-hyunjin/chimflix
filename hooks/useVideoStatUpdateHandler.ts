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
  const res = await fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });

  return await res.json();
};

const useVideoStatUpdateHandler = (stats: Stats | null) => {
  const [favourited, setFavourited] = useState<LIKE | null>(stats?.favourited ?? null);
  const [watched, setWatched] = useState(stats?.watched ?? false);
  const [saved, setSaved] = useState(stats?.saved ?? false);
  const [playedTime, setPlayedTime] = useState(stats?.playedTime ?? 0);

  if (!stats) {
    return null;
  }

  const handleToggleDislike = async () => {
    const newFav = favourited === LIKE.DISLIKE ? null : LIKE.DISLIKE;
    flushSync(() => {
      setFavourited(newFav);
      setWatched(true);
    });

    const res = await updateStats({
      videoId: stats.videoId,
      favourited: newFav,
      watched,
      saved,
      playedTime,
    });

    return res;
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
      watched,
      saved,
      playedTime,
    });

    return res;
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

    setSaved(newVal);

    return res;
  };

  const updateWatched = async () => {
    if (!watched) {
      const res = await updateStats({
        videoId: stats.videoId,
        favourited,
        watched: true,
        saved,
        playedTime,
      });

      setWatched(true);

      return res;
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
    setPlayedTime(intTime);

    return res;
  };

  return {
    favourited,
    watched,
    saved,
    handleToggleLike,
    handleToggleDislike,
    handleToggleSave,
    updateWatched,
    updatePlayedTime,
  };
};

export default useVideoStatUpdateHandler;
