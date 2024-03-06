import React, {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useCallback, useEffect, useRef, useState} from 'react';
import {basicStyles, colors} from '../../core/const/style';
import SplitCups from './components/SplitCups';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import {useNavigation} from '@react-navigation/native';
import {useStore} from 'effector-react';
import {$themeStore, initThemeFx} from '../../core/store/theme';
import {addPressetToStoreFx, getPressetsFx} from '../../core/store/pressets';
import isEqual from 'lodash.isequal';
import {
  $profileStore,
  getUserFx,
  updateProfileUser,
} from '../../core/store/profile';
import BrewingData from '../../core/components/TeaAlarm/BrewingData';
import {useBrewingData} from '../../hooks/useBrewingData';
import {usePressetList} from '../../hooks/usePressetList';
import {$teaAlarmsStrore, getTeaAlarmsFx} from '../../core/store/teaAlarms';
import {useFocusEffect} from '@react-navigation/native';
import {
  bufferToHex,
  deviceManager,
  getCommand,
  getStartCommand,
  sleep,
} from '../../utils/device.js';
import {updateUser} from '../../utils/db/auth.js';
import {$userStore} from '../../core/store/user.js';
import {useTranslation} from 'react-i18next';
import {$deviceSettingsStore} from '../../core/store/device';
import {get} from 'lodash';

const s = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 50,
  },
  list: {paddingLeft: 10, marginBottom: 30, paddingBottom: 10},
  innerContainer: {
    paddingHorizontal: 10,
  },

  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  brewButton: {
    ...basicStyles.backgroundButton,
    paddingHorizontal: 57,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonText: {
    ...basicStyles.backgroundButtonText,
  },
  dispenseButton: {
    backgroundColor: 'rgba(42, 42, 42, 0.40)',
    borderWidth: 1,
    borderColor: 'rgba(113, 136, 58, 1)',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 90,
    width: 170,
  },
  dispenseButtonLight: {
    backgroundColor: '#E6E7E8',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 90,
    borderColor: colors.green.mid,
  },
  teaAlarmWrapper: {marginTop: 30},
  listContainerStyle: {gap: 10},
});

