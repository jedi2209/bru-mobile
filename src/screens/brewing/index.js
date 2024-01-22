import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Wrapper from '../../core/components/Wrapper';
import CircularProgress from 'react-native-circular-progress-indicator';
import {basicStyles, colors} from '../../core/const/style';
import dayjs from 'dayjs';
import CupIcon from '../../core/components/icons/CupIcon';

const s = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 52,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height - 280,
  },
  progress: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 40,
  },
  progressDots: {...basicStyles.row, gap: 42},
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.green.mid,
    borderRadius: 100,
  },
  cancelButton: {
    ...basicStyles.backgroundButton,
    backgroundColor: colors.red,
    marginBottom: 18,
    maxWidth: 164,
  },
  warningText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
});

const BrewingScreen = props => {
  const progressRef = useRef(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const time = 11;
  const [counter, setCounter] = useState(time);
  const phoneTheme = useColorScheme();
  const isDarkMode = phoneTheme === 'dark';
  useEffect(() => {
    progressRef.current.play();
    setTimerInterval(
      setInterval(() => {
        setCounter(prev => prev - 1);
      }, 1000),
    );
  }, [time]);

  useEffect(() => {
    if (counter === 0) {
      clearInterval(timerInterval);
      progressRef.current.pause();
    }
  }, [counter, timerInterval]);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <View style={s.part}>
        <View style={s.progress}>
          <CircularProgress
            initialValue={time - 1}
            value={counter - 1}
            radius={135.5}
            maxValue={time - 1}
            ref={progressRef}
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            valueSuffix={dayjs.duration(counter, 'seconds').format('MM:ss')}
            //   valueSuffix={<CupIcon />}
            valueSuffixStyle={{
              color: colors.green.mid,
              backgroundColor: isDarkMode
                ? colors.gray.grayDarkText
                : '#EFF0F1',
              paddingVertical: 70,
              paddingHorizontal: 40,
              borderRadius: 95,
              overflow: 'hidden',
              fontSize: 42,
              fontWeight: '400',
              display: 'flex',
            }}
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
        <Text style={[s.brewing, isDarkMode && s.darkModeText]}>Brewing</Text>
        <View style={s.progressDots}>
          <View style={s.activeDot} />
          <View style={s.activeDot} />
          <View style={s.activeDot} />
        </View>
      </View>
      <View style={s.part}>
        <TouchableOpacity
          onPress={() => {
            clearInterval(timerInterval);
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
