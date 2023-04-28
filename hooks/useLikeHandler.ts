import { Stats } from '@/types/hasura';
import { useState } from 'react';

enum LIKE {
  DISLIKE,
  LIKE,
}

const updateLike = async (videoId: string, favourited: LIKE | null) => {
  const res = await fetch('/api/stats', {
    method: 'POST',
    body: JSON.stringify({
      videoId,
      favourited,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return await res.json();
};

const useLikeHandler = (stats: Stats) => {
  const [toggleLike, setToggleLike] = useState(stats.favourited === 1);
  const [toggleDisLike, setToggleDisLike] = useState(stats.favourited === 0);

  const handleToggleDislike = async () => {
    const dislike = !toggleDisLike;

    setToggleDisLike((prev) => !prev);
    if (toggleLike) {
      setToggleLike((prev) => !prev);
    }

    updateLike(stats.videoId, dislike ? LIKE.DISLIKE : null);
  };

  const handleToggleLike = async () => {
    const like = !toggleLike;

    setToggleLike((prev) => !prev);
    if (toggleDisLike) {
      setToggleDisLike((prev) => !prev);
    }

    updateLike(stats.videoId, like ? LIKE.LIKE : null);
  };

  return { toggleLike, toggleDisLike, handleToggleLike, handleToggleDislike };
};

export default useLikeHandler;
