import React, {useMemo} from 'react';
import {FlatList, Pressable} from 'react-native';
import PressetItem from './PressetItem';
import {useTranslation} from 'react-i18next';

const PressetList = ({
  style,
  defaultBrew,
  setSelected,
  selected,
  presets,
  type,
  withInitData = false,
}) => {
  const {t} = useTranslation();

  const memoizedPressets = useMemo(() => {
    if (withInitData) {
      return [
        {
          ...defaultBrew,
        },
        ...presets,
        {
          brewing_data: {
            time: {label: '3m', seconds: 180, value: 17},
            temperature: 9,
            waterAmount: 4,
          },
          cleaning: false,
          id: 'new_presset',
          tea_img:
            'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fnew_presset.png?alt=media&token=882598be-67ae-4eea-aac7-54736a3dd5ef',
          tea_type: t('Presets.NewPreset'),
        },
      ];
    }

    return presets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets, withInitData]);

  return (
    <FlatList
      style={style}
      data={memoizedPressets}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <Pressable
            onPress={() => {
              setSelected(item);
            }}>
            <PressetItem
              type={type}
              title={item?.tea_type}
              img={item?.tea_img}
              selected={selected?.id === item?.id}
              isLast={memoizedPressets.length - 1 === index}
            />
          </Pressable>
        );
      }}
      keyExtractor={item => item?.id}
    />
  );
};

export default PressetList;
