import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {basicStyles, colors} from '../../core/const/style';
import ArrowIcon from '../../core/components/icons/ArrowIcon';
import Collapsible from 'react-native-collapsible';
import {useState} from 'react';
import DownArrowIcon from '../../core/components/icons/DownArrowIcon';
import PlayIcon from '../../core/components/icons/PlayIcon';
import LinearGradient from 'react-native-linear-gradient';

const s = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  screenTitle: {...basicStyles.screenTitle, marginTop: 30, marginBottom: 20},
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
    fontSize: 15,
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
  },
  arrowIconActive: {transform: [{rotate: '180deg'}]},
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

const HelpScreen = props => {
  const phoneTheme = useColorScheme();
  const isDarkMode = phoneTheme === 'dark';
  const [firstCollapsed, setFirstCollapsed] = useState(true);
  const [secondCollapsed, setSecondCollapsed] = useState(true);
  const [contactCollapsed, setContactCollapsed] = useState(true);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
        Help
      </Text>
      <TouchableOpacity onPress={() => setFirstCollapsed(prev => !prev)}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            How to operate BRU machine?
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, !firstCollapsed && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={firstCollapsed}>
        <LinearGradient
          style={s.collapsible}
          colors={
            isDarkMode
              ? colors.gradient.helpCollapsibleDark
              : [colors.white, colors.white]
          }>
          <View style={s.collapsibleItem}>
            <PlayIcon />
            <Text
              style={[
                s.collapsibleItemText,
                isDarkMode && s.collapsibleItemTextDark,
              ]}>
              How to turn change tea?
            </Text>
          </View>
          <View style={s.collapsibleItem}>
            <PlayIcon />
            <Text
              style={[
                s.collapsibleItemText,
                isDarkMode && s.collapsibleItemTextDark,
              ]}>
              How to change filter?
            </Text>
          </View>
          <View style={s.collapsibleItem}>
            <PlayIcon />
            <Text
              style={[
                s.collapsibleItemText,
                isDarkMode && s.collapsibleItemTextDark,
              ]}>
              What rinsing does?
            </Text>
          </View>
          <View style={s.collapsibleItem}>
            <PlayIcon />
            <Text
              style={[
                s.collapsibleItemText,
                isDarkMode && s.collapsibleItemTextDark,
              ]}>
              Which tea requires Cleaning?
            </Text>
          </View>
        </LinearGradient>
      </Collapsible>
      <TouchableOpacity onPress={() => setSecondCollapsed(prev => !prev)}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            Where to get some good tea?
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, !secondCollapsed && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setContactCollapsed(prev => !prev)}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            Contact support
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, !contactCollapsed && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={contactCollapsed}>
        <LinearGradient
          style={s.collapsible}
          colors={
            isDarkMode
              ? colors.gradient.helpCollapsibleDark
              : [colors.white, colors.white]
          }>
          <Text style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
            Please provide the issue details to the BRU Support. We will assist
            you as soon as possible.
          </Text>
          <Text style={s.textareaLabel}>Issue Description</Text>
          <View style={s.textareaWrapper}>
            <TextInput
              placeholderTextColor={colors.gray.grayDarkText}
              style={s.textarea}
              placeholder="Enter your message here"
              multiline={true}
              numberOfLines={10}
            />
            <TouchableOpacity>
              <Text style={s.attachPhoto}>Attach photo</Text>
            </TouchableOpacity>
          </View>
          <View style={basicStyles.rowBetween}>
            <TouchableOpacity>
              <Text
                style={[
                  basicStyles.textButton,
                  isDarkMode && basicStyles.darkText,
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.button}>
              <Text style={basicStyles.backgroundButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Collapsible>
    </Wrapper>
  );
};

export default HelpScreen;
