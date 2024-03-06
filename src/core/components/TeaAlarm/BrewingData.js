import React, {useState} from 'react';
import dayjs from 'dayjs';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../const/style';
import TeaAlarmIcon from '../icons/TeaAlarmIcon';
import TemperatureIcon from '../icons/TemperatureIcon';
import WaterIcon from '../icons/WaterIcon';
import TeaAlarmInfoItem from './BrewingDataItem';
import WaterAmountModal from '../WaterAmountModal';
import {useStore} from 'effector-react';
import {$profileStore} from '../../store/profile';
import TemperaturePicker from '../TemperaturePicker';
import TimePickerModal from '../TimePicker.js';
import {
  temperaturePickerData,
  timePickerData,
  waterPickerData,
} from '../../const/index.js';
import {useTranslation} from 'react-i18next';

const s = StyleSheet.create({
  pressetIcon: {marginBottom: 7},
  pressetInfo: {
    backgroundColor: colors.green.mid,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  pressetInfoScreen: {
    backgroundColor: 'transparent',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(35, 31, 32, 0.11)',
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.4,
    alignSelf: 'flex-start',
  },
  timeModalButtonsContainer: {
    width: 200,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    color: colors.green.mid,
    borderWidth: 0,
    margin: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: 40,
  },
  confirmButton: {
    color: colors.green.mid,
    borderWidth: 0,
    margin: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const BrewingData = ({
  type,
  brewingTime = {label: '', value: 0},
  setBrewingTime = () => {},
  waterAmount = 0,
  setWaterAmount = () => {},
  temperature = 0,
  setTemperature = () => {},
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [temperatureIsOpened, setTemperatureIsOpened] = useState(false);
  const [waterAmountIsOpen, setWaterAmountIsOpen] = useState(false);
  const {units} = useStore($profileStore);
  const {t} = useTranslation();

  return (
    <View style={[s.pressetInfo, type === 'pressets' && s.pressetInfoScreen]}>
      <TouchableOpacity disabled={disabled} onPress={() => setIsOpen(!isOpen)}>
        <TeaAlarmInfoItem
          type={type}
          Icon={
            <TeaAlarmIcon
              stroke={type === 'pressets' ? 'black' : colors.white}
              style={s.pressetIcon}
              color={type === 'pressets' ? 'green' : 'yellow'}
              width={24}
              height={24}
            />
          }
          title={t('BrewingData.BrewingTime')}
          value={
            timePickerData(units).find(item => item.value === brewingTime.value)
              ?.label || '0m 10s'
          }
        />
      </TouchableOpacity>
      <TimePickerModal
        opened={isOpen}
        closeModal={() => setIsOpen(false)}
        setTime={setBrewingTime}
      />
      <View style={s.divider} />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setTemperatureIsOpened(prev => !prev)}>
        <TeaAlarmInfoItem
          type={type}
          Icon={
            <TemperatureIcon
              style={s.pressetIcon}
              color={type === 'pressets' ? 'green' : 'yellow'}
              fill={type === 'pressets' ? 'black' : colors.white}
            />
          }
          title={t('BrewingData.WaterTemperature')}
          value={
            temperaturePickerData(units).find(
              item => item.value === temperature,
            )?.label || 'Cold'
          }
        />
      </TouchableOpacity>
      <TemperaturePicker
        closeModal={() => {
          setTemperatureIsOpened(false);
        }}
        setTemperature={setTemperature}
        opened={temperatureIsOpened}
      />

      <View style={s.divider} />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setWaterAmountIsOpen(true)}>
        <TeaAlarmInfoItem
          type={type}
          Icon={
            <WaterIcon
              style={s.pressetIcon}
              color={type === 'pressets' ? 'green' : 'yellow'}
              fill={type === 'pressets' ? 'black' : colors.white}
            />
          }
          title={t('BrewingData.WaterAmount')}
          value={
            waterPickerData(units).find(item => item.value === waterAmount)
              ?.label || 0
          }
        />
      </TouchableOpacity>
      <WaterAmountModal
        closeModal={() => {
          setWaterAmountIsOpen(false);
        }}
        waterAmount={waterAmount}
        setWaterAmount={setWaterAmount}
        opened={waterAmountIsOpen}
      />
    </View>
  );
};

export default BrewingData;
