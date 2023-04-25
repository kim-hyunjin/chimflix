import Image from 'next/image';

import cls from 'classnames';
import { motion } from 'framer-motion';

import styles from './Card.module.css';
import { ReactEventHandler, useCallback, useMemo, useState } from 'react';

const DEFAULT_IMAGE_SRC =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80';
interface CardProps {
  imgUrl: string;
  elemIndex: number;
  size?: 'large' | 'medium' | 'small';
}

const Card = ({ imgUrl, elemIndex, size = 'medium' }: CardProps) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = useMemo(
    () => ({
      large: styles.lgItem,
      medium: styles.mdItem,
      small: styles.smItem,
    }),
    []
  );

  const handleOnError: ReactEventHandler<HTMLImageElement> = useCallback((e) => {
    setImgSrc(DEFAULT_IMAGE_SRC);
  }, []);

  const whileOverScale = elemIndex === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        whileHover={{ ...whileOverScale }}
      >
        <Image
          src={imgSrc}
          alt='image'
          layout='fill'
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
