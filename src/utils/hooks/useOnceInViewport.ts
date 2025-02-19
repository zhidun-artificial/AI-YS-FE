import React, { useEffect } from 'react';

const useOnceInViewport = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  useEffect(() => {
    let observer: IntersectionObserver | undefined = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer?.disconnect();
            observer = undefined;
          }
        });
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer?.disconnect();
    };
  }, [ref, callback]);
};

export default useOnceInViewport;
