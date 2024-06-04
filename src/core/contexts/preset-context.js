import {createContext} from 'react';

const initialValue = {
  image: null,
  version: '',
  presets: [],
  selected: null,
  setImage: () => {},
  setSelected: () => {},
  handleAddPreset: () => {},
  handleGetPreset: () => {},
  handleSetVersion: () => {},
  handleDeletePreset: () => {},
  handleUpdatePreset: () => {},
};

export const PresetContext = createContext(initialValue);
