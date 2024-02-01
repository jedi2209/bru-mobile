import {useStore} from 'effector-react';
import React, {useRef} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';
import {$profileStore} from '../../store/profile';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;

const s = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
  },
  indicatorHolder: {
    position: 'absolute',
    alignSelf: 'center',
    pointerEvents: 'none',
  },
  indicator: {
    width: 120,
    height: 2,
    backgroundColor: '#ccc',
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const WaterAmountPicker = ({setValue}) => {
  const {units} = useStore($profileStore);
  const values = [
    '',
    {label: units === 'metric' ? '150ml' : '5oz', value: 150},
    {label: units === 'metric' ? '200ml' : '7oz', value: 200},
    {label: units === 'metric' ? '250ml' : '8oz', value: 250},
    {label: units === 'metric' ? '300ml' : '10oz', value: 300},
    {label: units === 'metric' ? '350ml' : '12oz', value: 350},
    {label: units === 'metric' ? '400ml' : '13oz', value: 400},
    {label: units === 'metric' ? '450ml' : '15oz', value: 450},
    {label: units === 'metric' ? '500ml' : '17oz', value: 500},
    '',
  ];

  const momentumScrollEnd = event => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT) + 1;
    setValue(values[index]?.value);
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const renderItem = ({item, index}) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({inputRange, outputRange: [0.8, 1, 0.8]});

    return (
      <Animated.View
        style={[
          {height: ITEM_HEIGHT, transform: [{scale}]},
          s.animatedContainer,
        ]}>
        <Text style={s.pickerItem}>{item.label}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={s.container}>
      <Animated.FlatList
        snapToInterval={ITEM_HEIGHT}
        data={values}
        bounces={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onScrollEndDrag={momentumScrollEnd}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      <View style={[s.indicatorHolder, {top: ITEM_HEIGHT}]}>
        <View style={[s.indicator]} />
        <View style={[s.indicator, {marginTop: ITEM_HEIGHT}]} />
      </View>
    </View>
  );
};

export default WaterAmountPicker;
