import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const defaultOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '1px',
  threshold: 0.1,
};

const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>(
  isFetching?: boolean,
  fetchNextData?: () => void,
  option?: IntersectionObserverInit
) => {
  const [targetEl, setTargeEl] = useState<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (targetEl) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('intersecting...');
            flushSync(() => setIsIntersecting(true));
          }
        });
        setIsIntersecting(false);
      }, option || defaultOptions);

      observer.observe(targetEl);
    }

    return () => observer?.disconnect();
  }, [targetEl, option]);

  useEffect(() => {
    if (isFetching) {
      return;
    }
    if (isIntersecting && fetchNextData) {
      console.log(`let's fetch next data`);
      fetchNextData();
    }
  }, [isIntersecting, isFetching, fetchNextData]);

  return { setTargeEl };
};

export default useInfiniteScroll;
