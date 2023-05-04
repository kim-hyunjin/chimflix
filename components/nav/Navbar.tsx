import Link from 'next/link';

import styles from './Navbar.module.css';

import Image from 'next/image';
import Logo from './Logo';
import { MouseEventHandler, useCallback, useState, useEffect, ChangeEventHandler } from 'react';

import { magic } from '@/lib/magic-client';
import { useRouter } from 'next/router';
import { checkTokenExist, removeTokenCookie } from '@/lib/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [searchClick, setSearchClick] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [_, setGlobalSearchKeyword] = useAtom(globalSearchKeyword);
  const [scrollY, setScrollY] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // fetch user name
    const getUserName = async () => {
      if (!magic) return null;
      try {
        const { email } = await magic.user.getMetadata();
        if (email) {
          setUsername(email);
        }
      } catch (err) {}
    };
    getUserName();

    // add scroll event
    const scrollEventHandler = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', scrollEventHandler);
    return () => {
      window.removeEventListener('scroll', scrollEventHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update globalSearchKeyword atom state
  useDebounceEffect(() => {
    setGlobalSearchKeyword(searchKeyword);
  });

  const handleLoginButtonClick = useCallback(() => {
    router.push('/login');
  }, [router]);

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

  const handleShowDropdown: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    setShowDropdown((prev) => !prev);
  }, []);

  const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  const isLoggedIn = checkTokenExist();

  return (
    <>
      <div className={scrollY === 0 ? styles.container : styles.container2}>
        <div className={styles.wrapper}>
          <Logo />
          <div className={styles.navWrapper}>
            <ul className={styles.navItems}>
              {mounted && isLoggedIn && (
                <li className={styles.navItem}>
                  <Link href={'/browse/my-list'}>
                    <a>내가 찜한 컨텐츠</a>
                  </Link>
                </li>
              )}
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
              <motion.div
                animate={{ width: searchClick ? '90vw' : '1.2rem' }}
                className={searchClick ? styles.mobileSearchBoxActive : styles.mobileSearchBox}
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
              {mounted && isLoggedIn && (
                <div>
                  <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                    <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff' }} />
                  </button>

                  {showDropdown && (
                    <div className={styles.navDropdown}>
                      <div>
                        <p className={styles.username}>{username}</p>
                        <Link href={'/browse/my-list'}>
                          <a>My List</a>
                        </Link>

                        <a className={styles.linkName} onClick={handleSignout}>
                          Sign out
                        </a>
                        <div className={styles.lineWrapper}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {mounted && !isLoggedIn && (
                <button className={styles.navItem} onClick={handleLoginButtonClick}>
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div
        className={styles.overlay}
        style={{
          display: searchClick && searchKeyword === '' ? 'block' : 'none',
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
