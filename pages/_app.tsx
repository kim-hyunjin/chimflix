import '../styles/globals.css';
import type { AppProps } from 'next/app';

import useIsRouting from '@/hooks/useIsRouting';
import Loading from '@/components/loading/loading';

function MyApp({ Component, pageProps }: AppProps) {
  const isRouting = useIsRouting();

  return isRouting ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
