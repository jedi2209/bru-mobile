import dayjs from 'dayjs';
import {useStore} from 'effector-react';
import {useCallback, useEffect, useState} from 'react';
import {$pressetsStore} from '../core/store/pressets';

export const useBrewingData = () => {
  const [brewingTime, setBrewingTime] = useState({minutes: '0', seconds: '0'});
  const [waterAmount, setWaterAmount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const pressets = useStore($pressetsStore);

  useEffect(() => {
    setSelected(pressets[0]);
  }, [pressets]);

  const setSelectedState = useCallback(() => {
    const selectedBrewingTime = {
      minutes: `${dayjs
        .duration(selected.brewing_data.time, 'seconds')
        .format('mm')}`,
      seconds: `${dayjs
        .duration(selected.brewing_data.time, 'seconds')
        .format('ss')}`,
    };
    setBrewingTime(selectedBrewingTime);
    setWaterAmount(selected.brewing_data.waterAmount);
    setIsCleaning(selected.cleaning);
  }, [selected]);

  const resetSelectedState = () => {
    setBrewingTime({minutes: '0', seconds: '0'});
    setWaterAmount(0);
    setIsCleaning(false);
  };

  useEffect(() => {
    if (selected) {
      setSelectedState();
    } else {
      resetSelectedState();
    }
  }, [selected, setSelectedState]);

  return {
    brewingTime,
    setBrewingTime,
    waterAmount,
    setWaterAmount,
    selected,
    setSelected,
    isCleaning,
    setIsCleaning,
    pressets,
  };
};
