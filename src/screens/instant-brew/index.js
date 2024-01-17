import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {useState} from 'react';
import {colors} from '../../core/const/style';
import SplitCups from './components/SplitCups';
import PressetList from '../../core/components/PressetList/PressetList';
import TeaAlarmInfo from '../../core/components/TeaAlarmInfo';
import TeaAlarm from '../../core/components/TeaAlarm/TeaAlarmInfo';

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
    backgroundColor: colors.green.mid,
    paddingHorizontal: 57,
    paddingVertical: 15,
    borderRadius: 90,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    lineHeight: 22,
    letterSpacing: 0.5,
    marginHorizontal: 0,
    marginVertical: 0,
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
  const phoneTheme = useColorScheme();
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Wrapper {...props}>
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
            <TouchableOpacity style={s.brewButton}>
              <Text style={s.buttonText}>Brew it</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                phoneTheme === 'light'
                  ? s.dispenseButtonLight
                  : s.dispenseButton
              }>
              <Text
                style={[
                  s.buttonText,
                  phoneTheme === 'light' && {
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
