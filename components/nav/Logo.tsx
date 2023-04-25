import Link from 'next/link';

import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Link href={'/'}>
      <a className={styles.logoLink}>
        <div className={styles.logoWrapper}>CHIMFLIX</div>
      </a>
    </Link>
  );
};

export default Logo;
