import React, {useState, useEffect} from 'react';
import {Platform, View, StyleSheet, Alert, Linking} from 'react-native';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {ActivityIndicator} from 'react-native-paper';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonGroup,
  Text,
  Image,
  Heading,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

import {setDevice} from '@store/device';
import Wrapper from '@comp/Wrapper';
import DeviceScanner from '@comp/DeviceScanner';
import LottieView from 'lottie-react-native';

import {deviceManager, sleep} from '@utils/device';
// import {Device, sleep} from '@utils/device';
// import {DEVICE_MANAGER_CONFIG} from '@const';
// const deviceManager = new Device(DEVICE_MANAGER_CONFIG);

import {get} from 'lodash';
import {colors} from '@styleConst';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {check, PERMISSIONS} from 'react-native-permissions';
import {$deviceSettingsStore} from '../../core/store/device';
import {$currentFirmwareStore} from '../../core/store/firmware';
import {getFirmwareData} from '../../utils/firmware';

const isAndroid = Platform.OS === 'android';

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

const _pairDevice = async itemID => {
  if (!itemID) {
    console.error('_pairDevice !itemID', itemID);
    return false;
  }
  const deviceInfo = await deviceManager.connectToDevice(itemID);
  console.info('_pairDevice => deviceInfo', deviceInfo);
  if (!deviceInfo) {
    return false;
  }
  const deviceStatus = deviceManager.getPeripherals(itemID);
  console.info('_pairDevice => deviceStatus', deviceStatus);
  if (get(deviceStatus, 'connected')) {
    let bondedStatus = null;
    if (isAndroid) {
      await sleep(3 * 1000); // wait 5 seconds for Android bonding
      bondedStatus = await deviceManager.checkBondedStatus(itemID, 0, 3);
    } else {
      bondedStatus = await deviceManager.checkBondedStatus(itemID, 0, 3);
    }
    console.log('_pairDevice => bondedStatus', bondedStatus);
    if (bondedStatus === true) {
      deviceManager.setCurrentDevice(deviceInfo);
      // Get device hardwareRevision and firmwareRevision
      const hardwareRevision = await deviceManager.handleReadData(
        'hardwareRevision',
      );
      console.info('hardwareRevision', hardwareRevision);
      if (hardwareRevision) {
        deviceInfo.hardwareRevision = hardwareRevision;
      }
      const firmwareRevision = await deviceManager.handleReadData(
        'firmwareRevision',
      );
      console.info('firmwareRevision', firmwareRevision);
      if (firmwareRevision) {
        deviceInfo.firmwareRevision = firmwareRevision;
      }
      deviceInfo.isCurrent = true;
      // console.info('============= _pairDevice deviceInfo =============', deviceInfo);
      setDevice(deviceInfo);
    }
    return bondedStatus;
  } else {
    Alert.alert(
      'Connection error',
      '\r\nMake sure that you choose "Pair New Device" from 🛠️Machine Setup menu on BRU device',
    );
  }
  return false;
};

