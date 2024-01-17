import React from 'react';
import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {colors, fonts} from '../../../core/const/style';
import TeaAlarmIcon from '../../../core/components/icons/TeaAlarmIcon';
import PenIcon from '../../../core/components/icons/PenIcon';
import TrashIcon from '../../../core/components/icons/TrashIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';

const s = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green.mid,
    backgroundColor: 'rgba(239, 239, 239, 0.90)',
    marginTop: 30,
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
    marginRight: 16,
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
  darkText: {
    color: colors.gray.grayLightText,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
  },
  penIcon: {
    marginRight: 16,
  },
});

const TeaAlarmInfo = () => {
  const phoneTheme = useColorScheme();

  return (
    <View style={[s.container, phoneTheme === 'dark' && s.darkContainer]}>
      <View style={s.iconContainer}>
        <TeaAlarmIcon
          width={24}
          heigth={24}
          stroke={
            phoneTheme === 'dark'
              ? colors.gray.grayLightText
              : colors.gray.grayDarkText
          }
          color={'green'}
        />
      </View>
      <View style={s.infoContainer}>
        <View>
          <Text style={[s.teaAlarmText, phoneTheme === 'dark' && s.darkText]}>
            Tea alarm set for 7:30 AM
          </Text>
          <View style={s.teaInfo}>
            <Text
              style={[
                s.teaInfoText,
                {marginRight: 16},
                phoneTheme === 'dark' && s.darkText,
              ]}>
              by John Denver
            </Text>
            <Text style={[s.teaInfoText, phoneTheme === 'dark' && s.darkText]}>
              Black Tea #1
            </Text>
          </View>
        </View>
        <View style={s.icons}>
          <TouchableOpacity>
            <PenIcon style={s.penIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <TrashIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TeaAlarmInfo;
