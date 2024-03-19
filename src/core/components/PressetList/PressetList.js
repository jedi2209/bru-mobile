import React, {useMemo} from 'react';
import {FlatList, Pressable} from 'react-native';
import PressetItem from './PressetItem';
import {usePressetList} from '../../../hooks/usePressetList';

const PressetList = ({
  style,
  setSelected,
  selected,
  type,
  withInitData = false,
}) => {
  const {pressets} = usePressetList();
  const memoizedPressets = useMemo(() => {
    if (withInitData) {
      return [
        {
          brewing_data: {
            time: {label: '0m 10s', value: 0, seconds: 10},
            waterAmount: 0,
          },
          cleaning: false,
          id: 'instant_brew',
          tea_img:
            'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Finstant_brew.png?alt=media&token=43651269-9801-46f7-aa29-7fcd4ee24541',
          tea_type: 'Instant Brew',
        },
        ...pressets,
        {
          brewing_data: {
            time: 0,
            waterAmount: 0,
          },
          cleaning: false,
          id: 'new_presset',
          tea_img:
            'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fnew_presset.png?alt=media&token=882598be-67ae-4eea-aac7-54736a3dd5ef',
          tea_type: 'New Presset',
        },
      ];
    }

    return pressets;
  }, [pressets, withInitData]);

  return (
    <FlatList
      style={style}
      data={memoizedPressets}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => {
        return (
          <Pressable
            onPress={() => {
              setSelected(item);
            }}>
            <PressetItem
              type={type}
              title={item?.tea_type}
              img={item?.tea_img}
              selected={selected?.id === item.id}
            />
          </Pressable>
        );
      }}
      keyExtractor={item => item.id}
    />
  );
};

export default PressetList;
