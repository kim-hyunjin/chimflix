import { YoutubeSnippet } from '@/types/youtube';

import styles from './VideoList.module.css';

const VideoList = ({ videos }: { videos: YoutubeSnippet[] }) => {
  return (
    <ul className={styles.listWrapper}>
      {videos.map((v, i) => (
        <li key={v.id} className={styles.listItem}>
          <div className={styles.listItemNumber}>{i + 1}</div>
          <iframe
            id='ytplayer'
            width='200'
            height='100'
            src={`https://www.youtube.com/embed/${v.id}`}
            frameBorder='0'
            allowFullScreen
          ></iframe>
          <div className={styles.listItemTitle}>
            <p>{v.title}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default VideoList;
