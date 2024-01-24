import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {setUser} from '../core/store/user';
import {createUser} from './db/auth';

export const signUpWithEmailAndPassword = async (email, password, name) => {
  try {
    const user = await auth().createUserWithEmailAndPassword(email, password);
    if (user) {
      const newUser = await createUser({...user.user, name});
      setUser(newUser);
    }
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Signed in successfully');
    });
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
  setUser(null);
};

export const updatePassword = async password => {
  const user = auth().currentUser;
  await user.updatePassword(password);
};

export const updateEmail = async email => {
  const user = auth().currentUser;
  await user.updateEmail(email);
};
