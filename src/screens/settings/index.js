import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-paper';
import {useStore} from 'effector-react';

import {$langSettingsStore, setLanguage} from '@store/lang';

import Wrapper from '@comp/Wrapper';

import {colors} from '@styleConst';

const SettingsScreen = props => {
  const lang = useStore($langSettingsStore);
  return (
    <Wrapper {...props}>
      <Text>{lang}</Text>
      <Button onPress={() => setLanguage('en')}>EN</Button>
      <Button onPress={() => setLanguage('de')}>DE</Button>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
    </Wrapper>
  );
};

export default SettingsScreen;
