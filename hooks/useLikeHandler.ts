import { useState } from 'react';

const useLikeHandler = () => {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const handleToggleDislike = async () => {
    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);
  };

  const handleToggleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDisLike(toggleLike);
  };

  return { toggleLike, toggleDisLike, handleToggleLike, handleToggleDislike };
};

export default useLikeHandler;
