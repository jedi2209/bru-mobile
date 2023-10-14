import React, {useState, useEffect} from 'react';
import {Platform, View, StyleSheet, Alert, useColorScheme} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  Text,
  Image,
  Heading,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

import {useStore} from 'effector-react';
import {$deviceSettingsStore, setDevice} from '@store/device';
import Wrapper from '@comp/Wrapper';
import DeviceScanner from '@comp/DeviceScanner';
import LottieView from 'lottie-react-native';

import {Device, sleep} from '@utils/device';

import {get} from 'lodash';
import {colors} from '@styleConst';

import {DEVICE_MANAGER_CONFIG} from '@const';

const isAndroid = Platform.OS === 'android';

const deviceManager = new Device(DEVICE_MANAGER_CONFIG);

const stepsContent = [
  null,
  {
    // 1
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Connect the power',
    text: 'Place BRU Machine on the leveled surface. Connect the power cord, plug it into the mains outlet.',
  },
  {
    // 2
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Activate bluetooth',
    text: 'Please activate bluetooth on your phone and BRU device.\r\n\r\nTo do this go to Machine Setup => "Bluetooth" -> "On"',
  },
  {
    // 3
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Search for BRU Machine',
  },
  {
    // 4
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Ready for pairing',
    text: 'Cool! We found your BRU Machine!\r\n\r\nPlease activate pairing mode on BRU device.\r\nTo do this go to Machine Setup => "Pair New Device".\r\n\r\nAfter this step you must see "Waiting for connection" on BRU device display.',
  },
  {
    // 5
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Trying to connect...',
    text: 'Now we are trying to connect to your BRU Machine.\r\n\r\nPlease wait a few seconds.',
  },
  {
    // 6
    img: require('@assets/deviceImages/image-1.png'),
    header: 'Ooops...',
    text: 'Please check your BRU Machine. You need to activate pairing mode on BRU device.\r\nTo do this go to Machine Setup => "Pair New Device".\r\n\r\nAfter this step you must see "Waiting for connection" on BRU device display.',
  },
  {
    // 7
    img: require('@assets/deviceImages/image-2.png'),
    header: 'Success!',
    text: 'Your BRU Machine is successfully paired with your phone.\r\n\r\nNow you can use all features of BRU app',
  },
];

const _pairDevice = async itemID => {
  if (!itemID) {
    return false;
  }
  const deviceInfo = await deviceManager.connectToDevice(itemID);
  const deviceStatus = deviceManager.getPeripherals(itemID);
  if (deviceInfo) {
    if (get(deviceStatus, 'connected')) {
      const bondedStatus = await deviceManager.checkBondedStatus(itemID, 0, 3);
      // console.log('bondedStatus', bondedStatus);
      if (bondedStatus === true) {
        deviceManager.setCurrentDevice(deviceInfo);
        // Get device hardwareRevision and firmwareRevision
        const hardwareRevision = await deviceManager.handleReadData(
          'hardwareRevision',
        );
        if (hardwareRevision) {
          deviceInfo.hardwareRevision = hardwareRevision;
        }
        const firmwareRevision = await deviceManager.handleReadData(
          'firmwareRevision',
        );
        if (firmwareRevision) {
          deviceInfo.firmwareRevision = firmwareRevision;
        }
        deviceInfo.isCurrent = true;
        // console.info('============= _pairDevice deviceInfo =============', deviceInfo);
        setDevice(deviceInfo);
      }
      if (isAndroid) {
        await sleep(10 * 1000); // wait 10 seconds for Android bonding
      }
      return bondedStatus;
    } else {
      Alert.alert(
        'Connection error',
        '\r\nMake sure that you choose "Pair New Device" from 🛠️Machine Setup menu on BRU device',
      );
    }
  }
};

const _renderStep = ({step, setStep, item, setItem, navigation}) => {
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
      );
    case 2:
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
        <DeviceScanner
          autoScan={true}
          onItemPress={itemSelected => {
            setTimeout(() => setItem(itemSelected), 500);
            setTimeout(() => setStep(step + 1), 500);
          }}
        />
      );
    case 4:
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
    case 5:
      setIsLoadingLocal(true);
      _pairDevice(get(item, 'id')).then(res => {
        if (res) {
          setStep(step + 2);
        } else {
          setStep(step + 1);
        }
        setIsLoadingLocal(false);
      });
    case 6:
      return (
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
      );
    case 7:
      return (
        <Button
          style={styles.buttonBottom}
          size={'xl'}
          onPress={() => {
            navigation.navigate('NavBottom', {screen: 'Settings'});
          }}>
          <Icon
            name="check-square-o"
            style={styles.buttonBottomIcon}
            size={24}
          />
          <ButtonText>Great!</ButtonText>
        </Button>
      );
  }
};

const IntroBlock = props => {
  const {step, setStep, item, setItem, navigation} = props;
  const phoneTheme = useColorScheme();
  return (
    <View style={{flex: 1}}>
      {get(stepsContent[step], 'img', null) ? (
        <Image
          source={get(stepsContent[step], 'img')}
          w={'100%'}
          alt={'ImageStep' + step}
          minHeight={'$1/2'}
        />
      ) : null}
      <View style={{flex: 1, paddingHorizontal: 30, paddingBottom: 30}}>
        <Heading size="md" mt="$2" mb="$6">
          {get(stepsContent[step], 'header', '')}
        </Heading>
        {get(stepsContent[step], 'header', null) ? (
          <Text>{get(stepsContent[step], 'text', '')}</Text>
        ) : null}
        {_renderStep({step, setStep, item, setItem, navigation})}
      </View>
    </View>
  );
};

const AddNewDeviceScreen = props => {
  const [step, setStep] = useState(1);
  const [item, setItem] = useState(null);
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    deviceManager._checkManager();
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
