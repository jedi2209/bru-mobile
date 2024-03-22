import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
import {Image, Button, ButtonText, Heading} from '@gluestack-ui/themed';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useBle from '../../hooks/useBlePlx';

const stepsContent = [
  null,
  {
    // 1 checkBluetooth
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Activate bluetooth on your phone',
    text: 'This APP need access to bluetooth to be able search and communicate with BRU.',
  },
  {
    // 2 checkBluetooth => false
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Ooops...',
    text: "We need access to your phone's bluetooth to be able search and communicate with BRU.\r\n",
  },
  {
    // 3 request for bluetooth and local network access
    img: require('@assets/bluetooth_devices_near.png'),
    header: 'Bluetooth and Location access required',
    text: 'Bluetooth and Location permissions are required to find and control your nearby BRU device even when the app is not in use.\r\nWithout access things may not work as expected.',
  },
  {
    // 4 checkBluetooth => true
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Activate bluetooth on BRU',
    text: 'Please activate bluetooth on BRU device.\r\n\r\nTo do this go to Machine Setup => "Bluetooth" -> "On"',
  },
  {
    // 5
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Search for BRU Machine',
  },
  {
    // 6
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Ready for pairing',
    text: 'Cool! We found your BRU Machine!\r\n\r\nPlease activate pairing mode on BRU device.\r\nTo do this go to Machine Setup => "Pair New Device".\r\n\r\nAfter this step you must see "Waiting for connection" on BRU device display.',
  },
  {
    // 7
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Trying to connect...',
    text: 'Now we are trying to connect to your BRU Machine.\r\n\r\nPlease wait a few seconds.',
  },
  {
    // 8
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Ooops...',
    text: 'Please check your BRU Machine. You need to activate pairing mode on BRU device.\r\nTo do this go to Machine Setup => "Pair New Device".\r\n\r\nAfter this step you must see "Waiting for connection" on BRU device display.',
  },
  {
    // 9
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Success!',
    text: 'Your BRU Machine is successfully paired with your phone.\r\n\r\nNow you can use all features of BRU app',
  },
  {
    // 10
    img: require('@assets/deviceImages/image-2.png'),
    header: 'We need to update your BRU firmware!',
    text: '',
  },
];

const StepItem = ({step, setStep, navigation}) => {
  const {
    connectToDevice,
    requestBluetoothPermission,
    scanForPeripherals,
    allDevices,
    manager,
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
              <ButtonText color="white">Open settings</ButtonText>
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
            <ButtonText>Grant permissions</ButtonText>
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
            <ButtonText>Done</ButtonText>
          </Button>
        );
      case 5:
        return (
          <>
            {isScanning ? (
              <LottieView
                source={require('@assets/lottie/Animation-1697316689983.lottie')}
                height={220}
                autoPlay
                loop
              />
            ) : null}
            <Button
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
                    setIsScanning(false);
                    manager.stopDeviceScan();
                    console.log('No devices found');
                  }
                }, 10000);
              }}>
              <ButtonText>Scan</ButtonText>
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
                setStep(9);
              } catch (error) {
                console.log(error);
                setStep(8);
              }
            }}>
            <ButtonText>Connect to device</ButtonText>
          </Button>
        );
      case 9:
        return (
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              navigation.navigate('Settings');
            }}>
            <ButtonText>Great</ButtonText>
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
        <Heading size="md" mt="$9" mb="$6">
          {stepsContent[step].header}
        </Heading>
        {stepsContent[step].text ? (
          <Text style={styles.textColor}>{stepsContent[step].text}</Text>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>{renderButton()}</View>
    </>
  );
};

const ConnectDeviceScreen = props => {
  const [step, setStep] = useState(1);
  const {requestBluetoothPermission, clearScans} = useBle();
  console.log(props);
  useEffect(() => {
    clearScans();
    async function initStep() {
      const bluetoothStatus = await BluetoothStateManager.getState();
      const isEnabled = bluetoothStatus === 'PoweredOn';
      if (!isEnabled) {
        setStep(1);
        return;
      }
      const isPermitted = await requestBluetoothPermission();
      if (!isPermitted) {
        setStep(3);
        return;
      }
      setStep(4);
    }
    initStep();
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
  stepTextContainer: {flex: 1, paddingHorizontal: 30, paddingBottom: 30},
  buttonBottom: {
    gap: 10,
  },
  buttonBottomIcon: {color: 'white'},
  textColor: {color: 'white'},
  buttonContainer: {paddingHorizontal: 30},
});

export default ConnectDeviceScreen;
