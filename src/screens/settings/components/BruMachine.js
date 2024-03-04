import {View} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PenIcon from '../../../core/components/icons/PenIcon';
import {colors} from '../../../core/const/style';
import TrashIconOutlined from '../../../core/components/icons/TrashIconOutlined';
import {useStore} from 'effector-react';
import {$themeStore} from '../../../core/store/theme';
import {getFirmwareData} from '../../../utils/firmware';
import {deviceManager, getCommand} from '../../../utils/device.js';
import {resetDevice} from '../../../core/store/device.js';
import {get} from 'lodash';

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

const _onPressUnpair = async () => {
  await deviceManager
    .removeBond()
    .then(res => {
      resetDevice();
      console.info('onPress Unpair device', res);
    })
    .catch(err => {
      console.error('onPress Unpair device', err);
    });
};

const BruMachine = ({item}) => {
  const theme = useStore($themeStore);
  const [firmware, setFirmware] = useState('');
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    async function fetch() {
      const data = await getFirmwareData();
      setFirmware(data[0].description.en);
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
        <Text style={s.version}>{firmware.split(' ')[3]}</Text>
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
                  onPress: () =>
                    _onPressUnpair(get(deviceManager, 'device.id', null)),
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
