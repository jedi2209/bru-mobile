import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../core/const/style';
import {TimerPickerModal} from 'react-native-timer-picker';
import {Switch} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {$pressetsStore, getPressetsFx} from '../../core/store/pressets';
import Wrapper from '../../core/components/Wrapper';
import dayjs from 'dayjs';
import ArrowIcon from '../../core/components/icons/ArrowIcon';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarm from '../../core/components/TeaAlarm/TeaAlarmInfo';
import {addTeaAlarmFx, updateTeaAlarmFx} from '../../core/store/teaAlarm';
import {$profileStore} from '../../core/store/profile';
import {getTeaAlarmById} from '../../utils/db/teaAlarms';

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
    marginBottom: 50,
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
  const [prepareBy, setPrepareBy] = useState({hours: '0', minutes: '0'});
  const [brewingTime, setBrewingTime] = useState({minutes: '0', seconds: '0'});
  const [waterAmount, setWaterAmount] = useState(0);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const {id} = route.params;
  const pressets = useStore($pressetsStore);
  const user = useStore($profileStore);

  useEffect(() => {
    getPressetsFx();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const teaAlarm = await getTeaAlarmById(id);
      setPrepareBy(teaAlarm.prepare_by);
      setSelected(teaAlarm.collection.presset);
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    setSelected(pressets[0]);
  }, [pressets]);

  useEffect(() => {
    if (selected) {
      const selectedBrewingTime = {
        minutes: `${dayjs
          .duration(selected.brewing_data.time, 'seconds')
          .format('mm')}`,
        seconds: `${dayjs
          .duration(selected.brewing_data.time, 'seconds')
          .format('ss')}`,
      };
      setBrewingTime(selectedBrewingTime);
      setWaterAmount(selected.brewing_data.waterAmount);
      setIsCleaning(selected.cleaning);
    } else {
      setBrewingTime({minutes: '0', seconds: '0'});
      setWaterAmount(0);
      setIsCleaning(false);
    }
  }, [selected]);

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
            .duration(prepareBy.hours, 'hours')
            .format('HH[h]')} ${dayjs
            .duration(prepareBy.minutes, 'minutes')
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
          data={pressets}
          selected={selected}
          setSelected={setSelected}
        />
        <TeaAlarm
          disabled
          brewingTime={brewingTime}
          setBrewingTime={setBrewingTime}
          waterAmount={waterAmount}
          setWaterAmount={setWaterAmount}
        />
        <View style={s.cleaning}>
          <Switch
            value={isCleaning}
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
        </View>
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
