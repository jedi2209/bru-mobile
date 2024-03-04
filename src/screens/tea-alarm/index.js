import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import Wrapper from '../../core/components/Wrapper';
import {colors} from '../../core/const/style';
import {useNavigation} from '@react-navigation/native';
import {useStore} from 'effector-react';
import {$teaAlarmsStrore, getTeaAlarmsFx} from '../../core/store/teaAlarms';
import {$themeStore} from '../../core/store/theme';
import {useTranslation} from 'react-i18next';

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

const TeaAlarmScreen = props => {
  const theme = useStore($themeStore);
  const navigate = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    getTeaAlarmsFx();
  }, []);

  const teaAlarms = useStore($teaAlarmsStrore);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <View>
        <Text style={[s.screenLabel, theme === 'dark' && s.darkScreenLabel]}>
          {t('TeaAlarm.Title')}
        </Text>
        <TouchableOpacity
          onPress={() => navigate.navigate('NewTeaAlarm')}
          style={s.addButton}>
          <Text style={s.addButtonText}>{t('TeaAlarm.NewTeaAlarm')}</Text>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={s.listContainerStyle}
          data={teaAlarms || []}
          renderItem={({item}) => <TeaAlarmInfo {...item} />}
        />
      </View>
    </Wrapper>
  );
};

export default TeaAlarmScreen;
