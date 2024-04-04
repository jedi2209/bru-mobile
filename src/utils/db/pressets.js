import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export const pressetsCollection = firestore().collection('pressets');

const initPressets = [
  {
    brewing_data: {
      time: {label: '51m', value: 100, seconds: 3060},
      waterAmount: 1,
      temperature: 4,
    },
    cleaning: false,
    id: 'green_tea',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fgreen_tea.png?alt=media&token=a2e797e9-9e91-49bc-b309-7c257c707712',
    tea_type: 'Green Tea',
  },
  {
    brewing_data: {
      time: {label: '52m', value: 101, seconds: 3120},
      waterAmount: 2,
      temperature: 3,
    },
    cleaning: false,
    id: 'black_tea',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fblack_tea.png?alt=media&token=da8e5f16-87d1-409d-9c5a-c65171c81563',
    tea_type: 'Black Tea',
  },
  {
    brewing_data: {
      time: {label: '0m 10s', value: 0, seconds: 10},
      waterAmount: 0,
      temperature: 2,
    },
    cleaning: false,
    id: 'puer_tea',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fpuer_tea.png?alt=media&token=aae89e00-0272-4743-848e-e9be37a3d362',
    tea_type: 'Puer Tea',
  },
];

export const addInitPressets = async () => {
  try {
    const uid = auth().currentUser.uid;

    initPressets.forEach(async presset => {
      const newPresset = await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .add(presset);

      const newPressetData = await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .doc(newPresset.id)
        .get();

      await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .doc(newPresset.id)
        .update({...newPressetData.data(), id: newPresset.id});
    });
  } catch (error) {
    console.log(error, 'addInitPressets error');
  }
};

export const getUserPressets = async () => {
  try {
    const uid = auth().currentUser.uid;

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
    console.log(error, 'error getUserPresset');
  }
};

export const addPresset = async presset => {
  try {
    const uid = auth().currentUser.uid;
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
    const uid = auth().currentUser.uid;
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
  const uid = auth().currentUser.uid;
  await pressetsCollection.doc(uid).collection('pressets').doc(id).delete();
};

export const uploadPressetImage = async (uri, name) => {
  const imageRef = storage().ref(`images/${name}`);
  await imageRef.putFile(uri, {contentType: 'image/jpg'}).catch(error => {
    throw error;
  });
  const url = await imageRef.getDownloadURL().catch(error => {
    throw error;
  });
  return url;
};
