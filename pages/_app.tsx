import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { magic } from '@/lib/magic-client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useIsRouting from '@/hooks/useIsRouting';
import Loading from '@/components/loading/loading';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const checkIsLoggedIn = useCallback(async () => {
    if (!magic) return;
    const isLoggedIn = await magic.user.isLoggedIn();

    if (isLoggedIn) {
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    checkIsLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRouting = useIsRouting();

  return isRouting ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
