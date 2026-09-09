import { useEffect, useState } from 'react';

export const usePreloadAssets = (urls, timeout = 3000) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sources = [...new Set((urls || []).filter(Boolean))];

    if (sources.length === 0) {
      setProgress(1);
      setDone(true);
      return undefined;
    }

    let loaded = 0;
    const mark = () => {
      loaded += 1;
      if (!cancelled) setProgress(loaded / sources.length);
    };

    const load = Promise.all(
      sources.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              mark();
              resolve();
            };
            img.onerror = () => {
              mark();
              resolve();
            };
            img.src = src;
          })
      )
    );

    const cap = new Promise((resolve) => {
      window.setTimeout(resolve, timeout);
    });

    Promise.race([load, cap]).then(() => {
      if (cancelled) return;
      setProgress(1);
      setDone(true);
    });

    return () => {
      cancelled = true;
    };
  }, [urls, timeout]);

  return { progress, done };
};
