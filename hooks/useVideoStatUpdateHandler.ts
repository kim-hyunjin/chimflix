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
}): Promise<void> => {
  fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });
};

const updateStatsTimeAndWatched = async (newStats: {
  videoId: string;
  playedTime: number;
  watched: boolean;
}): Promise<void> => {
  fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify(newStats),
    headers: { 'Content-Type': 'application/json' },
  });
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

    updateStatsByAction({
      videoId: stats.videoId,
      favourited: newFav,
      saved,
    });
  };

  const handleToggleLike = async () => {
    const newFav = favourited === LIKE.LIKE ? null : LIKE.LIKE;
    flushSync(() => {
      setFavourited(newFav);
    });

    updateStatsByAction({
      videoId: stats.videoId,
      favourited: newFav,
      saved,
    });
  };

  const handleToggleSave = async () => {
    const newVal = !saved;
    flushSync(() => {
      setSaved(newVal);
    });

    updateStatsByAction({
      videoId: stats.videoId,
      favourited,
      saved: newVal,
    });
  };

  const updatePlayedTimeAndWatched = async (time: number, watched: boolean) => {
    const intTime = Math.floor(time);
    updateStatsTimeAndWatched({
      videoId: stats.videoId,
      watched,
      playedTime: intTime,
    });
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
