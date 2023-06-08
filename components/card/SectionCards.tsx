import useHorizontalScrolling from '@/hooks/useHorizontalScrolling';
import Link from 'next/link';
import { YoutubeSnippet } from '../../types/youtube';
import Card from './Card';

import clsx from 'classnames';

import styles from './SectionCards.module.css';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

interface SectionCardsProps {
  title: string;
  datas: YoutubeSnippet[];
  type: 'video' | 'playlist';
  size?: 'large' | 'medium' | 'small';
  shouldWrap?: boolean;
  nextDataFetchOption?: {
    isFetching: boolean;
    hasNext: boolean;
    fetchNextData: () => void;
  };
}
const SectionCards = (props: SectionCardsProps) => {
  const { title, datas = [], type, size, shouldWrap, nextDataFetchOption } = props;

  const { scrollRef, onWheel, scrollStyle } = useHorizontalScrolling();
  const { setTargeEl } = useInfiniteScroll(
    nextDataFetchOption?.isFetching,
    nextDataFetchOption?.fetchNextData
  );

  if (datas.length === 0) {
    return null;
  }
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        ref={scrollRef}
        className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}
        onWheel={!shouldWrap ? onWheel : undefined}
        style={!shouldWrap ? scrollStyle : undefined}
      >
        {datas.map((data, i) => (
          <Link key={data.id} href={`/${type}/${data.id}`}>
            <Card imgUrl={data.imgUrl} alt={data.title} size={size} elemIndex={i} />
          </Link>
        ))}
        {props.nextDataFetchOption?.hasNext && <div ref={setTargeEl}></div>}
      </div>
    </section>
  );
};

export default SectionCards;
