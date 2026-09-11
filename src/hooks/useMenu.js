import { useEffect, useState } from 'react';
import { data } from '../constants';
import { fetchMenu } from '../lib/api/menu';

export const useMenu = () => {
  const [menu, setMenu] = useState({
    wines: data.wines,
    cocktails: data.cocktails,
  });
  const [source, setSource] = useState('local');

  useEffect(() => {
    let active = true;

    fetchMenu()
      .then((payload) => {
        if (!active) return;
        if (payload?.wines?.length || payload?.cocktails?.length) {
          setMenu({
            wines: payload.wines || [],
            cocktails: payload.cocktails || [],
          });
          setSource('api');
        }
      })
      .catch(() => {
        if (!active) return;
        setSource('local');
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...menu, source };
};
