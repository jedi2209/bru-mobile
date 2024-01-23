import {View} from '@gluestack-ui/themed';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PenIcon from '../../../core/components/icons/PenIcon';
import {colors} from '../../../core/const/style';
import TrashIconOutlined from '../../../core/components/icons/TrashIconOutlined';
import {useStore} from 'effector-react';
import {$themeStore} from '../../../core/store/theme';

const s = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBlockColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  row: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 9,
    backgroundColor: colors.green.mid,
  },
  machineName: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  darkText: {
    color: colors.white,
  },
  version: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginRight: 17,
  },
  penIcon: {
    marginRight: 14,
  },
  divider: {},
});

const BruMachine = () => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  return (
    <View style={s.container}>
      <View style={s.row}>
        <View style={s.indicator} />
        <Text style={[s.machineName, isDarkMode && s.darkText]}>
          BRU In Kitchen
        </Text>
      </View>
      <View style={s.row}>
        <Text style={s.version}>Firmware 1.2.44</Text>
        <PenIcon
          fill={isDarkMode ? colors.white : colors.green.mid}
          width={24}
          height={24}
          style={s.penIcon}
        />
        <TrashIconOutlined
          fill={isDarkMode ? colors.white : colors.green.mid}
        />
      </View>
    </View>
  );
};

export default BruMachine;
