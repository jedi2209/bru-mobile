/* eslint-disable react/no-unstable-nested-components */
import React, {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Wrapper from '@comp/Wrapper';
import {basicStyles, colors} from '../../core/const/style';
import {useState} from 'react';
import NotificationModal from '../../core/components/NotificationModal';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {useTranslation} from 'react-i18next';
import qs from 'qs';
import {CollapsibleButton} from './CollapsibleButton';

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
  defaultText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    color: colors.white,
  },
  linkWrapper: {flexDirection: 'row', gap: 5, alignItems: 'center'},
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
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 1 ? 0 : 1))}
        collapsed={collapsed !== 1}
        buttonText={t('Help.InstallFilter')}
        collapsibleItem={
          <View style={s.linkWrapper}>
            <Text style={s.defaultText}>{`${t('Help.PleaseWatchThis')}`}</Text>
            <TouchableOpacity
              onPress={async () => {
                const canOpen = await Linking.canOpenURL(
                  'https://www.youtube.com/watch?v=7UWqNc1WfEY&t=1s',
                );
                if (canOpen) {
                  Linking.openURL(
                    'https://www.youtube.com/watch?v=7UWqNc1WfEY&t=1s',
                  );
                } else {
                  Alert.alert("Can't open link");
                }
              }}>
              <Text style={s.defaultText}>{t('Help.Link')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 2 ? 0 : 2))}
        collapsed={collapsed !== 2}
        buttonText={t('Help.Descale')}
        collapsibleItem={
          <View style={s.linkWrapper}>
            <Text style={s.defaultText}>{`${t('Help.PleaseWatchThis')}`}</Text>
            <TouchableOpacity
              onPress={async () => {
                const canOpen = await Linking.canOpenURL(
                  'https://www.youtube.com/watch?v=3fZdkroBe_4',
                );
                if (canOpen) {
                  Linking.openURL(
                    'https://www.youtube.com/watch?v=3fZdkroBe_4',
                  );
                } else {
                  Alert.alert("Can't open link");
                }
              }}>
              <Text style={s.defaultText}>{t('Help.Link')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 4 ? 0 : 4))}
        collapsed={collapsed !== 4}
        buttonText={t('Help.ResetPin')}
        collapsibleItem={
          <View>
            <Text style={s.defaultText}>{`${t('Help.ResetPinAnswer')}`}</Text>
          </View>
        }
      />
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 5 ? 0 : 5))}
        collapsed={collapsed !== 5}
        buttonText={t('Help.TastesDifferent')}
        collapsibleItem={
          <View>
            <Text style={s.defaultText}>{`${t(
              'Help.PleaseChangeFilter',
            )}`}</Text>
          </View>
        }
      />
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 6 ? 0 : 6))}
        collapsed={collapsed !== 6}
        buttonText={t('Help.Contact')}
        collapsibleItem={
          <View>
            <Text style={s.defaultText}>{`${t('Help.ContactAnswer')}`}</Text>
            <Text style={s.defaultText}>{'here will be qr-code'}</Text>
            <View style={{flexDirection: 'row', gap: 3}}>
              <Text style={s.defaultText}>{`${t('Help.Or')}`}</Text>
              <TouchableOpacity
                onPress={async () => {
                  const canOpen = await Linking.canOpenURL(
                    encodeURI('mailto:support@bru-tea.com'),
                  );
                  Linking.openURL(encodeURI('mailto:support@bru-tea.com'));
                  console.log(canOpen, 'canOpen');
                  if (canOpen) {
                  } else {
                    Alert.alert("Can't open link");
                  }
                }}>
                <Text style={s.defaultText}>support@bru-tea.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
      <CollapsibleButton
        onPress={() => setCollapsed(prev => (prev === 3 ? 0 : 3))}
        collapsed={collapsed !== 3}
        buttonText={t('Help.contactSupport')}
        collapsibleItem={
          <View>
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
                onPress={async () => {
                  const query = qs.stringify({
                    subject: 'Need help',
                    body: message,
                  });
                  Linking.openURL(`mailto:bk@bru-tea.com?${query}`);
                  // await firestore()
                  //   .collection('mail')
                  //   .add({
                  //     to: 'bk@bru-tea.com',
                  //     message: {
                  //       subject: 'Need help!',
                  //       text: message,
                  //     },
                  //   });
                }}
                style={s.button}>
                <Text style={basicStyles.backgroundButtonText}>
                  {t('Help.send')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
      <NotificationModal
        opened={modalOpened}
        closeModal={() => setModalOpened(false)}
        modalTitle={t('Help.modalSuccess')}
      />
    </Wrapper>
  );
};

export default HelpScreen;
