import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useBle from '../../hooks/useBlePlx';
import {getFileURL, getFirmwareData} from '../../utils/firmware';
import {useTranslation} from 'react-i18next';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StepItem = ({step, setStep, navigation}) => {
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const theme = useStore($themeStore);
  const isDark = theme === 'dark';
  const toast = useToast();
  const {t} = useTranslation();
  const stepsContent = [
    null,
    {
      // 1 checkBluetooth
      img: require('@assets/connection.jpg'),
      header: t('Connection.step1.header'),
      text: t('Connection.step1.text'),
    },
    {
      // 2 checkBluetooth => false
      video: require('@assets/videos/connection.mp4'),
      header: t('Connection.step2.header'),
      text: t('Connection.step2.text'),
    },
    {
      // 3 request for bluetooth and local network access
      img: require('@assets/bluetooth_devices_near.png'),
      header: t('Connection.step3.header'),
      text: t('Connection.step3.text'),
    },
    {
      // 4 checkBluetooth => true
      video: require('@assets/videos/connection.mp4'),
      header: t('Connection.step4.header'),
      text: t('Connection.step4.text'),
    },
    {
      // 5
      img: require('@assets/PICTURE_4.jpg'),
      header: t('Connection.step5.header'),
    },
    {
      // 6
      video: require('@assets/videos/pair.mp4'),
      header: t('Connection.step6.header'),
      text: t('Connection.step6.text'),
    },
    {
      // 7
      img: require('@assets/deviceImages/image-2.png'),
      header: t('Connection.step7.header'),
      text: t('Connection.step7.text'),
    },
    {
      // 8
      img: require('@assets/PICTURE_1.jpg'),
      header: t('Connection.step8.header'),
      text: t('Connection.step8.text'),
    },
    {
      // 9
      img: require('@assets/PICTURE_2.jpg'),
      header: t('Connection.step9.header'),
      text: t('Connection.step9.text'),
    },
    {
      // 10
      img: require('@assets/PICTURE_3.jpg'),
      header: t('Connection.step10.header'),
      text: '',
    },
    {
      // 11 no devices found
      video: require('@assets/videos/connection.mp4'),
      header: t('Connection.step11.header'),
      text: t('Connection.step11.text'),
    },
  ];

  const {
    readValue,
    connectToDevice,
    requestBluetoothPermission,
    scanForPeripherals,
    stopDeviceScan,
    cancelTransaction,
    allDevices,
  } = useBle();
  const [isScanning, setIsScanning] = useState(false);
  const [secondTimeOut, setSecondTimeOut] = useState(null);

  useEffect(() => {
    if (step === 5 && allDevices.length) {
      setStep(6);
      setIsScanning(false);
    }

    if (!allDevices.length && step === 5 && !secondTimeOut) {
      const second = setTimeout(() => {
        setIsScanning(false);
        stopDeviceScan();
        setStep(11);
        setSecondTimeOut(null);
      }, 10000);
      setSecondTimeOut(second);
    }
  }, [
    allDevices.length,
    scanForPeripherals,
    secondTimeOut,
    setStep,
    step,
    stopDeviceScan,
  ]);

  useEffect(() => {
    if (step === 6) {
      setIsScanning(false);
      clearTimeout(secondTimeOut);
      setSecondTimeOut(null);
    }
  }, [secondTimeOut, step]);

  const renderButton = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Button
              style={styles.buttonBottom}
              variant={'solid'}
              action={'primary'}
              size={'xl'}
              borderRadius="$lg"
              onPress={async () => {
                setStep(3);
                Platform.OS === 'ios'
                  ? Linking.openURL('App-Prefs:Bluetooth')
                  : Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
              }}>
              <Icon name="gears" style={styles.buttonBottomIcon} size={24} />
              <ButtonText fontSize={18} color="white">
                {t('Connection.openSettings')}
              </ButtonText>
            </Button>
          </>
        );
      case 3:
        return (
          <Button
            variant={'solid'}
            style={styles.buttonBottom}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              const permissionGranted = await requestBluetoothPermission();
              if (permissionGranted) {
                setStep(prev => prev + 1);
              }
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>{t('Connection.grantPermission')}</ButtonText>
          </Button>
        );
      case 4:
        return (
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={() => {
              setStep(5);
              scanForPeripherals();
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>{t('Connection.Done')}</ButtonText>
          </Button>
        );
      case 5:
        return (
          <LottieView
            source={require('@assets/lottie/Animation-1697316689983.lottie')}
            height={300}
            width={300}
            autoPlay
            loop
          />
        );
      case 6:
        return (
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              try {
                const device = await connectToDevice(allDevices[0]);

                await device.readCharacteristicForService('180A', '2A26');

                AsyncStorage.setItem('previos', JSON.stringify(device));
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
                            {t('Toast.success.connection')}
                          </ToastTitle>
                        </VStack>
                      </Toast>
                    );
                  },
                });
                setStep(9);
              } catch (error) {
                console.log(error);
                setStep(8);
              }
            }}>
            <ButtonText>{t('Connection.connectToDevice')}</ButtonText>
          </Button>
        );
      case 8:
        return (
          <>
            <Button
              disabled={isScanning}
              style={styles.buttonBottom}
              variant={'solid'}
              action={'primary'}
              size={'xl'}
              onPress={async () => {
                setStep(5);
                setIsScanning(true);
                scanForPeripherals();
              }}>
              <ButtonText>{t('Connection.Retry')}</ButtonText>
            </Button>
          </>
        );
      case 9:
        return (
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              try {
                const current = await readValue('firmwareRevision', true);
                const data = await getFirmwareData();
                const availableFirmware = data.find(
                  firmwareData => firmwareData.testAvailable,
                );

                const file = await getFileURL(
                  'firmware/' + availableFirmware.file,
                );
                setFilePath(file);
                setFileName(availableFirmware.file);

                if (!current || !availableFirmware) {
                  navigation.navigate('Settings');
                }

                if (availableFirmware.name === current) {
                  navigation.navigate('Settings');
                } else {
                  setStep(10);
                }
              } catch (error) {
                navigation.navigate('Settings');
              }
            }}>
            <ButtonText>{t('Connection.Great')}</ButtonText>
          </Button>
        );
      case 10:
        return (
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              setStep(3);
              navigation.navigate('UpdateFirmwareScreen', {
                fileName,
                filePath,
              });
            }}>
            <ButtonText>{t('Connection.update')}</ButtonText>
          </Button>
        );
      case 11:
        return (
          <>
            <Button
              disabled={isScanning}
              style={styles.buttonBottom}
              variant={'solid'}
              action={'primary'}
              size={'xl'}
              onPress={async () => {
                setStep(5);
                setIsScanning(true);
                scanForPeripherals();
              }}>
              <ButtonText>{t('Connection.Retry')}</ButtonText>
            </Button>
          </>
        );
      default:
        break;
    }
  };

  const background = stepsContent[step].video;
  return (
    <>
      {stepsContent[step].img ? (
        <Image
          source={stepsContent[step].img}
          w={'100%'}
          alt={'ImageStep' + step.toString()}
          minHeight={'$1/2'}
          role="img"
        />
      ) : null}
      {stepsContent[step].video ? (
        <Video
          source={background}
          style={styles.video}
          repeat
          resizeMode={Platform.OS === 'android' ? 'stretch' : 'none'}
        />
      ) : null}
      <View style={styles.stepTextContainer}>
        <Heading
          size="md"
          mt="$9"
          mb="$6"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{color: isDark ? 'white' : 'black'}}>
          {stepsContent[step].header}
        </Heading>
        {stepsContent[step].text ? (
          // eslint-disable-next-line react-native/no-inline-styles
          <ScrollView bounces={false}>
            <Text
              style={[
                styles.textColor,
                {color: isDark ? 'white' : 'black', marginBottom: 10},
              ]}>
              {stepsContent[step].text}
            </Text>
          </ScrollView>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        {renderButton()}
        <Button
          style={styles.goBackButton}
          variant={'solid'}
          action={'primary'}
          size={'xl'}
          onPress={async () => {
            navigation.navigate('Settings');
          }}>
          <ButtonText>{t('Connection.goBack')}</ButtonText>
        </Button>
      </View>
    </>
  );
};

const ConnectDeviceScreen = props => {
  const [step, setStep] = useState(1);
  const {requestBluetoothPermission, clearScans} = useBle();

  useEffect(() => {
    clearScans();
    initStep();
    async function initStep() {
      const bluetoothStatus = await BluetoothStateManager.getState();
      const isEnabled = bluetoothStatus === 'PoweredOn';
      if (!isEnabled) {
        setStep(1);
        return;
      }
      setStep(3);
      const isPermitted = await requestBluetoothPermission();
      if (!isPermitted) {
        return;
      }
      setStep(4);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper {...props} additionalContentContainerStyle={styles.container}>
      <StepItem step={step} setStep={setStep} navigation={props.navigation} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
  },
  stepTextContainer: {flex: 1, paddingHorizontal: 30},
  buttonBottom: {
    gap: 10,
    width: '100%',
  },
  buttonBottomIcon: {color: 'white'},
  textColor: {color: 'white'},
  buttonContainer: {paddingHorizontal: 30, gap: 15, alignItems: 'center'},
  goBackButton: {width: '50%'},
  video: {width: '100%', height: '50%'},
});

export default ConnectDeviceScreen;
