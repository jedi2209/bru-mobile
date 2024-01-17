import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import PressetInfoItem from './PressetInfoItem';
import TeaAlarmIcon from '../../../../core/components/icons/TeaAlarmIcon';
import TemperatureIcon from '../../../../core/components/icons/TemperatureIcon';
import WaterIcon from '../../../../core/components/icons/WaterIcon';
import {colors} from '../../../../core/const/style';
import {TimerPickerModal} from 'react-native-timer-picker';
import dayjs from 'dayjs';
import WaterAmountModal from '../WaterAmountModal';

const s = StyleSheet.create({
  pressetIcon: {marginBottom: 7},
  pressetInfo: {
    backgroundColor: colors.green.mid,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
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

const PressetInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [waterAmountIsOpen, setWaterAmountIsOpen] = useState(false);
  const [waterAmount, setWaterAmount] = useState(0);
  const [time, setTime] = useState({minutes: '0', seconds: '0'});

  return (
    <View style={s.pressetInfo}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <PressetInfoItem
          Icon={
            <TeaAlarmIcon
              style={s.pressetIcon}
              color="yellow"
              width={24}
              height={24}
            />
          }
          title="Brewing time"
          value={`${dayjs
            .duration(time.minutes, 'minutes')
            .format('mm')}:${dayjs
            .duration(time.seconds, 'seconds')
            .format('ss')}`}
        />
      </TouchableOpacity>
      <TimerPickerModal
        modalTitle="Brewing time"
        styles={{
          modalTitle: s.timeModalTitle,
          contentContainer: {width: 269},
          cancelButton: s.cancelButton,
          confirmButton: s.confirmButton,
          buttonContainer: s.timeModalButtonsContainer,
        }}
        confirmButtonText="Done"
        initialMinutes={time.minutes}
        initialSeconds={time.seconds}
        hideHours
        minuteLabel={''}
        secondLabel={''}
        onConfirm={value => {
          console.log(value);
          const {minutes, seconds} = value;
          setTime({minutes, seconds});
          setIsOpen(false);
        }}
        setIsVisible={setIsOpen}
        visible={isOpen}
      />
      <View style={s.divider} />
      <PressetInfoItem
        Icon={<TemperatureIcon style={s.pressetIcon} color="yellow" />}
        title="Water temperature"
        value="90°"
      />

      <View style={s.divider} />
      <TouchableOpacity onPress={() => setWaterAmountIsOpen(true)}>
        <PressetInfoItem
          Icon={<WaterIcon style={s.pressetIcon} color="yellow" />}
          title="Water amount"
          value={`${waterAmount}ml`}
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

export default PressetInfo;
