import '../styles/globals.css';
import type { AppProps } from 'next/app';

import useIsRouting from '@/hooks/useIsRouting';
import Loading from '@/components/loading/loading';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const isRouting = useIsRouting();

  return (
    <QueryClientProvider client={queryClient}>
      {isRouting ? <Loading /> : <Component {...pageProps} />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
