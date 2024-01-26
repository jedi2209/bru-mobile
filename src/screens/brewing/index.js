import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '../../core/components/Wrapper';
import CircularProgress from 'react-native-circular-progress-indicator';
import {basicStyles, colors} from '../../core/const/style';
import dayjs from 'dayjs';
import CupIcon from '../../core/components/icons/CupIcon';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {$brewingTimeStore, setTime} from '../../core/store/brewingTime';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const s = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
    // justifyContent: 'space-between',
    height: Dimensions.get('window').height - 280,
  },
  progress: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 52,
  },
  part: {
    display: 'flex',
    alignItems: 'center',
  },
  darkModeText: {
    color: colors.gray.grayLightText,
  },
  brewing: {
    color: colors.gray.grayDarkText,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 57,
  },
  progressDots: {...basicStyles.row, gap: 42},
  unactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: '#9D9D9D',
  },
  activeDot: {
    backgroundColor: colors.green.mid,
  },
  cancelButton: {
    ...basicStyles.backgroundButton,
    backgroundColor: colors.red,
    marginBottom: 18,
    maxWidth: 164,
    marginTop: 40,
  },
  warningText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  valueSuffixStyle: {
    color: colors.green.mid,
    backgroundColor: '#EFF0F1',
    paddingVertical: 70,
    paddingHorizontal: 40,
    borderRadius: 95,
    overflow: 'hidden',
    fontSize: 42,
    fontWeight: '400',
    display: 'flex',
  },
  valueSuffixStyleDark: {backgroundColor: colors.gray.grayDarkText},
  valueSuffixStyleLastPhase: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  cupStyle: {
    color: colors.green.mid,
    backgroundColor: '#EFF0F1',
    borderRadius: 100,
    paddingVertical: 45,
    paddingHorizontal: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const BrewingScreen = props => {
  const progressRef = useRef(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const time = useStore($brewingTimeStore);
  const navigation = useNavigation();
  const [counter, setCounter] = useState(time);
  const [phase, setPhase] = useState(2);
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setCounter(time);
    return () => {
      setCounter(0);
    };
  }, [time]);

  useFocusEffect(
    useCallback(() => {
      progressRef.current.play();
      setTimerInterval(
        setInterval(() => {
          setCounter(prev => prev - 1);
        }, 1000),
      );
      return () => {
        setTime(0);
        setPhase(2);
        clearInterval(timerInterval);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (counter === 0) {
      clearInterval(timerInterval);
      progressRef.current.reAnimate();
      progressRef.current.pause();
      setPhase(3);
    }
  }, [counter, timerInterval]);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <View style={s.part}>
        <View style={s.progress}>
          <CircularProgress
            initialValue={phase === 3 ? phase : counter - 1}
            value={phase === 3 ? phase + 1 : counter - 1}
            radius={135.5}
            maxValue={phase === 3 ? phase : time - 1}
            ref={progressRef}
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            valueSuffix={
              phase === 3 ? (
                <View
                  style={[s.cupStyle, isDarkMode && s.valueSuffixStyleDark]}>
                  <CupIcon />
                </View>
              ) : (
                <View>
                  <Text
                    style={[
                      s.valueSuffixStyle,
                      isDarkMode && s.valueSuffixStyleDark,
                    ]}>
                    {dayjs.duration(counter, 'seconds').format('mm:ss')}
                  </Text>
                </View>
              )
            }
            valueSuffixStyle={[
              phase === 3 && s.valueSuffixStyleLastPhase,
              {display: 'flex'},
            ]}
            progressValueStyle={{
              display: 'none',
            }}
            activeStrokeColor={colors.green.mid}
            inActiveStrokeColor="#B0B0B0"
            duration={1000}
            dashedStrokeConfig={{
              count: 100,
              width: 2,
            }}
            progressFormatter={value => {
              'worklet';
              return value.toFixed(1);
            }}
          />
        </View>
        <Text style={[s.brewing, isDarkMode && s.darkModeText]}>
          {phase === 3 ? 'Filling up cup' : 'Brewing'}
        </Text>
        <View style={s.progressDots}>
          <View style={[s.unactiveDot, phase >= 1 && s.activeDot]} />
          <View style={[s.unactiveDot, phase >= 2 && s.activeDot]} />
          <View style={[s.unactiveDot, phase === 3 && s.activeDot]} />
        </View>
      </View>
      <View style={s.part}>
        <TouchableOpacity
          onPress={() => {
            clearInterval(timerInterval);
            navigation.navigate('Instant Brew');
          }}
          style={s.cancelButton}>
          <Text style={basicStyles.backgroundButtonText}>Cancel brewing</Text>
        </TouchableOpacity>
        <Text style={s.warningText}>
          Notice that Cold water diffusion does not work when the brew is
          splitted into several cups.
        </Text>
      </View>
    </Wrapper>
  );
};

export default BrewingScreen;
