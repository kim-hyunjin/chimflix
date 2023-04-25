import useHorizontalScrolling from '@/hooks/useHorizontalScrolling';
import Link from 'next/link';
import { YoutubeSnippet } from '../../types/youtube';
import Card from './Card';

import styles from './SectionCards.module.css';

interface SectionCardsProps {
  title: string;
  datas: YoutubeSnippet[];
  type: 'video' | 'playlist';
  size?: 'large' | 'medium' | 'small';
}
const SectionCards = (props: SectionCardsProps) => {
  const { title, datas = [], type, size } = props;

  const { scrollRef, onWheel, scrollStyle } = useHorizontalScrolling();
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div ref={scrollRef} className={styles.cardWrapper} onWheel={onWheel} style={scrollStyle}>
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
