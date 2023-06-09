import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useState } from 'react';
import styles from './SectionCards.module.css';
import clsx from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from './Card';
import { YoutubeSnippet } from '@/types/youtube';
import { mobileCardSize, pcCardSize } from './constant';

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

  const isMobile = window.innerWidth <= 450;

  const handleGoLeft = () => {
    setX((prev) => {
      const c = isMobile ? 0 : 300;
      const target = prev + window.innerWidth - c;
      if (target > 0) return 0;
      return target;
    });
  };

  const handleGoRight = () => {
    setX((prev) => {
      const c = isMobile ? 0 : 300;
      const target = prev - window.innerWidth + c;
      const cardSize = isMobile ? mobileCardSize[size].width : pcCardSize[size].width;
      const maxX = -(videos.length * cardSize - window.innerWidth + c);
      console.log({ prev, target, maxX });
      if (!maxX && !hasNext) {
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

  const wrapperHeight = isMobile ? mobileCardSize[size].height + 10 : pcCardSize[size].height + 20;

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
              <div className={styles.rightArrow}></div>
            </motion.button>
          )}
        </>
      )}
      <motion.div
        className={clsx(styles.cardWrapper, shouldWrap && styles.wrap, size)}
        animate={{ x }}
        transition={{ ease: 'linear' }}
        style={{ height: `${wrapperHeight}px` }}
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
