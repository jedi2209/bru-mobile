import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {PresetContext} from './preset-context';
import {PresetApi} from '../../utils/db/pressets';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PresetContextProvider = ({children}) => {
  const [version, setVersion] = useState('');
  const [selected, setSelected] = useState(null);
  const [image, setImage] = useState(null);
  const [presets, setPresets] = useState([]);
  const [defaultPresets, setDefaultPresets] = useState([]);

  const handleSelect = useCallback(preset => {
    setSelected(preset);
  }, []);

  const handleChangeImage = useCallback(img => {
    setImage(img);
  }, []);

  const handleUpdatePreset = useCallback(
    async preset => {
      let imgUrl;
      if (image) {
        imgUrl = await PresetApi.uploadPresetImage(image, selected?.id);
      }
      const isDefaultPreset = !!defaultPresets.find(
        item => item.id === preset.id,
      );
      if (isDefaultPreset) {
        const newPreset = {
          ...preset,
          id: preset.id + '123',
        };
        if (imgUrl) {
          newPreset.tea_img = imgUrl;
        }
        const data = await PresetApi.addPreset(newPreset);
        if (data) {
          const deletedDefaults = JSON.parse(
            await AsyncStorage.getItem('deletedDefaults'),
          );
          const deletedArray = [...(deletedDefaults ?? []), preset.id];
          await AsyncStorage.setItem(
            'deletedDefaults',
            JSON.stringify(deletedArray),
          );
          setDefaultPresets(prev => prev.filter(item => item.id !== preset.id));
          setPresets(prev => [data, ...prev]);
        }
      } else {
        const newPreset = {
          ...preset,
        };
        if (imgUrl) {
          newPreset.tea_img = imgUrl;
        }
        const data = await PresetApi.updatePreset(newPreset);
        if (data) {
          setPresets(prev =>
            prev.map(item => (item.id === data.id ? data : item)),
          );
        }
      }
    },
    [defaultPresets, image, selected?.id],
  );

  const handleAddPreset = useCallback(
    async preset => {
      let imgUrl;
      if (image) {
        console.log(image, 'dasdasd');
        imgUrl = await PresetApi.uploadPresetImage(image, selected?.id);
        console.log(imgUrl, 'imgUrl');
      }
      const newPreset = {
        ...preset,
      };
      if (imgUrl) {
        newPreset.tea_img = imgUrl;
      }
      const data = await PresetApi.addPreset(newPreset);
      setPresets(prev => [data, ...prev]);
    },
    [image, selected?.id],
  );

  const handleDeletePreset = useCallback(
    async id => {
      const isDefaultPreset = !!defaultPresets.find(item => item.id === id);
      if (isDefaultPreset) {
        const deletedDefaults = JSON.parse(
          await AsyncStorage.getItem('deletedDefaults'),
        );
        const deletedArray = [...(deletedDefaults ?? []), id];
        await AsyncStorage.setItem(
          'deletedDefaults',
          JSON.stringify(deletedArray),
        );
        setDefaultPresets(prev => prev.filter(item => item.id !== id));
      } else {
        await PresetApi.deletePreset(id);
        setPresets(prev => prev.filter(item => item.id !== id));
      }
    },
    [defaultPresets],
  );

  const handleGetPreset = useCallback(async () => {
    const data = await PresetApi.getUserPresets();
    if (data) {
      setPresets(data?.presets ?? []);
      setDefaultPresets(data?.defaultPresets ?? []);
    }
  }, []);

  const handleSetVersion = useCallback(value => {
    setVersion(value);
  }, []);

  useEffect(() => {
    handleGetPreset();
  }, [handleGetPreset]);

  const contextValues = useMemo(() => {
    return {
      image,
      version,
      presets: [...presets, ...defaultPresets],
      selected,
      setImage: handleChangeImage,
      setSelected: handleSelect,
      handleAddPreset,
      handleGetPreset,
      handleSetVersion,
      handleUpdatePreset,
      handleDeletePreset,
    };
  }, [
    image,
    version,
    presets,
    defaultPresets,
    selected,
    handleChangeImage,
    handleSelect,
    handleAddPreset,
    handleGetPreset,
    handleSetVersion,
    handleUpdatePreset,
    handleDeletePreset,
  ]);

  return (
    <PresetContext.Provider value={contextValues}>
      {children}
    </PresetContext.Provider>
  );
};

export default PresetContextProvider;
