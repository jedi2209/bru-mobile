import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {basicStyles, colors, fonts} from '../const/style';
import TeaAlarmIcon from './icons/TeaAlarmIcon';
import PenIcon from './icons/PenIcon';
import TrashIcon from './icons/TrashIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {useStore} from 'effector-react';
import {$themeStore} from '../store/theme';
import {deleteTeaAlarmFx} from '../store/teaAlarms';
import PlayIcon from './icons/PlayIcon';

import {useTranslation} from 'react-i18next';
import {$langSettingsStore} from '../store/lang';
import useBle from '../../hooks/useBlePlx';
import {setTeaAlarmCommand} from '../../utils/commands';

const s = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green.mid,
    backgroundColor: 'rgba(239, 239, 239, 0.90)',
    display: 'flex',
    flexDirection: 'row',
  },
  darkContainer: {
    backgroundColor: 'rgba(62, 62, 62, 0.90)',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(35, 31, 32, 0.11)',
  },
  iconContainer: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(35, 31, 32, 0.11)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teaAlarmText: {
    color: colors.gray.grayDarkText,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    letterSpacing: 0.4,
  },
  teaInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  teaInfoText: {
    color: colors.gray.grayDarkText,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    letterSpacing: 0.4,
    fontFamily: fonts.defaultMenuFamily,
  },
  by: {marginRight: 16},
  icons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
});

const TeaAlarmInfo = ({id, prepare_by, by, presset}) => {
  const theme = useStore($themeStore);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const lang = useStore($langSettingsStore);
  const {writeValueWithResponse} = useBle();

  return (
    <View style={[s.container, theme === 'dark' && s.darkContainer]}>
      <View style={[s.iconContainer]}>
        <TeaAlarmIcon
          width={24}
          heigth={24}
          stroke={
            theme === 'dark'
              ? colors.gray.grayLightText
              : colors.gray.grayDarkText
          }
          color={'green'}
        />
      </View>
      <View style={s.infoContainer}>
        <View>
          <Text
            style={[
              s.teaAlarmText,
              theme === 'dark' && basicStyles.darkText,
              lang === 'de_US' && {fontSize: 12.5},
            ]}>
            {t('TeaAlarm.TeaAlarmSet')}{' '}
            {`${dayjs.duration(prepare_by.hours, 'hours').format('HH')}:${dayjs
              .duration(prepare_by.minutes, 'minutes')
              .format('mm')}`}
          </Text>
          <View style={s.teaInfo}>
            <Text
              style={[
                s.teaInfoText,
                s.by,
                theme === 'dark' && basicStyles.darkText,
              ]}>
              {t('TeaAlarm.By')} {by}
            </Text>
            <Text
              style={[s.teaInfoText, theme === 'dark' && basicStyles.darkText]}>
              {presset?.tea_type}
            </Text>
          </View>
        </View>
        <View style={s.icons}>
          <TouchableOpacity
            onPress={async () => {
              const {temperature, time, waterAmount} = presset.brewing_data;
              const command = setTeaAlarmCommand(
                [temperature, time.value, waterAmount],
                0x0f,
                prepare_by.hours,
                prepare_by.minutes,
              );
              await writeValueWithResponse(command);
            }}>
            <PlayIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewTeaAlarm', {id})}>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <PenIcon style={{marginHorizontal: lang === 'de_US' ? 10 : 16}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteTeaAlarmFx(id);
            }}>
            <TrashIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TeaAlarmInfo;
