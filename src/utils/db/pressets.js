import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const pressetsCollection = firestore().collection('pressets');
const uid = auth().currentUser.uid;
export const getUserPressets = async () => {
  try {
    const pressets = await pressetsCollection
      .doc(uid)
      .collection('pressets')
      .get();

    return pressets.docs.map(presset => {
      return {
        id: presset.id,
        ...presset.data(),
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export const addPresset = async presset => {
  try {
    const newPresset = await pressetsCollection
      .doc(uid)
      .collection('pressets')
      .add(presset);
    const id = newPresset.id;
    return {id, ...presset};
  } catch (error) {
    console.log(error);
  }
};

export const updatePresset = async newPresset => {
  try {
    await pressetsCollection
      .doc(uid)
      .collection('pressets')
      .doc(newPresset.id)
      .update(newPresset);

    return {id: newPresset.id, ...newPresset};
  } catch (error) {
    console.log(error);
  }
};

export const deletePresset = async id => {
  await pressetsCollection.doc(uid).collection('pressets').doc(id).delete();
};
