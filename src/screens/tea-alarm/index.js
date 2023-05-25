import {useState} from 'react';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Wrapper from '@comp/Wrapper';

import {fetchLang} from '@store/lang';

import {colors} from '@styleConst';

const TeaAlarmScreen = props => {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(null);

  fetchLang().then(res => {
    setLang(res);
    setLoading(false);
  });
  if (loading) {
    return;
  }
  return (
    <Wrapper {...props}>
      <Text>{lang}</Text>
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

export default TeaAlarmScreen;