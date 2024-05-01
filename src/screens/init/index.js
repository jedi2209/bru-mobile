import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../core/const/style';
import auth from '@react-native-firebase/auth';

import {Text} from 'react-native';
import Logo from '../../core/components/icons/Logo';
import {anonymousSignIn} from '../../utils/auth';
import {addInitPressets} from '../../utils/db/pressets';
import {getPressetsFx} from '../../core/store/pressets';

const InitializeScreen = () => {
  useEffect(() => {
    async function signIn() {
      const isAuth = auth().currentUser;
      if (!isAuth) {
        const user = await anonymousSignIn();
        await addInitPressets(user.user.uid);
        await getPressetsFx();
      }
    }
    signIn();
  }, []);

  return (
    <View style={s.container}>
      <View style={s.wrapper}>
        <Logo width={150} height={150} />
        <Text style={s.socialButtonText}>Initializing your BRU app</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: colors.black,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 40,
    fontSize: 30,
  },
});

export default InitializeScreen;
