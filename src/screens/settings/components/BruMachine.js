import {View} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PenIcon from '../../../core/components/icons/PenIcon';
import {colors} from '../../../core/const/style';
import TrashIconOutlined from '../../../core/components/icons/TrashIconOutlined';
import {useStore} from 'effector-react';
import {$themeStore} from '../../../core/store/theme';
import {getFirmwareData} from '../../../utils/firmware';
import {deviceManager} from '../../../utils/device.js';
import {clearDeviceStorage} from '../../../core/store/device.js';
import {get} from 'lodash';
import useBle from '../../../hooks/useBlePlx';

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

const BruMachine = ({item}) => {
  const theme = useStore($themeStore);
  const [firmware, setFirmware] = useState('');
  const isDarkMode = theme === 'dark';
  const {disconnectFromDevice} = useBle();

  useEffect(() => {
    async function fetch() {
      const data = await getFirmwareData();
      setFirmware(
        data.find(firmwareData => firmwareData.testAvailable).description.en,
      );
    }
    fetch();
  }, []);

  return (
    <View style={s.container}>
      <View style={s.row}>
        <View style={s.indicator} />
        <Text style={[s.machineName, isDarkMode && s.darkText]}>
          {item.name}
        </Text>
      </View>
      <View style={s.row}>
        <TouchableOpacity onPress={() => {}}>
          <PenIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            width={24}
            height={24}
            style={s.penIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Are you sure?',
              'After unpair device you should pair it again.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Unpair',
                  style: 'destructive',
                  onPress: async () => {
                    await disconnectFromDevice();
                  },
                },
              ],
            );
          }}>
          <TrashIconOutlined
            fill={isDarkMode ? colors.white : colors.green.mid}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BruMachine;
