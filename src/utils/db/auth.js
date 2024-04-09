import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {updateProfileUser} from '../../core/store/profile';
import storage from '@react-native-firebase/storage';

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

export const createUser = async (user, uid) => {
  try {
    if (user) {
      const {uid: userUID, email} = user._user;
      const newUser = await usersCollection.doc(userUID).set({
        email: email || '',
        name: '',
        img: '',
      });

      return newUser;
    }
    if (uid) {
      const newUser = await usersCollection.doc(uid).set({
        email: '',
        name: '',
        img: '',
      });

      return newUser;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (uid, userData) => {
  try {
    await usersCollection.doc(uid).update(userData);
    updateProfileUser({uid, ...userData});
  } catch (error) {
    console.log(error, 'updateUser');
  }
};

export const uploadImage = async (uri, name) => {
  const imageRef = storage().ref(`images/${name}`);
  await imageRef.putFile(uri, {contentType: 'image/jpg'}).catch(error => {
    throw error;
  });
  const url = await imageRef.getDownloadURL().catch(error => {
    throw error;
  });
  return url;
};
