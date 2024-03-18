import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../core/const/style';
import {TimerPickerModal} from 'react-native-timer-picker';
import {Switch} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import Wrapper from '../../core/components/Wrapper';
import dayjs from 'dayjs';
import ArrowIcon from '../../core/components/icons/ArrowIcon';
import PressetList from '../../core/components/PressetList/PressetList';
import {addTeaAlarmFx, updateTeaAlarmFx} from '../../core/store/teaAlarms';
import {$profileStore} from '../../core/store/profile';
import {$teaAlarmStrore, getTeaAlarmByIdFx} from '../../core/store/teaAlarm';
import BrewingData from '../../core/components/TeaAlarm/BrewingData';
import {useBrewingData} from '../../hooks/useBrewingData';
import {usePressetList} from '../../hooks/usePressetList';

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
    alignItems: 'center',
  },
  timeText: {
    color: colors.green.mid,
    fontSize: 30,
    marginTop: 10,
    lineHeight: 30,
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
    marginBottom: 50,
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

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [prepareBy, setPrepareBy] = useState({hours: '', minutes: ''});
  const {id} = route.params;
  const user = useStore($profileStore);
  const teaAlarm = useStore($teaAlarmStrore);

  const {selected, setSelected, pressets} = usePressetList();

  const {
    setBrewingTime,
    setIsCleaning,
    setWaterAmount,
    setTemperature,
    brewingTime,
    waterAmount,
    isCleaning,
    temperature,
  } = useBrewingData(selected);

  useEffect(() => {
    if (id) {
      getTeaAlarmByIdFx(id);
    }
  }, [id]);

  useEffect(() => {
    if (teaAlarm) {
      setPrepareBy(teaAlarm.prepare_by);
      setSelected(teaAlarm.presset);
    }
  }, [setPrepareBy, setSelected, teaAlarm]);

  return (
    <Wrapper route={route} navigation={navigation} {...props}>
      <Text style={[s.screenLabel, isDarkMode && s.darkText]}>Tea Alarm</Text>
      <View style={s.prepareWrapper}>
        <Text style={[s.subTitle, s.prepareText, isDarkMode && s.darkText]}>
          Start tea preparation at
        </Text>
        <TouchableOpacity
          onPress={() => setIsTimeModalOpen(true)}
          style={s.timeWrapper}>
          <Text
            style={[s.subTitle, s.timeText, isDarkMode && s.darkTime]}>{`${dayjs
            .duration(prepareBy.hours, 'hours')
            .format('HH')}:${dayjs
            .duration(prepareBy.minutes, 'minutes')
            .format('mm')}`}</Text>
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
            setPrepareBy({hours, minutes});
            setIsTimeModalOpen(false);
          }}
          setIsVisible={setIsTimeModalOpen}
          hourLabel="hours"
          minuteLabel="mins"
          initialHours={prepareBy.hours}
          initialMinutes={prepareBy.minutes}
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
          selected={selected}
          setSelected={setSelected}
          data={pressets}
        />
        <BrewingData
          disabled
          brewingTime={brewingTime}
          setBrewingTime={setBrewingTime}
          waterAmount={waterAmount}
          setWaterAmount={setWaterAmount}
          temperature={temperature}
          setTemperature={setTemperature}
        />
        {/* <View style={s.cleaning}>
          <Switch
            value={isCleaning}
            onChange={() => setIsCleaning(prev => !prev)}
            disabled
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
        </View> */}
        <View style={s.buttons}>
          {id ? (
            <TouchableOpacity style={[s.button, s.deleteButton]}>
              <Text style={s.buttonText}>Delete</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              if (id) {
                updateTeaAlarmFx({
                  id,
                  by: user.name,
                  prepare_by: prepareBy,
                  presset: selected,
                });
              } else {
                addTeaAlarmFx({
                  by: user.name,
                  prepare_by: prepareBy,
                  presset: selected,
                });
              }

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
