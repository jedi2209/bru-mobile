import React, {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, fonts} from '../const/style';
import UserIcon from './icons/UserIcon';
import CartIcon from './icons/CartIcon';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import BruStoreModal from './BruStoreModal';
import Logo from './icons/Logo';

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.green.header,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 18,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameIconWrapper: {},
  deviceName: {
    fontFamily: fonts.defaultFamily,
    color: colors.black,
    fontSize: 16,
    marginRight: 15,
    fontWeight: '600',
  },
  iconsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: '100%',
    right: 20,
  },
  userIcon: {
    marginRight: 24,
  },
});

const Header = () => {
  const navigation = useNavigation();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <View style={s.header}>
      <View style={s.nameIconWrapper}>
        <Logo />
      </View>
      <View style={s.iconsWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <UserIcon style={s.userIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsOpened(true)}>
          <CartIcon />
        </TouchableOpacity>
        <BruStoreModal
          opened={isOpened}
          closeModal={() => setIsOpened(false)}
        />
      </View>
    </View>
  );
};

export default Header;
