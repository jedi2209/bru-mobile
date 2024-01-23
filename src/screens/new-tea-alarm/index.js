import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../core/const/style';
import {TimerPickerModal} from 'react-native-timer-picker';
import Wrapper from '../../core/components/Wrapper';
import dayjs from 'dayjs';
import ArrowIcon from '../../core/components/icons/ArrowIcon';
import {mockedData} from '../instant-brew';

import {Switch} from '@gluestack-ui/themed';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarm from '../../core/components/TeaAlarm/TeaAlarmInfo';
import {addTeaAlarm} from '../../core/store/teaAlarm';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';

const s = StyleSheet.create({
  screenLabel: {
    color: colors.gray.grayDarkText,
    fontWeight: '600',
    fontSize: 24,
    letterSpacing: 0.4,
    lineHeight: 24,
    marginTop: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  darkText: {
    color: colors.gray.lightGray,
  },
  prepareWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.grayLightText,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  prepareText: {
    color: colors.gray.grayDarkText,
  },
  timeWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  timeText: {
    color: colors.green.mid,
  },
  darkTime: {
    color: colors.white,
  },
  arrowIcon: {
    transform: [{rotate: '180deg'}],
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
  timeModalTitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.4,
    alignSelf: 'flex-start',
  },
  confirmButton: {
    color: colors.green.mid,
    borderWidth: 0,
    margin: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  timeModalButtonsContainer: {
    width: 200,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  selectPresset: {
    color: colors.gray.grayDarkText,
    marginBottom: 16,
  },
  list: {
    marginBottom: 20,
  },
  cleaning: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  cleaningText: {
    color: colors.gray.lightGray,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    lineHeight: 22,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 90,
    width: '45%',
  },
  saveButton: {
    backgroundColor: colors.green.mid,
  },
  deleteButton: {
    backgroundColor: '#AF1F23',
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const NewTeaAlarmScreen = ({route, navigation, ...props}) => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const [time, setTime] = useState({hours: '0', minutes: '0'});
  const [brewingTime, setBrewingTime] = useState({minutes: '0', seconds: '0'});
  const [waterAmount, setWaterAmount] = useState(0);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(10);
  const [cleaning, setCleaning] = useState(false);
  const {id} = route.params;

  return (
    <Wrapper route={route} navigation={navigation} {...props}>
      <Text style={[s.screenLabel, isDarkMode && s.darkText]}>Tea Alarm</Text>
      <View style={s.prepareWrapper}>
        <Text style={[s.subTitle, s.prepareText, isDarkMode && s.darkText]}>
          Prepare tea by
        </Text>
        <TouchableOpacity
          onPress={() => setIsTimeModalOpen(true)}
          style={s.timeWrapper}>
          <Text
            style={[s.subTitle, s.timeText, isDarkMode && s.darkTime]}>{`${dayjs
            .duration(time.hours, 'hours')
            .format('HH[h]')} ${dayjs
            .duration(time.minutes, 'minutes')
            .format('mm[m]')}`}</Text>
          <ArrowIcon
            style={[
              isTimeModalOpen ? {} : s.arrowIcon,
              isDarkMode && s.darkTime,
            ]}
          />
        </TouchableOpacity>
        <TimerPickerModal
          hideSeconds
          closeOnOverlayPress
          styles={{
            modalTitle: s.timeModalTitle,
            contentContainer: {width: 269},
            cancelButton: s.cancelButton,
            confirmButton: s.confirmButton,
            buttonContainer: s.timeModalButtonsContainer,
            pickerLabelContainer: {width: 50},
            pickerItemContainer: {width: 150},
            pickerLabel: {
              fontSize: 15,
              fontWeight: '400',
            },
          }}
          onConfirm={value => {
            const {hours, minutes} = value;
            setTime({hours, minutes});
            setIsTimeModalOpen(false);
          }}
          setIsVisible={setIsTimeModalOpen}
          hourLabel="hours"
          minuteLabel="mins"
          initialHours={time.hours}
          initialMinutes={time.minutes}
          visible={isTimeModalOpen}
          confirmButtonText="Done"
          modalTitle="Prepare tea by"
        />
      </View>
      <View style={s.innerContainer}>
        <Text style={[s.subTitle, s.selectPresset, isDarkMode && s.darkText]}>
          Select preset
        </Text>
        <PressetList
          style={s.list}
          data={mockedData}
          selected={selectedItem}
          setSelected={setSelectedItem}
        />
        <TeaAlarm
          brewingTime={brewingTime}
          setBrewingTime={setBrewingTime}
          waterAmount={waterAmount}
          setWaterAmount={setWaterAmount}
        />
        <View style={s.cleaning}>
          <Switch
            value={cleaning}
            onChange={() => {
              setCleaning(prev => !prev);
            }}
            sx={{
              _light: {
                props: {
                  trackColor: {
                    true: '#34C759',
                    false: 'rgba(120, 120, 128, 0.36)',
                  },
                },
              },
              _dark: {
                props: {
                  trackColor: {
                    false: 'rgba(120, 120, 128, 0.32)',
                    true: '#34C759',
                  },
                },
              },
            }}
          />
          <Text
            style={[
              s.cleaningText,
              theme === 'light' && {color: colors.gray.grayDarkText},
            ]}>
            Cleaning
          </Text>
        </View>
        <View style={s.buttons}>
          {id ? (
            <TouchableOpacity style={[s.button, s.deleteButton]}>
              <Text style={s.buttonText}>Delete</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              addTeaAlarm({
                id: new Date().getDate(),
                time: {hours: time.hours, minutes: time.minutes},
                by: 'Me',
                teaType: selectedItem.title,
                brewingData: {
                  time: brewingTime,
                  temperature: '90',
                  waterAmount: waterAmount,
                },
                cleaning,
              });
              navigation.navigate('TeaAlarm');
            }}
            style={[s.button, s.saveButton]}>
            <Text style={s.buttonText}>Save tea alarm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View />
    </Wrapper>
  );
};

export default NewTeaAlarmScreen;
