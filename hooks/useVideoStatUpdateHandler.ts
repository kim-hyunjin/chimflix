import { Stats } from '@/types/hasura';
import { useState } from 'react';
import { flushSync } from 'react-dom';

export enum LIKE {
  DISLIKE,
  LIKE,
}

const updateStatsByAction = async (newStats: {
  videoId: string;
  favourited: LIKE | null;
  saved: boolean;
}): Promise<Stats> => {
  // console.log({ newStats });
  const res = await fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });

  return await res.json();
};

const updateStatsTimeAndWatched = async (newStats: {
  videoId: string;
  playedTime: number;
  watched: boolean;
}): Promise<Stats> => {
  // console.log({ newStats });
  const res = await fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });

  return await res.json();
};

const useVideoStatUpdateHandler = (stats: Stats | null) => {
  const [favourited, setFavourited] = useState<LIKE | null>(stats?.favourited ?? null);
  const [saved, setSaved] = useState(stats?.saved ?? false);

  if (!stats) {
    return null;
  }

  const handleToggleDislike = async () => {
    const newFav = favourited === LIKE.DISLIKE ? null : LIKE.DISLIKE;
    flushSync(() => {
      setFavourited(newFav);
    });

    const res = await updateStatsByAction({
      videoId: stats.videoId,
      favourited: newFav,
      saved,
    });

    return res;
  };

  const handleToggleLike = async () => {
    const newFav = favourited === LIKE.LIKE ? null : LIKE.LIKE;
    flushSync(() => {
      setFavourited(newFav);
    });

    const res = await updateStatsByAction({
      videoId: stats.videoId,
      favourited: newFav,
      saved,
    });

    return res;
  };

  const handleToggleSave = async () => {
    const newVal = !saved;
    flushSync(() => {
      setSaved(newVal);
    });

    const res = await updateStatsByAction({
      videoId: stats.videoId,
      favourited,
      saved: newVal,
    });

    return res;
  };

  const updatePlayedTimeAndWatched = async (time: number, watched: boolean) => {
    const intTime = Math.floor(time);
    const res = await updateStatsTimeAndWatched({
      videoId: stats.videoId,
      watched,
      playedTime: intTime,
    });

    return res;
  };

  return {
    favourited,
    saved,
    handleToggleLike,
    handleToggleDislike,
    handleToggleSave,
    updatePlayedTimeAndWatched,
  };
};

export default useVideoStatUpdateHandler;
