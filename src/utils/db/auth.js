import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {setProfileUser} from '../../core/store/profile';
export const usersCollection = firestore().collection('users');
export const getUsers = async () => {
  const users = await firestore().collection('users').get();
  return users;
};
export const getCurrentUser = async () => {
  const uid = auth().currentUser.uid;
  const user = await usersCollection.doc(uid).get();
  return {...user._data, uid};
};

export const createUser = async user => {
  const {uid, email} = user;
  const newUser = await usersCollection.doc(uid).set({
    email,
    name: '',
  });

  return newUser;
};

export const updateUser = async (uid, userData) => {
  const newUser = await usersCollection.doc(uid).update(userData);
  console.log(newUser, 'newUsernewUsernewUsernewUser');
  setProfileUser({uid, ...userData});
  return newUser;
};
