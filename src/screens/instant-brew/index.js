import React, {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useCallback, useEffect, useState} from 'react';
import {basicStyles, colors} from '../../core/const/style';
// import SplitCups from './components/SplitCups';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import {useStore} from 'effector-react';
import {$themeStore, initThemeFx} from '../../core/store/theme';
import {addPressetToStoreFx, getPressetsFx} from '../../core/store/pressets';
import isEqual from 'lodash.isequal';
import {
  // $profileStore,
  getUserFx,
  updateProfileUser,
} from '../../core/store/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BrewingData from '../../core/components/TeaAlarm/BrewingData';
import {useBrewingData} from '../../hooks/useBrewingData';
import {usePressetList} from '../../hooks/usePressetList';
import {$teaAlarmsStrore, getTeaAlarmsFx} from '../../core/store/teaAlarms';
import {useFocusEffect} from '@react-navigation/native';
import {updateUser} from '../../utils/db/auth.js';
import {$userStore} from '../../core/store/user.js';
import {useTranslation} from 'react-i18next';
import {getCommand, getStartCommand} from '../../utils/commands';
import useBle from '../../hooks/useBlePlx';
import {$connectedDevice, initDevice} from '../../core/store/connectedDevice';

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
  animatedButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    borderRadius: 90,
  },
});

const InstantBrewScreen = props => {
  const theme = useStore($themeStore);
  const [modal, setModal] = useState(null);
  const teaAlarms = useStore($teaAlarmsStrore);
  const user = useStore($userStore);
  const {t} = useTranslation();
  const [animationButton] = useState(new Animated.Value(0));
  const [animationCancelButton] = useState(new Animated.Value(0));
  const {writeValueWithResponse} = useBle();
  const currentDevice = useStore($connectedDevice);

  const onPressStartButton = useCallback(() => {
    Animated.timing(animationButton, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      animationButton.setValue(0);
    });
  }, [animationButton]);

  const onPressCancelButton = useCallback(() => {
    Animated.timing(animationCancelButton, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      animationCancelButton.setValue(0);
    });
  }, [animationCancelButton]);

  const backgroundColor = animationButton.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.green.mid, '#A7CA56'],
  });

  const cancelBackgroundColor = animationCancelButton.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(42, 42, 42, 0.40)', '#fc2323'],
  });

  useFocusEffect(
    useCallback(() => {
      async function init() {
        await getUserFx();
        getPressetsFx();
        getTeaAlarmsFx();
        initThemeFx();
        await initDevice();
      }
      init();
    }, []),
  );

  useEffect(() => {
    async function getDevice() {
      const device = await AsyncStorage.getItem('previos');
      if (!device) {
        openIsConnectedModal();
      }
    }
    getDevice();
    // setTimeout(() => {
    //   if (!currentDevice) {
    //     openIsConnectedModal();
    //   } else {
    //     setModal(null);
    //   }
    // }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    writeValueWithResponse(command);
  };

  const {
    setBrewingTime,
    // setIsCleaning,
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
      cancelButtonText: t('InstantBrewing.Later'),
      modalTitle: t('InstantBrewing.ConfirmationModalTitle'),
      confirmationText: (
        <Text>
          {t('InstantBrewing.YouWillBeAble')}{' '}
          <Text style={{color: colors.green.mid}}>{t('Presets.Title')}</Text>{' '}
          {t('InstantBrewing.page')}.
        </Text>
      ),
      confirmationButtonText: t('Presets.SavePreset'),
      withDontShowAgain: true,
      onConfirm: async () => {
        addPressetToStoreFx({
          brewing_data: {time: time, waterAmount, temperature},
          cleaning: isCleaning,
          tea_img: selected.tea_img,
          tea_type: selected.tea_type,
        });
        setModal(null);
      },
      closeModal: async () => {
        startBrewing(temperature, brewingTime.value, waterAmount);
        setModal(null);
      },
      dontShowAgainText: t('InstantBrewing.DontShowAgain'),
    });
  };

  const openIsConnectedModal = () => {
    setModal({
      opened: true,
      withCancelButton: true,
      cancelButtonText: t('InstantBrewing.No'),
      modalTitle: t('InstantBrewing.NoDeviceTitle'),
      confirmationText: <Text>{t('InstantBrewing.NoDeviceDesc')} </Text>,
      confirmationButtonText: t('InstantBrewing.Yes'),
      withDontShowAgain: true,
      onConfirm: async () => {
        props.navigation.navigate('AddNewDeviceScreen');
        setModal(null);
      },
      closeModal: async () => {
        setModal(null);
      },
      dontShowAgainText: t('InstantBrewing.DontShowAgain'),
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
                Vibration.vibrate(100);
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

                  await writeValueWithResponse(command);
                  return;
                }

                const isChanged = !isEqual(selected, {
                  brewing_data: {time: brewingTime, waterAmount, temperature},
                  cleaning: isCleaning,
                  id: selected.id,
                  tea_img: selected.tea_img,
                  tea_type: selected.tea_type,
                });

                if (isChanged) {
                  openConfiramtionModal(brewingTime);
                } else {
                  startBrewing(temperature, brewingTime.value, waterAmount);
                }
                Vibration.vibrate(100);
              }}
              delayLongPress={500}
              style={s.brewButton}>
              <Animated.View
                style={[
                  s.animatedButton,
                  {
                    backgroundColor,
                  },
                ]}
              />
              <Text style={s.buttonText}>{t('InstantBrewing.BrewIt')}</Text>
            </Pressable>
            <Pressable
              delayLongPress={500}
              onLongPress={async () => {
                Vibration.vibrate(100);
                const command = getCommand(0x42, [], 4, false);
                await writeValueWithResponse(command);
              }}
              onPressIn={onPressCancelButton}
              style={s.dispenseButton}>
              <Animated.View
                style={[
                  s.animatedButton,
                  {backgroundColor: cancelBackgroundColor},
                ]}
              />
              <Text
                style={[
                  s.buttonText,
                  theme === 'light' && {
                    color: colors.white,
                  },
                ]}>
                {t('InstantBrewing.Cancel')}
              </Text>
            </Pressable>
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
