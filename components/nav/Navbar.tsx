import Link from 'next/link';

import styles from './Navbar.module.css';

import Image from 'next/image';
import Logo from './Logo';
import { MouseEventHandler, useCallback, useState, useEffect } from 'react';

import { magic } from '@/lib/magic-client';
import { useRouter } from 'next/router';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  const router = useRouter();

  const getUserName = useCallback(async () => {
    if (!magic) return null;
    try {
      const { email } = await magic.user.getMetadata();
      if (email) {
        setUsername(email);
      }
    } catch (err) {}
  }, []);

  const handleSignout = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!magic) return;
      try {
        await magic.user.logout();
        router.push('/login');
      } catch (err) {
        router.push('/login');
      }
    },
    [router]
  );

  useEffect(() => {
    getUserName();
  }, [getUserName]);

  const handleShowDropdown: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    setShowDropdown((prev) => !prev);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Logo />
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href={'/'}>
              <a>Home</a>
            </Link>
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image src='/static/expand_more.svg' alt='Expand more' width='24px' height='24px' />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
