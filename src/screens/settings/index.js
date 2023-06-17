import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {Button} from 'react-native-paper';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import {Select, HStack} from '@gluestack';
import {useStore} from 'effector-react';

import {$langSettingsStore, setLanguage} from '@store/lang';

import Wrapper from '@comp/Wrapper';

import {colors} from '@styleConst';

const SettingsScreen = props => {
  const lang = useStore($langSettingsStore);

  BleManager.enableBluetooth()
    .then(() => {
      // Success code
      alert('The bluetooth is already enabled or the user confirm');
      BleManager.start({showAlert: false}).then(() => {
        // Success code
        alert('Module initialized');
        BleManager.scan([], 10, true).then(() => {
          // Success code
          alert('Scan started');
          BleManager.getDiscoveredPeripherals([]).then(peripheralsArray => {
            // Success code
            alert('Discovered peripherals: ' + peripheralsArray.length);
          });
          BleManager.checkState().then(state =>
            alert(`current BLE state = '${state}'.`),
          );
        });
      });
    })
    .catch(error => {
      // Failure code
      alert('The user refuse to enable bluetooth');
    });

  return (
    <Wrapper {...props}>
      <HStack>
        <Text>{lang}</Text>
        <Select
          isDisabled={false}
          isInvalid={false}
          onValueChange={res => setLanguage(res)}>
          <Select.Trigger>
            <Select.Input placeholder="Select language" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Backdrop />
            <Select.Content>
              <Select.DragIndicatorWrapper>
                <Select.DragIndicator />
              </Select.DragIndicatorWrapper>
              <Select.Item label="EN" value="en" />
              <Select.Item label="DE" value="de" />
            </Select.Content>
          </Select.Portal>
        </Select>
      </HStack>
      {/* <Button
        mt="$4"
        size="sm"
        variant="outline"
        onPress={() => setLanguage('en')}>
        <Button.Text>EN</Button.Text>
      </Button>
      <Button
        mt="$4"
        size="sm"
        type="primary"
        onPress={() => setLanguage('de')}>
        <Button.Text>DE</Button.Text>
      </Button> */}
    </Wrapper>
  );
};

export default SettingsScreen;
