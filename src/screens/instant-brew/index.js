import React, {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import {
  addPressetToStoreFx,
  deletePressetFx,
  getPressetsFx,
  updatePressetFx,
} from '../../core/store/pressets';
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
import {initDevice} from '../../core/store/connectedDevice';
import LinearGradient from 'react-native-linear-gradient';
import TrashIconOutlined from '../../core/components/icons/TrashIconOutlined';
import PenIcon from '../../core/components/icons/PenIcon';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadPressetImage} from '../../utils/db/pressets';
import {$langSettingsStore} from '../../core/store/lang';
import {$currentFirmwareStore} from '../../core/store/firmware';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
    backgroundColor: 'rgba(42, 42, 42, 0.40)',
    paddingVertical: 15,
    borderRadius: 90,
    paddingHorizontal: 57,
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'rgba(113, 136, 58, 1)',
    borderWidth: 1,
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
  pressetInfo: {
    marginHorizontal: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  pressetInfoHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  teaName: {
    lineHeight: 24,
    letterSpacing: 0.4,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  teaNameInput: {
    lineHeight: 24,
    letterSpacing: 0.4,
    fontWeight: '600',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
    borderBottomColor: colors.green.mid,
    borderBottomWidth: 2,
    paddingBottom: 2,
    marginBottom: 6,
    color: colors.black,
  },
  teaImage: {marginBottom: 10, width: 74, height: 68, borderRadius: 100},
  saveButton: {
    backgroundColor: colors.green.mid,
    paddingVertical: 15,
    borderRadius: 90,
    width: 164,
    alignSelf: 'center',
  },
  saveButtonDe: {
    width: 185,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: colors.red,
    paddingHorizontal: 57,
    paddingVertical: 15,
    borderRadius: 90,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    lineHeight: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  buttonTextDe: {fontSize: 10, letterSpacing: 0},
});

const InstantBrewScreen = props => {
  const theme = useStore($themeStore);
  const [modal, setModal] = useState(null);
  const teaAlarms = useStore($teaAlarmsStrore);
  const user = useStore($userStore);
  const currLang = useStore($langSettingsStore);
  const {t} = useTranslation();
  const [animationButton] = useState(new Animated.Value(0));
  const [animationCancelButton] = useState(new Animated.Value(0));
  const {writeValueWithResponse} = useBle();
  const [mode, setMode] = useState('view');
  const [newTeaName, setNewTeaName] = useState('');
  const [image, setImage] = useState(null);
  const {selected, setSelected, pressets} = usePressetList();
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
  const [fadeAnim] = useState(new Animated.Value(1));
  const [moveView] = useState(new Animated.ValueXY({x: 0, y: 0}));
  const [isAnimated, setIsAnimated] = useState(false);
  const startBrewing = async (temp = 0, time = 0, water = 0) => {
    const command = getStartCommand(0x40, [temp, time, water], 0x0f);
    writeValueWithResponse(command);
  };

  const isDarkMode = theme === 'dark';

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
    outputRange: ['rgba(42, 42, 42, 0.40)', colors.green.mid],
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

  useEffect(() => {
    if (selected?.id === 'new_presset') {
      setMode('create');
      setNewTeaName('Tea name');
    } else {
      setMode('view');
    }
  }, [selected?.id]);

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
      // withDontShowAgain: true,
      onConfirm: async () => {
        addPressetToStoreFx({
          brewing_data: {time: time, waterAmount, temperature},
          cleaning: isCleaning,
          tea_img: selected.tea_img,
          tea_type: selected.tea_type,
          created_at: date.getTime(),
        });
        setModal(null);
      },
      closeModal: async () => {
        startBrewing(temperature, brewingTime.value, waterAmount);
        setModal(null);
      },
      // dontShowAgainText: t('InstantBrewing.DontShowAgain'),
    });
  };
  const date = new Date();

  const openIsConnectedModal = () => {
    setModal({
      opened: true,
      withCancelButton: true,
      cancelButtonText: t('InstantBrewing.No'),
      modalTitle: t('InstantBrewing.NoDeviceTitle'),
      confirmationText: <Text>{t('InstantBrewing.NoDeviceDesc')} </Text>,
      confirmationButtonText: t('InstantBrewing.Yes'),
      // withDontShowAgain: true,
      onConfirm: async () => {
        props.navigation.navigate('AddNewDeviceScreen');
        setModal(null);
      },
      closeModal: async () => {
        setModal(null);
      },
      // dontShowAgainText: t('InstantBrewing.DontShowAgain'),
    });
  };

  useEffect(() => {
    if (selected?.id === 'instant_brew') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(),
        Animated.timing(moveView, {
          toValue: {
            x: 0,
            y: -150,
          },
          duration: 300,
          useNativeDriver: true,
        }).start(),
      ]);
      setIsAnimated(true);
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(),
        Animated.timing(moveView, {
          toValue: {
            x: 0,
            y: 0,
          },
          duration: 300,
          useNativeDriver: true,
        }).start(),
      ]);
      setIsAnimated(false);
    }
  }, [fadeAnim, moveView, selected]);
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
        <AnimatedLinearGradient
          colors={
            isDarkMode
              ? colors.gradient.pressetInfo.dark
              : colors.gradient.pressetInfo.light
          }
          locations={[0, 0.01, 1]}
          style={[s.pressetInfo, {opacity: fadeAnim}]}>
          <View style={s.pressetInfoHeader}>
            {mode === 'view' && (
              <TouchableOpacity
                disabled={!selected}
                onPress={() =>
                  setModal({
                    opened: true,
                    withCancelButton: true,
                    cancelButtonText: t('InstantBrewing.No'),
                    modalTitle: 'Attention!',
                    confirmationText: (
                      <Text>
                        {t('InstantBrewing.DoYouReallyWant')}{' '}
                        <Text style={s.modalPressetName}>
                          {selected?.tea_type}
                        </Text>
                        ?
                      </Text>
                    ),
                    confirmationButtonText: t('InstantBrewing.YesDelete'),
                    onConfirm: async () => {
                      deletePressetFx(selected.id);
                      setModal(null);
                      setSelected(null);
                    },
                    closeModal: () => setModal(null),
                  })
                }>
                <TrashIconOutlined width={24} height={24} fill="#B0B0B0" />
              </TouchableOpacity>
            )}
            {mode !== 'view' ? (
              <TextInput
                value={newTeaName}
                onChangeText={text => {
                  setNewTeaName(text);
                }}
                style={s.teaNameInput}
              />
            ) : (
              <Text style={s.teaName}>{selected?.tea_type}</Text>
            )}
            {mode === 'view' && (
              <TouchableOpacity
                disabled={!selected}
                onPress={() => {
                  setMode('edit');
                  setNewTeaName(selected.tea_type);
                }}>
                <PenIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
          {mode !== 'view' ? (
            <TouchableOpacity
              onPress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                })
                  .then(pickedImage => {
                    setImage(pickedImage.sourceURL);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}>
              <Image
                resizeMode="cover"
                style={s.teaImage}
                source={
                  selected.id === 'new_presset'
                    ? image
                      ? {
                          uri: image ? image : selected.tea_img,
                        }
                      : require('../../../assets/teaImages/emptyPressetImage.png')
                    : selected?.tea_img || image
                    ? {
                        uri: image ? image : selected.tea_img,
                      }
                    : require('../../../assets/teaImages/emptyPressetImage.png')
                }
              />
            </TouchableOpacity>
          ) : (
            <Image
              resizeMode="cover"
              style={s.teaImage}
              source={
                selected?.tea_img
                  ? {
                      uri: selected?.tea_img,
                    }
                  : require('../../../assets/teaImages/emptyPressetImage.png')
              }
            />
          )}
        </AnimatedLinearGradient>
        <Animated.View
          style={[s.innerContainer, {transform: [{translateY: moveView.y}]}]}>
          <BrewingData
            isAnimated={isAnimated}
            waterAmount={waterAmount}
            setWaterAmount={setWaterAmount}
            brewingTime={brewingTime}
            setBrewingTime={setBrewingTime}
            temperature={temperature}
            setTemperature={setTemperature}
          />

          {/* <SplitCups cleaning={isCleaning} setCleaning={setIsCleaning} /> */}

          {mode !== 'view' ? (
            <View style={s.buttonContainer}>
              <TouchableOpacity
                onPress={async () => {
                  let imgUrl;
                  if (image) {
                    imgUrl = await uploadPressetImage(image, selected.id);
                  }

                  if (mode === 'create') {
                    addPressetToStoreFx({
                      tea_type: newTeaName,
                      tea_img: imgUrl ? imgUrl : '',
                      brewing_data: {
                        time: brewingTime,
                        waterAmount,
                        temperature,
                      },
                      cleaning: isCleaning,
                      created_at: date.getTime(),
                    });
                  } else if (mode === 'edit') {
                    updatePressetFx({
                      id: selected.id,
                      tea_type: newTeaName,
                      tea_img: imgUrl ? imgUrl : selected.tea_img,
                      brewing_data: {
                        time: brewingTime,
                        waterAmount,
                        temperature,
                      },
                      cleaning: isCleaning,
                    });
                  }
                  setMode('view');
                  setNewTeaName('');
                  setImage('');
                }}
                style={[s.saveButton, currLang === 'de' && s.saveButtonDe]}>
                <Text
                  style={[
                    s.editButtonText,
                    currLang === 'de' && s.buttonTextDe,
                  ]}>
                  {t('Presets.SavePreset')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMode('view');
                  setNewTeaName('');
                  getPressetsFx();
                }}
                style={s.cancelButton}>
                <Text style={s.buttonText}>{t('Presets.Cancel')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {mode === 'view' ? (
            <View style={s.buttons}>
              <Pressable
                onPressIn={onPressStartButton}
                onPressOut={() => animationButton.stopAnimation()}
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
                      created_at: date.getTime(),
                    });

                    startBrewing(temperature, brewingTime.value, waterAmount);

                    return;
                  }

                  if (selected.id === 'instant_brew') {
                    const command = getCommand(0x40, [], 0x0f);

                    await writeValueWithResponse(command);
                    return;
                  }

                  const isChanged = !isEqual(selected.brewing_data, {
                    time: brewingTime,
                    waterAmount,
                    temperature,
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
                onPressOut={() => animationCancelButton.stopAnimation()}
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
          ) : null}
          <View style={s.teaAlarmWrapper}>
            <FlatList
              contentContainerStyle={s.listContainerStyle}
              data={teaAlarms || []}
              renderItem={({item}) => <TeaAlarmInfo {...item} />}
            />
          </View>
        </Animated.View>
      </View>
    </Wrapper>
  );
};

export default InstantBrewScreen;
