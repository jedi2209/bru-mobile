import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreenTop = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color="#900" />
    </View>
  );
};

const DetailsScreenTop = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

const NavMain = props => {
  return (
    <Stack.Navigator {...props}>
      <Stack.Screen name="HomeTop" component={HomeScreenTop} />
      <Stack.Screen name="DetailsTop" component={DetailsScreenTop} />
    </Stack.Navigator>
  );
};

export default NavMain;
