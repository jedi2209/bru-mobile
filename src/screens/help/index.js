/* eslint-disable react/no-unstable-nested-components */
import React, {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
import {
  Image,
  Button,
  ButtonText,
  Heading,
  useToast,
  Toast,
  VStack,
  ToastTitle,
} from '@gluestack-ui/themed';
import ConfirmationModal from '../../core/components/ConfirmationModal';

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
  textareaWrapper: {marginBottom: 20, width: '100%'},
  textarea: {
    backgroundColor: '#E6E7E8',
    paddingHorizontal: 15,
    height: 150,
    paddingTop: 15,
    width: '100%',
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
  const [modal, setModal] = useState(null);
  const {t} = useTranslation();
  const language = useStore($langSettingsStore);
  const toast = useToast();
  const currentFirmware = useStore($currentFirmwareStore)?.data?.find(
    item => item.testAvailable,
  );
  const versionDescription =
    currentFirmware.description[language] || currentFirmware.description.en;

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(messageSchema),
  });

  useEffect(() => {
    if (props.route.params.openCollapsed) {
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
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text
                  style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                  {t('Help.ViaWhatsApp')}
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    const canOpen = await Linking.canOpenURL(
                      'https://wa.me/+41795157397',
                    );
                    if (canOpen) {
                      Linking.openURL('https://wa.me/+41795157397');
                    } else {
                      Alert.alert("Can't open link");
                    }
                  }}>
                  <Text style={s.linkText}>+41 79 515 73 97</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text
                  style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                  {t('Help.OrEmail')}
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    const canOpen = await Linking.canOpenURL(
                      'mailto:support@bru-tea.com',
                    );
                    if (canOpen) {
                      Linking.openURL('mailto:support@bru-tea.com');
                    } else {
                      Alert.alert("Can't open link");
                    }
                  }}>
                  <Text style={s.linkText}>support@bru-tea.com</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                {t('Help.OrForm')}
              </Text>
              <Text
                style={[s.contactTitle, isDarkMode && basicStyles.darkText]}>
                {t('Help.contactDesc')}
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
                    try {
                      await firestore()
                        .collection('mail')
                        .add({
                          from: data.email,
                          message: {
                            subject: 'Need help!',
                            text: `${data.helpMessage}\n\n${data.email}`,
                          },
                        });
                      setModal({
                        opened: true,
                        withCancelButton: false,
                        confirmationButtonText: t('Help.Okay'),
                        onConfirm: async () => {
                          setModal(null);
                        },
                        closeModal: () => {},
                      });
                      reset();
                    } catch (error) {
                      toast.show({
                        placement: 'top',
                        duration: 3000,
                        render: () => {
                          return (
                            <Toast
                              id={'dfuSuccessToast'}
                              action="success"
                              variant="accent">
                              <VStack space="lg">
                                <ToastTitle>
                                  {t('Toast.error.sendRequest')}
                                </ToastTitle>
                              </VStack>
                            </Toast>
                          );
                        },
                      });
                    }
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
            <View style={{width: '100%'}}>
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
                    try {
                      await firestore()
                        .collection('mail')
                        .add({
                          from: data.email,
                          message: {
                            subject: 'Need help!',
                            text: `${data.featureMessage}\n\n${data.email}`,
                          },
                        });
                      setModal({
                        opened: true,
                        withCancelButton: false,
                        confirmationButtonText: t('Help.Okay'),
                        onConfirm: async () => {
                          setModal(null);
                        },
                        closeModal: () => {},
                      });
                      reset();
                    } catch (error) {
                      toast.show({
                        placement: 'top',
                        duration: 3000,
                        render: () => {
                          return (
                            <Toast
                              id={'dfuSuccessToast'}
                              action="success"
                              variant="accent">
                              <VStack space="lg">
                                <ToastTitle>
                                  {t('Toast.error.sendRequest')}
                                </ToastTitle>
                              </VStack>
                            </Toast>
                          );
                        },
                      });
                    }
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
          buttonText={t('Help.WhatNew')}
          collapsibleItem={
            <View>
              <Text style={[s.defaultText, isDarkMode && s.darkText]}>
                {versionDescription}
              </Text>
            </View>
          }
        />
        <View style={{marginBottom: 70}} />
        <ConfirmationModal
          opened={modal}
          closeModal={() => setModal(null)}
          confirmationText={t('Help.modalSuccess')}
          {...modal}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HelpScreen;
