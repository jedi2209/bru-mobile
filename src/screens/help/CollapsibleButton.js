import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {basicStyles, colors} from '../../core/const/style';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import DownArrowIcon from '../../core/components/icons/DownArrowIcon';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';

const s = StyleSheet.create({
  questionWrapper: {
    ...basicStyles.rowBetween,
    borderBottomColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  darkBorder: {
    borderBottomColor: '#6F6F6F',
  },
  textStyle: {
    color: colors.gray.grayDarkText,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    paddingLeft: 14,
  },
  textStyleDark: {
    color: colors.white,
  },
  arrowIcon: {
    marginRight: 16,
    transform: [{rotate: '180deg'}],
  },
  arrowIconActive: {transform: [{rotate: '0deg'}]},
  collapsible: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  collapsibleDark: {},
  collapsibleItem: {
    ...basicStyles.row,
    gap: 10,
    marginBottom: 10,
  },
  collapsibleItemText: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  collapsibleItemTextDark: {
    color: colors.gray.lightGray,
  },
  contactTitle: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  textareaLabel: {
    color: colors.green.mid,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  textareaWrapper: {marginBottom: 20},
  textarea: {
    backgroundColor: '#E6E7E8',
    paddingHorizontal: 15,
    height: 150,
    paddingTop: 15,
    color: 'black',
  },
  attachPhoto: {
    position: 'absolute',
    color: colors.green.mid,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    bottom: 8,
    right: 16,
  },
  button: {
    ...basicStyles.backgroundButton,
    paddingHorizontal: 38,
  },
});

export const CollapsibleButton = ({
  onPress = () => {},
  buttonText = '',
  collapsed = true,
  collapsibleItem,
  styles = {},
}) => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';

  return (
    <>
      <TouchableOpacity onPress={onPress} style={[styles]}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            {buttonText}
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, collapsed && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <LinearGradient
          style={s.collapsible}
          colors={
            isDarkMode
              ? colors.gradient.helpCollapsibleDark
              : [colors.white, colors.white]
          }>
          <View style={s.collapsibleItem}>{collapsibleItem}</View>
        </LinearGradient>
      </Collapsible>
    </>
  );
};
