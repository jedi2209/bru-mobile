import {createContext} from 'react';

const initialValue = {
  image: null,
  presets: [],
  selected: null,
  setImage: () => {},
  setSelected: () => {},
  handleAddPreset: () => {},
  handleGetPreset: () => {},
  handleDeletePreset: () => {},
  handleUpdatePreset: () => {},
};

export const PresetContext = createContext(initialValue);
