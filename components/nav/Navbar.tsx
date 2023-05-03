import Link from 'next/link';

import styles from './Navbar.module.css';

import Image from 'next/image';
import Logo from './Logo';
import { MouseEventHandler, useCallback, useState, useEffect, ChangeEventHandler } from 'react';

import { magic } from '@/lib/magic-client';
import { useRouter } from 'next/router';
import { removeTokenCookie } from '@/lib/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [searchClick, setSearchClick] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [_, setGlobalSearchKeyword] = useAtom(globalSearchKeyword);

  // update globalSearchKeyword atom state
  useDebounceEffect(() => {
    setGlobalSearchKeyword(searchKeyword);
  });

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
        removeTokenCookie();
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

  const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  const [scrollY, setScrollY] = useState(0);
  const scrollEventHandler = () => {
    setScrollY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener('scroll', scrollEventHandler);

    return () => {
      window.removeEventListener('scroll', scrollEventHandler);
    };
  }, []);

  return (
    <>
      <div className={scrollY === 0 ? styles.container : styles.container2}>
        <div className={styles.wrapper}>
          <Logo />
          <div className={styles.navWrapper}>
            <ul className={styles.navItems}>
              <li className={styles.navItem}>
                <Link href={'/'}>
                  <a>Home</a>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href={'/browse/my-list'}>
                  <a>My List</a>
                </Link>
              </li>
            </ul>

            <nav className={styles.navContainer}>
              <motion.div
                animate={{ width: searchClick ? '15rem' : '1.2rem' }}
                className={searchClick ? styles.searchBoxActive : styles.searchBox}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    cursor: 'pointer',
                    width: '1rem',
                  }}
                  onClick={() => setSearchClick(true)}
                />
                <input
                  className={styles.searchInput}
                  placeholder={'제목'}
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  style={{
                    display: searchClick ? 'block' : 'none',
                  }}
                />
              </motion.div>
              <div>
                <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                  <p className={styles.username}>{username}</p>
                  <Image
                    src='/static/expand_more.svg'
                    alt='Expand more'
                    width='24px'
                    height='24px'
                  />
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
      </div>
      <div
        className={styles.overlay}
        style={{
          display: searchClick ? 'block' : 'none',
        }}
        onClick={() => {
          if (searchKeyword === '') {
            setSearchClick(false);
          }
        }}
      ></div>
    </>
  );
};

export default NavBar;
