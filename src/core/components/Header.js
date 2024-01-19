import React, {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, fonts} from '../const/style';
import HeaderIcon from './icons/HeaderIcon';
import UserIcon from './icons/UserIcon';
import CartIcon from './icons/CartIcon';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import BruStoreModal from './BruStoreModal';

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.green.header,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingHorizontal: 18,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameIconWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  },
  userIcon: {
    marginRight: 24,
  },
});

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={s.header}>
      <View style={s.nameIconWrapper}>
        <Text style={s.deviceName}>BRU in kitchen</Text>
        <HeaderIcon />
      </View>
      <View style={s.iconsWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <UserIcon style={s.userIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <CartIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
