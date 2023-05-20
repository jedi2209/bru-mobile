import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {colors, tabBarStyle} from '@const';

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

  const duration = 150;

  const actionBarStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(translateY.value, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  if (props.scroll) {
    const animateTabBar = toValue => {
      Animated.timing(animValue, {
        toValue,
        duration,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    };

    const hideTabBar = () => {
      animateTabBar(100);
      props.navigation.setOptions({
        tabBarStyle: [tabBarStyle, {transform: [{translateY: animValue}]}],
      });
    };
    const showTabBar = () => {
      animateTabBar(0);
      props.navigation.setOptions({
        tabBarStyle: [tabBarStyle, {transform: [{translateY: animValue}]}],
      });
    };

    const scrollHandler = e => {
      const scrollLag = 10;
      const minScrollToHide = 100;
      const currentOffset = Math.floor(e.nativeEvent.contentOffset.y);
      let direction = currentOffset + scrollLag > offset ? 'down' : 'up';
      if (direction === 'down' && currentOffset > minScrollToHide) {
        hideTabBar();
        translateY.value = 30;
      } else {
        translateY.value = 100;
        showTabBar();
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
          scrollEventThrottle={12}
          {...props}>
          {props.children}
        </Animated.ScrollView>
      </Animated.View>
    );
  } else {
    return (
      <View style={[styles.linearGradient, styles.mainWrapper]} {...props}>
        {props.children}
      </View>
    );
  }
};

const Wrapper = props => {
  const {scroll = false} = props.route.params;
  return (
    <LinearGradient
      colors={colors.gradient.background}
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
