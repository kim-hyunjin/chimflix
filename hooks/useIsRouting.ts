import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const useIsRouting = () => {
  const [isRouting, setIsRouting] = useState(true);
  const router = useRouter();

  const handleRouteComplete = useCallback(() => {
    setIsRouting(false);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteComplete);
    };
  }, [router, handleRouteComplete]);

  return isRouting;
};

export default useIsRouting;
