import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
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

const StepItem = ({step, setStep, navigation}) => {
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [currentFirmware, setCurrentFirmware] = useState('');
  const theme = useStore($themeStore);
  const isDark = theme === 'dark';

  const toast = useToast();
  const {t} = useTranslation();
  const stepsContent = [
    null,
    {
      // 1 checkBluetooth
      img: require('@assets/deviceImages/image-1.png'),
      header: t('Connection.step1.header'),
      text: t('Connection.step1.text'),
    },
    {
      // 2 checkBluetooth => false
      img: require('@assets/deviceImages/image-2.png'),
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
      img: require('@assets/deviceImages/image-1.png'),
      header: t('Connection.step4.header'),
      text: t('Connection.step4.text'),
    },
    {
      // 5
      img: require('@assets/deviceImages/image-1.png'),
      header: t('Connection.step5.header'),
    },
    {
      // 6
      img: require('@assets/deviceImages/image-2.png'),
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
      img: require('@assets/deviceImages/image-1.png'),
      header: t('Connection.step8.header'),
      text: t('Connection.step8.text'),
    },
    {
      // 9
      img: require('@assets/deviceImages/image-2.png'),
      header: t('Connection.step9.header'),
      text: t('Connection.step9.text'),
    },
    {
      // 10
      img: require('@assets/deviceImages/image-2.png'),
      header: t('Connection.step10.header'),
      text: '',
    },
  ];

  const {
    readValue,
    connectToDevice,
    requestBluetoothPermission,
    scanForPeripherals,
    stopDeviceScan,
    allDevices,
  } = useBle();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (step === 5 && allDevices.length) {
      setStep(6);
      setIsScanning(false);
    }
  }, [allDevices.length, setStep, step]);

  const renderButton = () => {
    switch (step) {
      case 1:
        return (
          <>
            <LottieView
              source={
                Platform.OS === 'android'
                  ? require('@assets/lottie/Animation-1697319770697.lottie')
                  : require('@assets/lottie/Animation-1698061078225.lottie')
              }
              height={200}
              autoPlay
              loop
            />
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
            onPress={async () => {
              setStep(5);
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
          <>
            {isScanning ? (
              <LottieView
                source={require('@assets/lottie/Animation-1697316689983.lottie')}
                height={240}
                autoPlay
                loop
              />
            ) : null}
            <Button
              disabled={isScanning}
              style={styles.buttonBottom}
              variant={'solid'}
              action={'primary'}
              size={'xl'}
              onPress={async () => {
                setIsScanning(true);
                scanForPeripherals();

                if (allDevices.length) {
                  setStep(6);
                }
                setTimeout(() => {
                  if (!allDevices.length) {
                    stopDeviceScan();
                    scanForPeripherals();
                    setTimeout(() => {
                      if (!allDevices.length) {
                        setIsScanning(false);
                        stopDeviceScan();
                        setStep(8);
                      }
                    }, 10000);
                  }
                }, 10000);
              }}>
              <ButtonText>{t('Connection.Scan')}</ButtonText>
            </Button>
          </>
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
                await connectToDevice(allDevices[0]);
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
                setIsScanning(true);
                scanForPeripherals();

                if (allDevices.length) {
                  setStep(6);
                }
                setTimeout(() => {
                  if (!allDevices.length) {
                    stopDeviceScan();
                    scanForPeripherals();
                    setTimeout(() => {
                      if (!allDevices.length) {
                        setIsScanning(false);
                        stopDeviceScan();
                        setStep(8);
                      }
                    }, 10000);
                  }
                }, 10000);
              }}>
              <ButtonText>{t('Connection.Scan')}</ButtonText>
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
              const current = await readValue('firmwareRevision');
              setCurrentFirmware(current);
              const data = await getFirmwareData();
              const availableFirmware = data.find(
                firmwareData => firmwareData.testAvailable,
              );

              if (!current) {
                return;
              }
              if (!availableFirmware) {
                return;
              }

              const file = await getFileURL(
                'firmware/' + availableFirmware.file,
              );
              setFilePath(file);
              setFileName(availableFirmware.file);
              if (availableFirmware.name === current) {
                navigation.navigate('Settings');
              } else {
                setStep(10);
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
              setStep(2);
              navigation.navigate('UpdateFirmwareScreen', {
                fileName,
                filePath,
              });
            }}>
            <ButtonText>{t('Connection.update')}</ButtonText>
          </Button>
        );
      default:
        break;
    }
  };

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
          <Text style={[styles.textColor, {color: isDark ? 'white' : 'black'}]}>
            {stepsContent[step].text}
          </Text>
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
  },
  buttonBottomIcon: {color: 'white'},
  textColor: {color: 'white'},
  buttonContainer: {paddingHorizontal: 30, gap: 15},
  goBackButton: {},
});

export default ConnectDeviceScreen;
