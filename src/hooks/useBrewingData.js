import {useCallback, useEffect, useState} from 'react';

export const useBrewingData = selected => {
  const [brewingTime, setBrewingTime] = useState({
    label: '',
    value: 0,
    seconds: 0,
  });
  const [waterAmount, setWaterAmount] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const setSelectedState = useCallback(() => {
    setBrewingTime(selected.brewing_data.time);
    setWaterAmount(selected.brewing_data.waterAmount);
    setTemperature(selected.brewing_data.temperature);
    setIsCleaning(selected.cleaning);
  }, [selected]);

  const resetSelectedState = () => {
    setBrewingTime({label: '', value: 0, seconds: 0});
    setWaterAmount(0);
    setTemperature(0);
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
    temperature,
    setTemperature,
  };
};
