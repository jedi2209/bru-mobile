export function scaleValue(minValue, maxValue, value, maxHeight) {
  if (value === 0) {
    return 0;
  }
  const range = maxValue - minValue;
  const scaledHeight = ((value - minValue) / range) * (maxHeight - 1);
  const clampedHeight = Math.max(1, Math.min(maxHeight, scaledHeight));
  return clampedHeight;
}
