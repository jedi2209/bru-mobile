export const convertTemperature = value => {
  return Math.round(value * 1.8 + 32);
};

export const convertWaterAmount = value => {
  return Math.round(value * 0.0338);
};
