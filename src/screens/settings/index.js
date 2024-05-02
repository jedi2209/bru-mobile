import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  ButtonText,
  LoaderIcon,
  Toast,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';

import {useStore} from 'effector-react';

import Wrapper from '@comp/Wrapper';

import {colors, basicStyles} from '../../core/const/style';
import BruMachine from './components/BruMachine';

import ConfirmationModal from '../../core/components/ConfirmationModal';
import {$themeStore} from '../../core/store/theme';
import CommonSettings from './components/CommonSettings';
import {useTranslation} from 'react-i18next';
import useBle from '../../hooks/useBlePlx';
import {getFileURL, getFirmwareData} from '../../utils/firmware';
import {$connectedDevice} from '../../core/store/connectedDevice';

const SettingsScreen = props => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newFeaturesModalOpened, setNewFeaturesModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const {navigation, route} = props;
  const toast = useToast();
  const {t} = useTranslation();
  const currentDevice = useStore($connectedDevice);
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const {
    readValue,
    checkConnection,
    connectToDevice,
    requestBluetoothPermission,
  } = useBle();

  useEffect(() => {
    console.log(route.params);
    setNewFeaturesModalOpened(route.params.openNewVersionInfoModal);
  }, [route]);
  useEffect(() => {
    requestBluetoothPermission();
    async function getFirmware() {
      setIsLoading(true);
      try {
        const currentFirmware = await readValue('firmwareRevision');
        const data = await getFirmwareData();
        const availableFirmware = data.find(
          firmwareData => firmwareData.testAvailable,
        );

        console.log(currentFirmware, !!availableFirmware);

        if (!currentFirmware) {
          return;
        }
        if (!availableFirmware) {
          return;
        }

        const file = await getFileURL('firmware/' + availableFirmware.file);
        setFilePath(file);
        setFileName(availableFirmware.file);
        if (availableFirmware.name !== currentFirmware) {
          setIsConfirmModalOpen(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getFirmware();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onPressUpdate = () => {
    navigation.navigate('UpdateFirmwareScreen', {
      fileName,
      filePath,
    });
  };

  if (isLoading) {
    return (
      <Wrapper
        additionalContentContainerStyle={s.loadingWrapper}
        style={[s.wrapper]}
        {...props}>
        <ActivityIndicator size="large" color="white" />
      </Wrapper>
    );
  }

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
        {t('Settings.Title')}
      </Text>
      <View>
        {currentDevice ? (
          <>
            <Text style={[s.h2, isDarkMode && basicStyles.darkText]}>
              {t('Settings.ConnectedMachines')}
            </Text>
            <BruMachine item={currentDevice} />
          </>
        ) : null}
      </View>
      <Button
        size="lg"
        variant={'primary'}
        style={[s.buttonStyle]}
        onPressIn={() => navigation.navigate('AddNewDeviceScreen')}>
        <ButtonText style={s.buttonTextStyle}>
          {t('Settings.ConnectNewMachine')}
        </ButtonText>
      </Button>
      <Button
        onPress={async () => {
          try {
            await connectToDevice();
          } catch (error) {
            toast.show({
              placement: 'top',
              duration: 5000,
              render: () => {
                return (
                  <Toast
                    id={'noPermissionsToast'}
                    action="error"
                    variant="accent">
                    <VStack space="lg">
                      <ToastTitle fontSize={'$md'}>
                        {t('Settings.BluetoothConnectionError')}
                      </ToastTitle>
                    </VStack>
                  </Toast>
                );
              },
              onCloseComplete: () => {},
            });
          }
          const isConnected = await checkConnection();
          if (!isConnected) {
            return;
          } else {
            _onPressUpdate();
          }
        }}
        size="lg"
        variant={'primary'}
        style={[
          s.buttonStyle,
          s.updateButton,
          isDarkMode && s.updateButtonDark,
        ]}>
        <ButtonText
          style={[
            s.buttonTextStyle,
            s.updateButtonText,
            isDarkMode && s.darkTextMain,
          ]}>
          {t('Settings.UpdateFirmware')}
        </ButtonText>
      </Button>

      <CommonSettings />

      <ConfirmationModal
        onConfirm={() => {
          navigation.navigate('UpdateFirmwareScreen', {file: filePath});
          setIsConfirmModalOpen(false);
        }}
        opened={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        withCancelButton
        cancelButtonText={t('Settings.No')}
        confirmationButtonText={t('Settings.Confirm')}
        modalTitle={t('Settings.FirmwareUpdate')}
        confirmationText={t('Settings.BruAppWillDownload')}
      />
      <ConfirmationModal
        onConfirm={() => {
          route.params.openNewVersionInfoModal = false;
          setNewFeaturesModalOpened(false);
          navigation.navigate('Help', {
            openCollapsed: 7,
          });
        }}
        opened={newFeaturesModalOpened}
        closeModal={() => {
          route.params.openNewVersionInfoModal = false;
          setNewFeaturesModalOpened(false);
        }}
        withCancelButton
        cancelButtonText={t('Settings.No')}
        confirmationButtonText={t('Settings.Yes')}
        modalTitle={t('Settings.NewFeatures')}
        confirmationText={t('Settings.DoYouWant')}
      />
    </Wrapper>
  );
};
const windowHeight = Dimensions.get('window').height;
const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
  },
  screenTitle: {
    color: colors.gray.grayDarkText,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 20,
    marginTop: 30,
  },
  darkTextMain: {
    color: colors.white,
  },
  h2: {
    color: colors.gray.grayDarkText,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    height: 55,
    alignItems: 'center',
    borderRadius: 90,
    marginHorizontal: '15%',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: colors.green.mid,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  updateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginBottom: 13,
    borderColor: colors.green.mid,
  },
  updateButtonText: {
    color: colors.green.mid,
    textAlign: 'center',
  },
  updateButtonDark: {
    backgroundColor: 'rgba(42, 42, 42, 0.40)',
  },
  filterStatus: {
    ...basicStyles.rowBetween,
    paddingVertical: 16,
  },
  bottomBorder: {
    borderBottomColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  subTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
export default SettingsScreen;
