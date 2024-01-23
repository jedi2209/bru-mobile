import React from 'react';
import {FlatList, Pressable} from 'react-native';
import PressetItem from './PressetItem';

const PressetList = ({style, data, setSelected, selected, type}) => {
  return (
    <FlatList
      style={style}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <Pressable onPress={() => setSelected(item)}>
          <PressetItem
            type={type}
            title={item.title}
            img={item.img}
            selected={selected.id === item.id}
          />
        </Pressable>
      )}
      keyExtractor={item => item.id}
    />
  );
};

export default PressetList;
