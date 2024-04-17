import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, fonts} from '../../const/style';

const s = StyleSheet.create({
  pressetInfoItem: {
    paddingHorizontal: 11,
    paddingTop: 16.5,
    paddingBottom: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
  },
  pressetIcon: {marginBottom: 7},
  pressetTitle: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
    width: 90,
    textAlign: 'center',
    marginBottom: 9,
    lineHeight: 17,
    letterSpacing: 0.4,
    fontFamily: fonts.defaultMenuFamily,
  },
  pressetScreenTitleText: {
    color: '#231F20',
  },
  pressetScreenValueText: {
    color: colors.green.mid,
  },
  pressetValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: 0.4,
    fontFamily: fonts.defaultMenuFamily,
  },
});

const TeaAlarmInfoItem = ({Icon, title, value, type}) => {
  return (
    <View style={s.pressetInfoItem}>
      <View style={s.iconText}>
        {Icon}
        <Text
          style={[
            s.pressetTitle,
            type === 'pressets' && s.pressetScreenTitleText,
          ]}>
          {title}
        </Text>
      </View>
      <Text
        style={[
          s.pressetValue,
          type === 'pressets' && s.pressetScreenValueText,
        ]}>
        {value}
      </Text>
    </View>
  );
};

export default TeaAlarmInfoItem;
