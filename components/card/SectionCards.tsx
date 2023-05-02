import useHorizontalScrolling from '@/hooks/useHorizontalScrolling';
import Link from 'next/link';
import { YoutubeSnippet } from '../../types/youtube';
import Card from './Card';

import clsx from 'classnames';

import styles from './SectionCards.module.css';

interface SectionCardsProps {
  title: string;
  datas: YoutubeSnippet[];
  type: 'video' | 'playlist';
  size?: 'large' | 'medium' | 'small';
  shouldWrap?: boolean;
}
const SectionCards = (props: SectionCardsProps) => {
  const { title, datas = [], type, size, shouldWrap } = props;

  const { scrollRef, onWheel, scrollStyle } = useHorizontalScrolling();

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
            <a>
              <Card imgUrl={data.imgUrl} size={size} elemIndex={i} />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
