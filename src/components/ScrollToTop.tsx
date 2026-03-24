import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToHash } from '../lib/hashScroll';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const targetId = decodeURIComponent(hash.replace('#', ''));
    let retries = 0;
    const maxRetries = 12;

    const scrollToHashTarget = () => {
      if (scrollToHash(`#${targetId}`)) {
        return;
      }

      if (retries < maxRetries) {
        retries += 1;
        window.setTimeout(scrollToHashTarget, 100);
      }
    };

    scrollToHashTarget();
  }, [pathname, hash]);

  return null;
}