const InstantBrewScreen = props => {
  const devices = useStore($deviceSettingsStore);
  const theme = useStore($themeStore);
  const [modal, setModal] = useState(null);
  const navigation = useNavigation();
  const teaAlarms = useStore($teaAlarmsStrore);
  const user = useStore($userStore);
  const {t} = useTranslation();
  const [animationButton] = useState(new Animated.Value(0));

  const onPressStartButton = useCallback(() => {
    Animated.timing(animationButton, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      animationButton.setValue(0);
    });
  }, [animationButton]);

  const backgroundColor = animationButton.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.green.mid, '#A7CA56'],
  });

  useFocusEffect(
    useCallback(() => {
      getPressetsFx();
      getUserFx();
      getTeaAlarmsFx();
      initThemeFx();
    }, []),
  );

  useEffect(() => {
    if (get(devices, 'length') === 1 && get(devices, '0.isCurrent', false)) {
      deviceManager.setCurrentDevice(devices[0]);
    }
  }, [devices]);

  useEffect(() => {
    async function defaultUserSettings() {
      updateProfileUser({units: 'metric'});
      await updateUser(user.uid, {units: 'metric'});
    }
    if (user?.uid) {
      defaultUserSettings();
    }
  }, [user]);

  const {selected, setSelected, pressets} = usePressetList();

  const startBrewing = async (temp = 0, time = 0, water = 0) => {
    const command = getStartCommand(0x40, [temp, time, water], 0x0f);
    console.log(command);
    console.log(bufferToHex(command));
    await deviceManager
      .writeValueAndNotify(command)
      .then(async () => {
        await sleep(2000);
      })
      .catch(err => {
        console.error('Start Brewing error', err);
      });
  };

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

  const openConfiramtionModal = time => {
    setModal({
      opened: true,
      withCancelButton: true,
      cancelButtonText: 'Later',
      modalTitle: 'Do you want to save this configutation as a new preset?',
      confirmationText: (
        <Text>
          You will be able to create new presets later in{' '}
          <Text style={{color: colors.green.mid}}>Presets</Text> page.
        </Text>
      ),
      confirmationButtonText: 'Save preset',
      withDontShowAgain: true,
      onConfirm: async () => {
        addPressetToStoreFx({
          brewing_data: {time: time, waterAmount, temperature},
          cleaning: isCleaning,
          tea_img: selected.tea_img,
          tea_type: selected.tea_type,
        });
        setModal(null);
        startBrewing(temperature, brewingTime.value, waterAmount);
      },
      closeModal: async () => {
        startBrewing(temperature, brewingTime.value, waterAmount);
        setModal(null);
      },
      dontShowAgainText: "Don't show me again",
    });
  };

  return (
    <Wrapper {...props}>
      {modal ? <ConfirmationModal {...modal} /> : null}
      <View style={s.container}>
        <PressetList
          style={s.list}
          selected={selected}
          setSelected={setSelected}
          data={pressets}
          withInitData
        />
        <View style={s.innerContainer}>
          <BrewingData
            waterAmount={waterAmount}
            setWaterAmount={setWaterAmount}
            brewingTime={brewingTime}
            setBrewingTime={setBrewingTime}
            temperature={temperature}
            setTemperature={setTemperature}
          />

          {/* <SplitCups cleaning={isCleaning} setCleaning={setIsCleaning} /> */}
          <View style={s.buttons}>
            <Pressable
              onPressIn={onPressStartButton}
              onLongPress={async () => {
                if (selected.id === 'new_presset') {
                  await addPressetToStoreFx({
                    brewing_data: {
                      time: brewingTime,
                      waterAmount,
                      temperature,
                    },
                    cleaning: isCleaning,
                    tea_img: '',
                    tea_type: selected.tea_type,
                  });

                  startBrewing(temperature, brewingTime.value, waterAmount);

                  return;
                }

                if (selected.id === 'instant_brew') {
                  const command = getCommand(0x40, [], 0x0f);
                  console.log(command);
                  console.log(bufferToHex(command));

                  await deviceManager
                    .writeValueAndNotify(command)
                    .then(async () => {
                      await sleep(2000);
                    })
                    .catch(err => {
                      console.error('Start Brewing error', err);
                    });
                  return;
                }

                const isChanged = !isEqual(selected, {
                  brewing_data: {time: brewingTime, waterAmount, temperature},
                  cleaning: isCleaning,
                  id: selected.id,
                  tea_img: selected.tea_img,
                  tea_type: selected.tea_type,
                });
                console.log(isChanged);
                if (isChanged) {
                  openConfiramtionModal(brewingTime);
                } else {
                  startBrewing(temperature, brewingTime.value, waterAmount);
                }
              }}
              delayLongPress={500}
              onPress={async () => {}}
              style={s.brewButton}>
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  right: 0,
                  backgroundColor,
                }}
              />
              <Text style={s.buttonText}>{t('InstantBrewing.BrewIt')}</Text>
            </Pressable>
            <TouchableOpacity
              onPress={async () => {
                const command = getCommand(0x42, [], 4, false);
                console.log(bufferToHex(command));
                await deviceManager
                  .writeValueAndNotify(command)
                  .then(async () => {
                    await sleep(2000);
                  })
                  .catch(err => {
                    console.error('Start Brewing error', err);
                  });
              }}
              style={
                theme === 'light' ? s.dispenseButtonLight : s.dispenseButton
              }>
              <Text
                style={[
                  s.buttonText,
                  theme === 'light' && {
                    color: colors.green.mid,
                  },
                ]}>
                {t('InstantBrewing.Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={s.teaAlarmWrapper}>
            <FlatList
              contentContainerStyle={s.listContainerStyle}
              data={teaAlarms || []}
              renderItem={({item}) => <TeaAlarmInfo {...item} />}
            />
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default InstantBrewScreen;
