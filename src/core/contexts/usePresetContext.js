import {useContext} from 'react';
import {PresetContext} from './preset-context';

export const usePresetContext = () => {
  return useContext(PresetContext);
};