const _renderStep = ({step, setStep, item, setItem, navigation, device}) => {
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  if (isLoadingLocal) {
    return (
      <>
        <Button
          variant="solid"
          action="primary"
          disabled={isLoadingLocal}
          style={styles.buttonBottom}
          size={'xl'}>
          <ButtonSpinner
            color={colors.white}
            size={'large'}
            style={styles.buttonBottomIcon}
          />
        </Button>
      </>
    );
  }
  switch (step) {
    case 1:
      return (
        <>
          <LottieView
            source={
              isAndroid
                ? require('@assets/lottie/Animation-1697319770697.lottie')
                : require('@assets/lottie/Animation-1697319484663.lottie')
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
            onPress={async () => {
              if (Platform.OS === 'android') {
                const firstPermition = await check(
                  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                );
                const secondPermition = await check(
                  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                );
                const thirdPermition = await check(
                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
                const permissions = [
                  firstPermition,
                  secondPermition,
                  thirdPermition,
                ];
                if (!permissions.some(perm => perm !== 'granted')) {
                  setStep(4);
                } else {
                  setStep(3);
                }
              } else {
                const result = await check(
                  PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
                );

                if (result === 'granted') {
                  setStep(4);
                } else {
                  setStep(3);
                }
              }
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>Done</ButtonText>
          </Button>
        </>
      );
    case 2:
      return (
        <>
          <LottieView
            source={
              isAndroid
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
            onPress={() => {
              setStep(step - 1);
              Platform.OS === 'ios'
                ? Linking.openURL('App-Prefs:Bluetooth')
                : Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
            }}>
            <Icon name="gears" style={styles.buttonBottomIcon} size={24} />
            <ButtonText>Open settings</ButtonText>
          </Button>
        </>
      );
    case 4:
      return (
        <>
          <LottieView
            source={require('@assets/lottie/Animation-1698061526398.lottie')}
            height={200}
            autoPlay
            loop
          />
          <Button
            style={styles.buttonBottom}
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={() => {
              setStep(step + 1);
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>Done</ButtonText>
          </Button>
        </>
      );
    case 3:
      return (
        <ButtonGroup style={styles.buttonBottom}>
          <Button
            variant={'solid'}
            action={'primary'}
            size={'xl'}
            onPress={async () => {
              const permissionGranted =
                await deviceManager._handlePermissions();
              if (permissionGranted) {
                setStep(prev => prev + 1);
              }
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>OK</ButtonText>
          </Button>
          <Button
            // style={styles.buttonBottom}
            variant={'solid'}
            action={'negative'}
            size={'xl'}
            onPress={() => {
              navigation.goBack();
            }}>
            <IconMaterial
              name="cancel"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>NO!</ButtonText>
          </Button>
        </ButtonGroup>
      );
    case 5:
      return (
        <DeviceScanner
          autoScan={true}
          onItemPress={itemSelected => {
            setTimeout(() => setItem(itemSelected), 500);
            setTimeout(() => setStep(step + 1), 500);
          }}
        />
      );
    case 6:
      return (
        <Button
          style={styles.buttonBottom}
          size={'xl'}
          onPress={() => {
            setStep(step + 1);
          }}>
          <Icon
            name="check-square-o"
            style={styles.buttonBottomIcon}
            size={24}
          />
          <ButtonText>Ready to connect!</ButtonText>
        </Button>
      );
    case 7:
      setIsLoadingLocal(true);
      _pairDevice(get(item, 'id'))
        .then(res => {
          console.info('_pairDevice then res', res);
          if (res) {
            setStep(step + 2);
          } else {
            setStep(step + 1);
          }
          setIsLoadingLocal(false);
        })
        .catch(err => {
          console.error('_pairDevice err', err);
        });
    case 8:
      return (
        <>
          <Button
            style={styles.buttonBottom}
            size={'xl'}
            onPress={() => {
              setStep(step - 1);
            }}>
            <Icon
              name="check-square-o"
              style={styles.buttonBottomIcon}
              size={24}
            />
            <ButtonText>Ready to connect!</ButtonText>
          </Button>
          <Button
            style={styles.buttonBottom}
            size={'xl'}
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>Go Back</ButtonText>
          </Button>
        </>
      );
    case 9:
      return (
        <Button
          style={styles.buttonBottom}
          size={'xl'}
          onPress={async () => {
            const deviceFirmwareVersion =
              await deviceManager._readDataFromBleDevice('firmwareRevision');
            console.log(deviceFirmwareVersion, deviceFirmwareVersion);
            const data = await getFirmwareData();
            const availableFirmware = data.find(
              firmwareData => firmwareData.testAvailable,
            );
            const file = availableFirmware.file;
            if (!deviceFirmwareVersion) {
              console.error("Can't get device firmware");
              return;
            }
            if (!availableFirmware) {
              console.error('Something wrong at our server');
              return;
            }
            console.log(availableFirmware, deviceFirmwareVersion);
            if (availableFirmware.name !== deviceFirmwareVersion) {
              setStep(10);
            } else {
              navigation.navigate('NavBottom', {screen: 'Settings'});
            }
          }}>
          <Icon
            name="check-square-o"
            style={styles.buttonBottomIcon}
            size={24}
          />
          <ButtonText>Great!</ButtonText>
        </Button>
      );
    case 10:
      return (
        <Button
          style={styles.buttonBottom}
          size={'xl'}
          onPress={async () => {
            try {
              const deviceFirmwareVersion =
                await deviceManager._readDataFromBleDevice('firmwareRevision');
              const data = await getFirmwareData();
              const availableFirmware = data.find(
                firmwareData => firmwareData.testAvailable,
              );
              const file = availableFirmware.file;

              navigation.navigate('UpdateFirmwareProgressScreen', {
                device,
                file,
              });
            } catch (error) {
              console.log(error);
            }
          }}>
          <Icon
            name="check-square-o"
            style={styles.buttonBottomIcon}
            size={24}
          />
          <ButtonText>OK</ButtonText>
        </Button>
      );
  }
};

const IntroBlock = props => {
  const {step, setStep, item, setItem, navigation} = props;
  const theme = useStore($themeStore);
  let devices = useStore($deviceSettingsStore);
  let device = {};
  if (get(devices, 'length') === 1 && get(devices, '0.isCurrent', false)) {
    device = devices[0];
  }
  if (!get(device, 'id', false) && get(props, 'route.params.device', false)) {
    device = props.route.params.device;
  }
  const firmware = useStore($currentFirmwareStore);

  return (
    <View style={{flex: 1}}>
      {get(stepsContent[step], 'img', null) ? (
        <Image
          source={get(stepsContent[step], 'img')}
          w={'100%'}
          alt={'ImageStep' + step}
          minHeight={'$1/2'}
          role="img"
        />
      ) : null}
      <View style={{flex: 1, paddingHorizontal: 30, paddingBottom: 30}}>
        <Heading size="md" mt="$9" mb="$6">
          {get(stepsContent[step], 'header', '')}
        </Heading>
        {get(stepsContent[step], 'header', null) ? (
          <Text>{get(stepsContent[step], 'text', '')}</Text>
        ) : null}
        {_renderStep({step, setStep, item, setItem, navigation, device})}
      </View>
    </View>
  );
};

const AddNewDeviceScreen = props => {
  const [step, setStep] = useState(1);
  const [item, setItem] = useState(null);
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    async function setInitStep() {
      try {
        const status = await deviceManager._handleBluetoothState();
        if (status !== 'granted') {
          setStep(2);
        }
        if (Platform.OS === 'android') {
          const firstPermition = await check(
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          );
          const secondPermition = await check(
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          );
          const thirdPermition = await check(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );
          const permissions = [firstPermition, secondPermition, thirdPermition];
          if (!permissions.some(item => item !== 'granted')) {
            setStep(4);
            return;
          } else {
            setStep(3);
            return;
          }
        } else {
          const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
          if (result === 'granted') {
            setStep(4);
            return;
          } else {
            setStep(3);
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    setInitStep();
  }, []);

  useEffect(() => {
    return () => {
      setStep(1);
    };
  }, []);

  return (
    <Wrapper
      {...props}
      additionalContentContainerStyle={{
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
      }}>
      {isloading ? (
        <ActivityIndicator size="large" color={colors.green.mid} />
      ) : (
        <IntroBlock
          step={step}
          setStep={setStep}
          item={item}
          setItem={setItem}
          setLoading={setLoading}
          navigation={props.navigation}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginHorizontal: 30,
  },
  buttonBottomIcon: {
    marginHorizontal: 12,
    color: colors.white,
  },
});

export default AddNewDeviceScreen;
