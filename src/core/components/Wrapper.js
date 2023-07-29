import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {colors, tabBarStyle} from '@styleConst';

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  mainWrapper: {
    paddingBottom: 30,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});

const MainWrapper = props => {
  const [offset, setOffset] = useState(0);
  const [animValue] = useState(new Animated.Value(60));
  const translateY = useSharedValue(100);
  const [hide, setHide] = useState(false);

  const phoneTheme = useColorScheme();
  const duration = 150;

  const actionBarStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(translateY.value, {
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    };
  });

  if (props.scroll) {
    const animateTabBar = toValue => {
      if (hide && toValue >= 0) {
        return;
      }
      Animated.timing(animValue, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    };
    const hideTabBar = value => {
      setHide(true);
      animateTabBar(value);
      props.navigation.setOptions({
        tabBarStyle: [
          tabBarStyle.default,
          tabBarStyle[phoneTheme],
          {transform: [{translateY: animValue}]},
        ],
      });
    };
    const showTabBar = value => {
      setHide(false);
      animateTabBar(value);
      props.navigation.setOptions({
        tabBarStyle: [
          tabBarStyle.default,
          tabBarStyle[phoneTheme],
          {transform: [{translateY: animValue}]},
        ],
      });
    };
    const scrollHandler = event => {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      const minScrollToHide = Dimensions.get('screen').height * 0.15;

      const currentOffset = Math.floor(contentOffset.y);

      let direction = currentOffset > offset ? 'down' : 'up';
      const isAtBottom =
        layoutMeasurement.height + currentOffset >= contentSize.height - 20;
      if (direction === 'down' && currentOffset > minScrollToHide) {
        translateY.value = 0;
        hideTabBar(200);
      } else if (!isAtBottom && direction === 'up') {
        translateY.value = 200;
        showTabBar(0);
      }
      setOffset(currentOffset);
    };
    return (
      <Animated.View style={[styles.imageBackground]}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={[
            styles.mainWrapper,
            props.additionalContentContainerStyle,
          ]}
          style={[styles.linearGradient, props.additionalStyle]}
          scrollEventThrottle={300}
          nestedScrollEnabled={true}
          {...props}>
          {props.children}
        </Animated.ScrollView>
      </Animated.View>
    );
  } else {
    return (
      <View
        style={[
          styles.linearGradient,
          styles.mainWrapper,
          props.additionalContentContainerStyle,
        ]}
        {...props}>
        {props.children}
      </View>
    );
  }
};

const Wrapper = props => {
  const {scroll = false} = props.route.params;
  const phoneTheme = useColorScheme();
  return (
    <LinearGradient
      colors={colors.gradient.background[phoneTheme]}
      style={styles.linearGradient}>
      <ImageBackground
        source={require('../../../assets/backgroundTile.png')}
        resizeMode="repeat"
        style={styles.linearGradient}>
        <MainWrapper scroll={scroll} {...props} />
      </ImageBackground>
    </LinearGradient>
  );
};

export default Wrapper;
