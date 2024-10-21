import {useStore} from 'effector-react';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {$themeStore, setThemeFx} from '../../../core/store/theme';
// import Collapsible from 'react-native-collapsible';
import {basicStyles, colors} from '../../../core/const/style';
// import {Switch} from '@gluestack-ui/themed';
// import {setUser} from '../../../core/store/user';
// import {logout} from '../../../utils/auth';
// import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const s = StyleSheet.create({
  wrapper: {marginBottom: 50},
  darkTextMain: {
    color: colors.white,
  },
  logoutText: {
    color: '#f54c4c',
  },
  filterStatus: {
    ...basicStyles.rowBetween,
    paddingVertical: 16,
  },
  bottomBorder: {
    borderBottomColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  subTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  filterHealth: {color: colors.green.mid, lineHeight: 16},
  unitTitle: {
    color: colors.gray.grayDarkText,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 10,
  },
  units: {
    ...basicStyles.row,
  },
  unit: {
    backgroundColor: '#C5C5C8',
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  darkUnit: {
    backgroundColor: '#555558',
  },
  unitText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  unitLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  unitRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selected: {
    backgroundColor: colors.green.mid,
  },
  autoRinse: {
    ...basicStyles.rowBetween,
    paddingBottom: 16,
  },
  filterNotification: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorial: {
    color: colors.green.mid,
    textDecorationLine: 'underline',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorialDark: {
    color: '#FFF',
  },
  autoRinseWrapper: {
    paddingTop: 16,
    paddingBottom: 11,
  },
});

const CommonSettings = () => {
  const theme = useStore($themeStore);

  const isDarkMode = theme === 'dark';
  const {t} = useTranslation();

  return (
    <View style={s.wrapper}>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>
          {t('Settings.AppColorTheme')}
        </Text>
        <View style={s.units}>
          <TouchableOpacity
            onPress={() => setThemeFx('dark')}
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitLeft,
              isDarkMode && s.selected,
            ]}>
            <Text style={s.unitText}>{t('Settings.Dark')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setThemeFx('light')}
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitRight,
              !isDarkMode && s.selected,
            ]}>
            <Text style={s.unitText}>{t('Settings.Light')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CommonSettings;
