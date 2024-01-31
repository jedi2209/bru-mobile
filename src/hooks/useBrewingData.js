import dayjs from 'dayjs';
import {useCallback, useEffect, useState} from 'react';

export const useBrewingData = selected => {
  const [brewingTime, setBrewingTime] = useState({minutes: '0', seconds: '0'});
  const [waterAmount, setWaterAmount] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

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
    isCleaning,
    setIsCleaning,
  };
};
