import {useStore} from 'effector-react';
import {useEffect, useState} from 'react';
import {$pressetsStore} from '../core/store/pressets';

export const usePressetList = () => {
  const [selected, setSelected] = useState(null);
  const pressets = useStore($pressetsStore);

  useEffect(() => {
    setSelected(pressets[0]);
  }, [pressets]);

  return {
    selected,
    setSelected,
    pressets,
  };
};
