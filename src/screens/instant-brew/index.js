import React, {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useCallback, useEffect, useState} from 'react';
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
  cancelBrewing,
  deviceManager,
  getCommand,
  sleep,
  startBrewing,
} from '../../utils/device.js';
import {updateUser} from '../../utils/db/auth.js';
import {$userStore} from '../../core/store/user.js';

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
  },
  brewButton: {
    ...basicStyles.backgroundButton,
    paddingHorizontal: 57,
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

const Buffer = require('buffer/').Buffer;

const InstantBrewScreen = props => {
  const theme = useStore($themeStore);
  const [modal, setModal] = useState(null);
  const navigation = useNavigation();
  const teaAlarms = useStore($teaAlarmsStrore);
  const user = useStore($userStore);

  useFocusEffect(
    useCallback(() => {
      getPressetsFx();
      getUserFx();
      getTeaAlarmsFx();
      initThemeFx();
    }, []),
  );

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
        navigation.navigate('Brewing', {
          time: time.seconds,
        });
        const command = startBrewing();
        await deviceManager
          .writeValueAndNotify(command)
          .then(async () => {
            await sleep(2000);
          })
          .catch(err => {
            console.error('Start Brewing error', err);
          });
      },
      closeModal: () => {
        setModal(null);
        navigation.navigate('Brewing', {
          time: brewingTime.seconds,
        });
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

          <SplitCups cleaning={isCleaning} setCleaning={setIsCleaning} />
          <View style={s.buttons}>
            <TouchableOpacity
              onPress={async () => {
                if (selected.id === 'new_presset') {
                  await addPressetToStoreFx({
                    brewing_data: {time: brewingTime, waterAmount, temperature},
                    cleaning: isCleaning,
                    tea_img: '',
                    tea_type: selected.tea_type,
                  });
                  navigation.navigate('Brewing', {
                    time: brewingTime.seconds,
                  });
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

                // const isChanged = !isEqual(selected, {
                //   brewing_data: {time: brewingTime, waterAmount, temperature},
                //   cleaning: isCleaning,
                //   id: selected.id,
                //   tea_img: selected.tea_img,
                //   tea_type: selected.tea_type,
                // });
                // console.log(isChanged);
                // if (isChanged) {
                //   openConfiramtionModal(brewingTime);
                // } else {
                //   navigation.navigate('Brewing', {
                //     time: brewingTime.seconds,
                //   });
                // }
                console.log(selected);
                const command = getCommand(
                  0x40,
                  [temperature, brewingTime.value, waterAmount],
                  0x0f,
                  true,
                );
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
              }}
              style={s.brewButton}>
              <Text style={s.buttonText}>Brew it</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const command = getCommand(0x42, [], 4, false);
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
                Cancel
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
