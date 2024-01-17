import React from 'react';
import {FlatList, Pressable} from 'react-native';
import PressetItem from './PressetItem';

const PressetList = ({style, data, setSelected, selected}) => {
  return (
    <FlatList
      style={style}
      data={data}
      horizontal
      renderItem={({item}) => (
        <Pressable onPress={() => setSelected(item.id)}>
          <PressetItem
            title={item.title}
            img={item.img}
            selected={selected === item.id}
          />
        </Pressable>
      )}
      keyExtractor={item => item.id}
    />
  );
};

export default PressetList;
