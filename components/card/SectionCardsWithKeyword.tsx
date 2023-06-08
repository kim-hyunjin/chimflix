import useHorizontalScrolling from '@/hooks/useHorizontalScrolling';
import Link from 'next/link';
import Card from './Card';

import clsx from 'classnames';

import styles from './SectionCards.module.css';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useSearchVideo from '@/hooks/query/useSearchVideo';
import { YoutubeSnippetsWithPage } from '@/lib/videos';

interface SectionCardsProps {
  title: string;
  keyword: string;
  initialData?: YoutubeSnippetsWithPage;
  size?: 'large' | 'medium' | 'small';
  shouldWrap?: boolean;
}
const SectionCardsWithKeyword = ({
  title,
  keyword,
  initialData,
  size,
  shouldWrap,
}: SectionCardsProps) => {
  const { data, isFetching, hasNextPage, fetchNextPage } = useSearchVideo({
    queryKey: 'searchVideo',
    searchKeyword: keyword,
    initialData,
  });

  const { scrollRef, onWheel, scrollStyle } = useHorizontalScrolling();
  const { setTargeEl } = useInfiniteScroll(isFetching, fetchNextPage);

  if (!data) {
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
        {data.map((data, i) => (
          (<Link key={data.id} href={`/video/${data.id}`}>

            <Card imgUrl={data.imgUrl} size={size} elemIndex={i} />

          </Link>)
        ))}
        {hasNextPage && <div ref={setTargeEl}></div>}
      </div>
    </section>
  );
};

export default SectionCardsWithKeyword;
