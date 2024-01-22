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
    color: colors.gray.lightGray,
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
  const phoneTheme = useColorScheme();
  const teaAlarms = useSelector(selectTeaAlarms);
  const navigate = useNavigation();
  return (
    <Wrapper style={s.wrapper} {...props}>
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
