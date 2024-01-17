import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import Wrapper from '../../core/components/Wrapper';
import {colors} from '../../core/const/style';
import {useSelector} from 'react-redux';
import {selectTeaAlarms} from '../../store/modules/teaAlarm/selectors';
import {useNavigation} from '@react-navigation/native';

const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  screenLabel: {
    color: colors.gray.grayDarkText,
    fontWeight: '600',
    fontSize: 24,
    letterSpacing: 0.4,
    lineHeight: 24,
    marginTop: 30,
    textAlign: 'center',
    marginBottom: 23,
  },
  darkScreenLabel: {
    color: '#DADADA',
  },
  addButton: {
    backgroundColor: colors.green.mid,
    paddingVertical: 15,
    borderRadius: 90,
    marginBottom: 30,
  },
  addButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainerStyle: {gap: 10},
});

const TeaAlarmScreen = (props, {navigation}) => {
  // const progressRef = useRef(null);
  const phoneTheme = useColorScheme();
  const teaAlarms = useSelector(selectTeaAlarms);
  const navigate = useNavigation();
  return (
    <Wrapper style={s.wrapper} {...props}>
      <View>
        {/* <CircularProgress
          title={'%'}
          value={97}
          radius={120}
          ref={progressRef}
          inActiveStrokeOpacity={0.5}
          activeStrokeWidth={20}
          inActiveStrokeWidth={20}
          progressValueStyle={{fontWeight: '100', color: 'white'}}
          activeStrokeSecondaryColor="yellow"
          inActiveStrokeColor="white"
          duration={30000}
          dashedStrokeConfig={{
            count: 50,
            width: 4,
          }}
          progressFormatter={value => {
            'worklet';
            if (value <= 30) {
              return 0;
            }
            if (value > 30 && value <= 60) {
              return 30;
            }
            if (value > 60 && value <= 90) {
              return 60;
            }
            if (value > 90) {
              return 90;
            }
          }}
          onAnimationComplete={() => {}}
        /> */}
      </View>
      <View>
        <Text
          style={[s.screenLabel, phoneTheme === 'dark' && s.darkScreenLabel]}>
          Tea Alarm
        </Text>
        <TouchableOpacity
          onPress={() => navigate.navigate('NewTeaAlarm')}
          style={s.addButton}>
          <Text style={s.addButtonText}>Set new alarm</Text>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={s.listContainerStyle}
          data={teaAlarms}
          renderItem={({item}) => <TeaAlarmInfo {...item} />}
        />
      </View>
    </Wrapper>
  );
};

export default TeaAlarmScreen;
