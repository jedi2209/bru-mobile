/* eslint-disable react/no-unstable-nested-components */
import React, {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {basicStyles, colors} from '../../core/const/style';
import {useEffect, useState} from 'react';
import NotificationModal from '../../core/components/NotificationModal';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {useTranslation} from 'react-i18next';
import {CollapsibleButton} from './CollapsibleButton';
import {$currentFirmwareStore} from '../../core/store/firmware';
import {$langSettingsStore} from '../../core/store/lang';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Input} from './Input';
import firestore from '@react-native-firebase/firestore';

const s = StyleSheet.create({
  wrapper: {},
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
  errorText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '400',
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
    color: colors.gray.grayDarkText,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    textDecorationLine: 'underline',
    color: '#03A9F4',
  },
  linkWrapper: {flexDirection: 'row', gap: 5, alignItems: 'center'},
  darkText: {
    color: colors.white,
  },
  input: {
    backgroundColor: '#E6E7E8',
    paddingHorizontal: 15,
    height: 50,
    color: 'black',
    marginBottom: 10,
  },
  label: {marginLeft: 15},
});

const messageSchema = yup.object({
  email: yup.string().email('Please enter valid email'),
  helpMessage: yup.string().notRequired(),
  featureMessage: yup.string().notRequired(),
});

const HelpScreen = props => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const [collapsed, setCollapsed] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  const {t} = useTranslation();
  const language = useStore($langSettingsStore);
  const currentFirmware = useStore($currentFirmwareStore).data.find(
    item => item.testAvailable,
  );
  const versionDescription =
    currentFirmware.description[language] || currentFirmware.description.en;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(messageSchema),
  });

  useEffect(() => {
    if (props.route.params.openCollapsed) {
      console.log(props.route.params);
      setCollapsed(props.route.params.openCollapsed);
    }
  }, [props.route.params, props.route.params.openCollapsed]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.wrapper}>
      <ScrollView
        style={{
          backgroundColor: isDarkMode ? '#4F4F4F' : colors.white,
          height: '100%',
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}>
        <CollapsibleButton
          onPress={() => setCollapsed(prev => (prev === 1 ? 0 : 1))}
          collapsed={collapsed !== 1}
          buttonText={t('Help.InstallFilter')}
          collapsibleItem={
            <View style={s.linkWrapper}>
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
                'Help.PleaseWatchThis',
              )}`}</Text>
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
                <Text style={s.linkText}>{t('Help.Link')}</Text>
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
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
                'Help.PleaseWatchThis',
              )}`}</Text>
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
                <Text style={s.linkText}>{t('Help.Link')}</Text>
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
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
                'Help.ResetPinAnswer',
              )}`}</Text>
            </View>
          }
        />
        <CollapsibleButton
          onPress={() => setCollapsed(prev => (prev === 5 ? 0 : 5))}
          collapsed={collapsed !== 5}
          buttonText={t('Help.TastesDifferent')}
          collapsibleItem={
            <View>
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
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
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
                'Help.ContactAnswer',
              )}`}</Text>
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>
                {'here will be qr-code'}
              </Text>
              <View style={{flexDirection: 'row', gap: 3}}>
                <Text style={[s.defaultText, isDarkMode && s.darkText]}>{`${t(
                  'Help.Or',
                )}`}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    const canOpen = await Linking.canOpenURL(
                      encodeURI('mailto:support@bru-tea.com'),
                    );
                    Linking.openURL(encodeURI('mailto:support@bru-tea.com'));
                    if (canOpen) {
                    } else {
                      Alert.alert("Can't open link");
                    }
                  }}>
                  <Text style={[s.defaultText, isDarkMode && s.darkText]}>
                    support@bru-tea.com
                  </Text>
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
              <Text
                style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                {t('Help.contactDesc')}
              </Text>
              <Text style={s.textareaLabel}>Email</Text>
              <Input
                keyboardType="email-address"
                style={s.input}
                placeholder="Please enter your email, so we could answer you!"
                control={control}
                name="email"
              />
              {errors.email?.message ? (
                <Text style={s.errorText}>{errors.email.message}</Text>
              ) : null}
              <Text style={s.textareaLabel}>{t('Help.issueDesc')}</Text>
              <View style={s.textareaWrapper}>
                <Input
                  style={s.textarea}
                  placeholder={t('Help.contactPlaceholder')}
                  control={control}
                  name="helpMessage"
                  multiline={true}
                  numberOfLines={10}
                />
              </View>
              <View style={basicStyles.rowBetween}>
                <TouchableOpacity
                  onPress={() => {
                    setCollapsed(0);
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
                  onPress={handleSubmit(async data => {
                    await firestore()
                      .collection('mail')
                      .add({
                        from: data.email,
                        to: 'aleksandrov.oleksii.wgm@gmail.com',
                        message: {
                          subject: 'Need help!',
                          text: data.helpMessage,
                        },
                      });
                  })}
                  style={s.button}>
                  <Text style={basicStyles.backgroundButtonText}>
                    {t('Help.send')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
        <CollapsibleButton
          onPress={() => setCollapsed(prev => (prev === 8 ? 0 : 8))}
          collapsed={collapsed !== 8}
          buttonText={t('Help.FeatureButton')}
          collapsibleItem={
            <View>
              <Text
                style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                {t('Help.FeatureTitle')}
              </Text>
              <Text style={s.textareaLabel}>Email</Text>
              <Input
                keyboardType="email-address"
                style={s.input}
                placeholder={t('Help.EmailPlaceholder')}
                control={control}
                name="email"
              />
              {errors.email?.message ? (
                <Text style={s.errorText}>{errors.email.message}</Text>
              ) : null}
              <Text style={s.textareaLabel}>{t('Help.FeatureDesc')}</Text>
              <View style={s.textareaWrapper}>
                <Input
                  placeholderTextColor={colors.gray.grayDarkText}
                  style={s.textarea}
                  placeholder={t('Help.DescribeFeatureHere')}
                  multiline={true}
                  numberOfLines={10}
                  control={control}
                  name="featureMessage"
                />
              </View>
              <View style={basicStyles.rowBetween}>
                <TouchableOpacity
                  onPress={() => {
                    setCollapsed(0);
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
                  onPress={handleSubmit(async data => {
                    await firestore()
                      .collection('mail')
                      .add({
                        from: data.email,
                        to: 'bk@bru-tea.com',
                        message: {
                          subject: 'Feature request',
                          text: data.featureMessage,
                        },
                      });
                  })}
                  style={s.button}>
                  <Text style={basicStyles.backgroundButtonText}>
                    {t('Help.send')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
        <CollapsibleButton
          onPress={() => setCollapsed(prev => (prev === 7 ? 0 : 7))}
          collapsed={collapsed !== 7}
          buttonText={"What's new?"}
          collapsibleItem={
            <View>
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>
                {versionDescription}
              </Text>
            </View>
          }
        />
        <View style={{marginBottom: 70}} />
        <NotificationModal
          opened={modalOpened}
          closeModal={() => setModalOpened(false)}
          modalTitle={t('Help.modalSuccess')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HelpScreen;
