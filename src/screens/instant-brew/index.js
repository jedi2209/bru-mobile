import React, {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useCallback, useState} from 'react';
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
import {getUserFx} from '../../core/store/profile';
import BrewingData from '../../core/components/TeaAlarm/BrewingData';
import {useBrewingData} from '../../hooks/useBrewingData';
import {usePressetList} from '../../hooks/usePressetList';
import {$teaAlarmsStrore, getTeaAlarmsFx} from '../../core/store/teaAlarms';
import {useFocusEffect} from '@react-navigation/native';

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
  const theme = useStore($themeStore);
  const [modal, setModal] = useState(null);
  const navigation = useNavigation();
  const teaAlarms = useStore($teaAlarmsStrore);

  useFocusEffect(
    useCallback(() => {
      getPressetsFx();
      getUserFx();
      getTeaAlarmsFx();
      initThemeFx();
    }, []),
  );

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
      onConfirm: () => {
        addPressetToStoreFx({
          brewing_data: {time, waterAmount, temperature},
          cleaning: isCleaning,
          tea_img: selected.tea_img,
          tea_type: selected.tea_type,
        });
        setModal(null);
        navigation.navigate('Brewing', {
          time: time,
        });
      },
      closeModal: () => {
        setModal(null);
        navigation.navigate('Brewing', {
          time: time,
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
                const time = +brewingTime.minutes * 60 + +brewingTime.seconds;
                if (selected.id === 'new_presset') {
                  await addPressetToStoreFx({
                    brewing_data: {time, waterAmount, temperature},
                    cleaning: isCleaning,
                    tea_img: '',
                    tea_type: selected.tea_type,
                  });
                  navigation.navigate('Brewing', {
                    time: time,
                  });
                  return;
                }

                const isChanged = !isEqual(selected, {
                  brewing_data: {time, waterAmount, temperature},
                  cleaning: isCleaning,
                  id: selected.id,
                  tea_img: selected.tea_img,
                  tea_type: selected.tea_type,
                });
                if (isChanged) {
                  openConfiramtionModal(time);
                } else {
                  navigation.navigate('Brewing', {
                    time: time,
                  });
                }
              }}
              style={s.brewButton}>
              <Text style={s.buttonText}>Brew it</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
                Dispense hot water
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
