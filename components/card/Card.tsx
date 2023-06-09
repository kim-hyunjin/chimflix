import Image from 'next/image';

import cls from 'classnames';
import { motion } from 'framer-motion';

import styles from './Card.module.css';
import { ReactEventHandler, useCallback, useState } from 'react';
import { rgbDataURL } from '@/utils/blur_data';
import { mobileCardSize, pcCardSize } from './constant';

const DEFAULT_IMAGE_SRC =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80';
interface CardProps {
  imgUrl: string;
  elemIndex: number;
  alt?: string;
  size?: 'large' | 'medium' | 'small';
}
const cardStyleMap = {
  large: styles.lgItem,
  medium: styles.mdItem,
  small: styles.smItem,
};

const Card = ({ imgUrl, elemIndex, size = 'medium', alt = 'image' }: CardProps) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const handleOnError: ReactEventHandler<HTMLImageElement> = useCallback((e) => {
    setImgSrc(DEFAULT_IMAGE_SRC);
  }, []);

  const whileOverScale = elemIndex === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const imageSize = window.innerWidth <= 450 ? mobileCardSize[size] : pcCardSize[size];

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, cardStyleMap[size])}
        whileHover={{ ...whileOverScale }}
      >
        <Image
          src={imgSrc}
          alt={alt}
          className={styles.cardImg}
          onError={handleOnError}
          width={imageSize.width}
          height={imageSize.height}
          quality={75}
          placeholder='blur'
          blurDataURL={rgbDataURL(220, 220, 220)}
        />
      </motion.div>
    </div>
  );
};

export default Card;
