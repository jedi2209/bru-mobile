import React, {useMemo} from 'react';
import {FlatList, Pressable} from 'react-native';
import PressetItem from './PressetItem';

const PressetList = ({
  style,
  setSelected,
  selected,
  type,
  withInitData = false,
  data,
}) => {
  const memoizedPressets = useMemo(() => {
    if (withInitData) {
      return [
        ...data,
        {
          tea_type: 'New Presset',
          type,
          id: 'new_presset',
          tea_img: require('../../../../assets/teaImages/new_presset.png'),
        },
      ];
    }

    return data;
  }, [data, type, withInitData]);

  return (
    <FlatList
      style={style}
      data={memoizedPressets}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <Pressable
          onPress={() => {
            setSelected(item);
          }}>
          <PressetItem
            type={type}
            title={item?.tea_type}
            img={
              item?.tea_img ||
              require('../../../../assets/teaImages/emptyPressetImage.png')
            }
            selected={selected?.id === item.id}
          />
        </Pressable>
      )}
      keyExtractor={item => item.id}
    />
  );
};

export default PressetList;
