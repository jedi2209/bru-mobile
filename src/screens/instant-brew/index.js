import React, {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useState} from 'react';
import {basicStyles, colors} from '../../core/const/style';
import SplitCups from './components/SplitCups';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import TeaAlarm from '../../core/components/TeaAlarm/TeaAlarmInfo';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import {useNavigation} from '@react-navigation/native';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';

export const mockedData = [
  {
    id: 10,
    title: 'Instant Brew',
    img: require('/assets/teaImages/instant_brew.png'),
  },
  {
    id: 1,
    title: 'Black Tea',
    img: require('/assets/teaImages/black_tea.png'),
  },
  {id: 2, title: 'Puer', img: require('/assets/teaImages/puer.png')},
  {id: 3, title: 'A lot of Puer', img: require('/assets/teaImages/puer.png')},
  {id: 4, title: 'TItle', img: require('/assets/teaImages/puer.png')},
  {id: 5, title: 'TItle', img: require('/assets/teaImages/puer.png')},
  {id: 6, title: 'TItle', img: require('/assets/teaImages/puer.png')},
  {id: 7, title: 'TItle', img: require('/assets/teaImages/puer.png')},
  {
    id: 8,
    title: 'New Presset',
    img: require('/assets/teaImages/new_presset.png'),
  },
];

const s = StyleSheet.create({
  container: {
    marginTop: 40,
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
});

const InstantBrewScreen = props => {
  const theme = useStore($themeStore);
  const [selectedItem, setSelectedItem] = useState(0);
  const [modal, setModal] = useState(null);
  const navigation = useNavigation();

  return (
    <Wrapper {...props}>
      {modal ? <ConfirmationModal {...modal} /> : null}
      <View style={s.container}>
        <PressetList
          style={s.list}
          data={mockedData}
          selected={selectedItem}
          setSelected={setSelectedItem}
        />
        <View style={s.innerContainer}>
          <TeaAlarm />

          <SplitCups />
          <View style={s.buttons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Brewing')}
              style={s.brewButton}>
              <Text style={s.buttonText}>Brew it</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                theme === 'light' ? s.dispenseButtonLight : s.dispenseButton
              }
              onPress={() => {
                navigation.navigate('Authorization');
                // setModal({
                //   opened: true,
                //   withCancelButton: true,
                //   cancelButtonText: 'Later',
                //   modalTitle:
                //     'Do you want to save this configutation as a new preset?',
                //   confirmationText: (
                //     <Text>
                //       You will be able to create new presets later in{' '}
                //       <Text style={{color: colors.green.mid}}>Presets</Text>{' '}
                //       page.
                //     </Text>
                //   ),
                //   confirmationButtonText: 'Save preset',
                //   withDontShowAgain: true,
                //   onConfirm: () => setModal(null),
                //   closeModal: () => setModal(null),
                //   dontShowAgainText: "Don't show me again",
                // })
              }}>
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
            <TeaAlarmInfo />
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default InstantBrewScreen;
