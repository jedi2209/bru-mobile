import React, {useState} from 'react';
import {RefreshControl, View, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {Button, ButtonText, Text} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {$deviceSettingsStore} from '@store/device';
import {$currentFirmwareStore} from '@store/firmware';
import {$langSettingsStore} from '@store/lang';
import Wrapper from '@comp/Wrapper';

import {fetchFirmwareMeta, getTextFromFirmware} from '@utils/firmware';

import {get} from 'lodash';
import {colors} from '@styleConst';

const UpdateFirmwareScreen = props => {
  let devices = useStore($deviceSettingsStore);
  let device = {};
  if (get(devices, 'length') === 1 && get(devices, '0.isCurrent', false)) {
    device = devices[0];
  }
  if (!get(device, 'id', false) && get(props, 'route.params.device', false)) {
    device = props.route.params.device;
  }
  const firmware = useStore($currentFirmwareStore);
  const lang = useStore($langSettingsStore);

  const [isRefreshing, setRefreshing] = useState(false);

  if (!get(device, 'id')) {
    props.navigation.goBack();
    return false;
  }

  const _onRefresh = async () => {
    setRefreshing(true);
    await fetchFirmwareMeta();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  if (!get(firmware, 'data', null) || isRefreshing) {
    return (
      <Wrapper {...props}>
        <ActivityIndicator
          size="medium"
          color="white"
          style={{marginTop: '20%'}}
        />
      </Wrapper>
    );
  }

  let i = 0;
  let isLast = false;

  return (
    <Wrapper
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={_onRefresh}
          tintColor="#fff"
        />
      }
      {...props}>
      {get(firmware, 'data', []).map(item => {
        const {id: itemID, description, available} = item;
        if (!available) {
          return;
        }
        const file = get(item.file, lang, get(item.file, 'en', item.file));
        const name = get(item.name, lang, get(item.name, 'en', item.name));

        const descriptionBase = getTextFromFirmware(description, 'base', lang);
        const descriptionBugFix = getTextFromFirmware(
          description,
          'bugfix',
          lang,
        );
        const descriptionFeatures = getTextFromFirmware(
          description,
          'features',
          lang,
        );

        i++;

        if (i === get(firmware, 'data.length', null)) {
          isLast = true;
        }
        return (
          <View
            key={itemID}
            style={[
              styles.firmwareWrapper,
              isLast ? styles.firmwareWrapperLast : {},
            ]}>
            <Text fontSize={24}>{[name].join(' -- ')}</Text>
            {descriptionBase ? (
              <View style={{marginVertical: 8}}>
                <Text fontWeight="$bold">Base</Text>
                <Text>{descriptionBase}</Text>
              </View>
            ) : null}
            {descriptionFeatures ? (
              <View style={{marginVertical: 8}}>
                <Text fontWeight="$bold">New Features</Text>
                <Text>{descriptionFeatures}</Text>
              </View>
            ) : null}
            {descriptionBugFix ? (
              <View style={{marginVertical: 8}}>
                <Text fontWeight="$bold">Bugfix</Text>
                <Text>{descriptionBugFix}</Text>
              </View>
            ) : null}
            <Button
              size="md"
              variant="solid"
              action="primary"
              mt={4}
              isDisabled={false}
              isFocusVisible={false}
              onPress={() => {
                Alert.alert(
                  'Are you sure?',
                  'This will update your BRU device.\r\nPlease do not close the app.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Update',
                      isPreferred: true,
                      style: 'destructive',
                      onPress: async () => {
                        props.navigation.navigate(
                          'UpdateFirmwareProgressScreen',
                          {device, file},
                        );
                      },
                    },
                  ],
                );
              }}>
              <ButtonText>Update</ButtonText>
            </Button>
          </View>
        );
      })}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  statusWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    marginTop: 200,
    width: '100%',
    paddingHorizontal: '5%',
  },
  firmwareWrapper: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
  },
  firmwareWrapperLast: {
    marginBottom: 70,
  },
});

export default UpdateFirmwareScreen;
