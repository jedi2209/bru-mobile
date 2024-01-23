import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {colors, tabBarStyle} from '../const/style';
import {useStore} from 'effector-react';
import {$themeStore} from '../store/theme';

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
});

const MainWrapper = props => {
  const [offset, setOffset] = useState(0);
  const [animValue] = useState(new Animated.Value(60));
  const translateY = useSharedValue(100);
  const [hide, setHide] = useState(false);
  const theme = useStore($themeStore);
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
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    };
    const hideTabBar = value => {
      setHide(true);
      animateTabBar(value);
      props.navigation.setOptions({
        tabBarStyle: [
          tabBarStyle.default,
          tabBarStyle[theme],
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
          tabBarStyle[theme],
          {transform: [{translateY: animValue}]},
        ],
      });
    };
    const scrollHandler = event => {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      const minScrollToHide = Dimensions.get('screen').height * 0.15;

      const currentOffset = Math.floor(contentOffset.y) + 100;

      let direction = currentOffset > offset ? 'down' : 'up';
      const isAtBottom =
        layoutMeasurement.height + currentOffset >= contentSize.height + 100;
      if (direction === 'down' && currentOffset > minScrollToHide) {
        translateY.value = 0;
        hideTabBar(100);
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
          scrollEventThrottle={50}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
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

  const theme = useStore($themeStore);
  return (
    <LinearGradient
      colors={colors.gradient.background[theme]}
      style={styles.linearGradient}>
      {/* <ImageBackground
        source={require('@assets/backgroundTile.jpg')}
        resizeMode="repeat"
        style={styles.linearGradient}>
        <MainWrapper scroll={scroll} {...props} />
      </ImageBackground> */}
      <MainWrapper scroll={scroll} {...props} />
    </LinearGradient>
  );
};

export default Wrapper;
