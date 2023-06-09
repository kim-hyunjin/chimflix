import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useState } from 'react';
import styles from './SectionCards.module.css';
import clsx from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from './Card';
import { YoutubeSnippet } from '@/types/youtube';

type Props = {
  title: string;
  videos: YoutubeSnippet[];
  type: 'video' | 'playlist';
  isFetching?: boolean;
  fetchNextData?: () => void;
  hasNext?: boolean;
  shouldWrap?: boolean;
  size?: 'large' | 'medium' | 'small';
};

export default function CardList({
  title,
  videos,
  type,
  isFetching,
  fetchNextData,
  hasNext,
  shouldWrap,
  size = 'medium',
}: Props) {
  const [x, setX] = useState(0);
  const [maxX, setMaxX] = useState<number | undefined>(undefined);

  const { setTargeEl } = useInfiniteScroll(isFetching, fetchNextData);

  const handleGoLeft = () => {
    setX((prev) => {
      const target = prev + window.innerWidth - 300;
      if (target > 0) return 0;
      return target;
    });
  };

  const handleGoRight = () => {
    setX((prev) => {
      const target = prev - window.innerWidth + 300;
      if (!maxX && !hasNext) {
        const maxX = -(videos.length * (size === 'large' ? 440 : 300) - window.innerWidth + 300);
        setMaxX(maxX);
        return maxX;
      }
      if (!maxX) {
        return target;
      }
      if (target >= maxX) {
        return target;
      } else {
        return maxX;
      }
    });
  };

  const wrapperSizeMap = {
    large: '300px',
    medium: '200px',
    small: '200px',
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {!shouldWrap && (
        <>
          {x !== 0 && (
            <motion.button
              className={styles.goLeftButton}
              onClick={handleGoLeft}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            >
              <div className={styles.leftArrow}></div>
            </motion.button>
          )}
          {x !== maxX && (
            <motion.button
              className={styles.goRightButton}
              onClick={handleGoRight}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            >
              <div className={styles.leftRight}></div>
            </motion.button>
          )}
        </>
      )}
      <motion.div
        className={clsx(styles.cardWrapper, shouldWrap && styles.wrap, size)}
        animate={{ x }}
        transition={{ ease: 'linear' }}
        style={{ height: wrapperSizeMap[size] }}
      >
        {videos.map((data, i) => (
          <Link key={data.id} href={`/${type}/${data.id}`}>
            <Card imgUrl={data.imgUrl} alt={data.title} size={size} elemIndex={i} />
          </Link>
        ))}
        {hasNext && <div ref={setTargeEl}></div>}
      </motion.div>
    </section>
  );
}
