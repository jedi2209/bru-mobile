import React, {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {basicStyles, colors} from '../../core/const/style';
import Collapsible from 'react-native-collapsible';
import {useState} from 'react';
import DownArrowIcon from '../../core/components/icons/DownArrowIcon';
// import PlayIcon from '../../core/components/icons/PlayIcon';
import LinearGradient from 'react-native-linear-gradient';
import NotificationModal from '../../core/components/NotificationModal';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {useTranslation} from 'react-i18next';
import qs from 'qs';

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

const HelpScreen = props => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const [collapsed, setCollapsed] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  const {t} = useTranslation();
  const [message, setMessage] = useState('');

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
        {t('Help.title')}
      </Text>
      {/* <TouchableOpacity
        onPress={() => setCollapsed(prev => (prev === 1 ? 0 : 1))}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            How to operate BRU machine?
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, collapsed === 1 && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed !== 1}>
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
      <TouchableOpacity
        onPress={() => setCollapsed(prev => (prev === 2 ? 0 : 2))}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            Where to get some good tea?
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, collapsed === 2 && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => setCollapsed(prev => (prev === 3 ? 0 : 3))}>
        <View style={[s.questionWrapper, isDarkMode && s.darkBorder]}>
          <Text style={[s.textStyle, isDarkMode && s.textStyleDark]}>
            {t('Help.contactSupport')}
          </Text>
          <DownArrowIcon
            fill={isDarkMode ? colors.white : colors.green.mid}
            style={[s.arrowIcon, collapsed === 3 && s.arrowIconActive]}
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed !== 3}>
        <LinearGradient
          style={s.collapsible}
          colors={
            isDarkMode
              ? colors.gradient.helpCollapsibleDark
              : [colors.white, colors.white]
          }>
          <Text style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
            {t('Help.contactDesc')}
          </Text>
          <Text style={s.textareaLabel}>{t('Help.issueDesc')}</Text>
          <View style={s.textareaWrapper}>
            <TextInput
              placeholderTextColor={colors.gray.grayDarkText}
              style={s.textarea}
              placeholder={t('Help.contactPlaceholder')}
              multiline={true}
              numberOfLines={10}
              onChangeText={text => setMessage(text)}
            />
            {/* <TouchableOpacity>
              <Text style={s.attachPhoto}>Attach photo</Text>
            </TouchableOpacity> */}
          </View>
          <View style={basicStyles.rowBetween}>
            <TouchableOpacity
              onPress={() => {
                setCollapsed(0);
                setMessage('');
              }}>
              <Text
                style={[
                  basicStyles.textButton,
                  isDarkMode && basicStyles.darkText,
                ]}>
                {t('Help.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const query = qs.stringify({
                  subject: 'Need help',
                  body: message,
                });
                Linking.openURL(`mailto:bk@bru-tea.com?${query}`);
              }}
              style={s.button}>
              <Text style={basicStyles.backgroundButtonText}>
                {t('Help.send')}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Collapsible>
      <NotificationModal
        opened={modalOpened}
        closeModal={() => setModalOpened(false)}
        modalTitle={t('Help.modalSuccess')}
      />
    </Wrapper>
  );
};

export default HelpScreen;
