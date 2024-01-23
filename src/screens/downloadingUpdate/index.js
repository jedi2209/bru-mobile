import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderIcon from '../../core/components/icons/HeaderIcon';
import {basicStyles, colors} from '../../core/const/style';
import * as Progress from 'react-native-progress';
import {setSettingsModalOpen} from '../../core/store/device';

const s = StyleSheet.create({
  container: {
    backgroundColor: '#353535',
    height: '100%',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 70 : 44,
    height: '75%',
  },
  iconWrapper: {
    borderWidth: 16,
    borderColor: colors.green.mid,
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloading: {
    textAlign: 'center',
    marginBottom: 30,
    color: colors.gray.lightGray,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  warning: {
    textAlign: 'center',
    marginTop: 30,
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginHorizontal: 16,
  },
});

const UpdateScreen = props => {
  const {navigation} = props;
  return (
    <View style={s.container} {...props}>
      <View style={s.wrapper}>
        <View style={s.iconWrapper}>
          <HeaderIcon />
        </View>
        <View>
          <Text style={s.downloading}>Downloading BRU firmware</Text>
          <Progress.Bar
            style={{alignSelf: 'center'}}
            width={260}
            height={4}
            color={colors.green.mid}
            progress={0.5}
            borderColor="transparent"
            unfilledColor="rgba(113, 136, 58, 0.3)"
          />
          <Text style={s.warning}>
            Please do not disconnect your BRU machine from power until the
            firmware updated.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSettingsModalOpen(true);
            navigation.navigate('Settings', {
              screen: 'Settings',
              params: {previous_screen: 'DownloadingUpdate'},
            });
          }}
          style={basicStyles.backgroundButton}>
          <Text style={[basicStyles.backgroundButtonText, {width: 132}]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateScreen;
