import auth from '@react-native-firebase/auth';
import {setUser} from '../core/store/user';
import {createUser} from './db/auth';
import Toast from 'react-native-toast-message';

export const signUpWithEmailAndPassword = async (email, password, name) => {
  try {
    const user = await auth().createUserWithEmailAndPassword(email, password);
    if (user) {
      const newUser = await createUser({...user.user, name});
      setUser(newUser);
    }
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Toast.show({
        type: 'error',
        text1: 'That email address is already in use!',
      });
    }

    console.error(error);
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  const user = await auth().signInWithEmailAndPassword(email, password);
  return user;
};

export const signInWithGoogle = async () => {
  // GoogleSignin.configure({webClientId: '',});
};

export const isSignedIn = async () => {
  auth().onAuthStateChanged(user => {
    setUser(user);
  });
};

export const logout = async () => {
  await auth().signOut();
};

export const updatePassword = async password => {
  const user = auth().currentUser;
  try {
    await user.updatePassword(password);
  } catch (error) {
    console.log(error.code);
  }
};

export const updateEmail = async email => {
  const user = auth().currentUser;
  try {
    await user.updateEmail(email);
  } catch (error) {
    Toast.show({type: 'error', text1: error.message.split('] ')[1]});
  }
};
