import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const pressetsCollection = firestore().collection('pressets');
const uid = auth().currentUser.uid;

const initPressets = [
  {
    brewing_data: {
      time: 150,
      waterAmount: 250,
    },
    cleaning: false,
    id: 'green_tea',
    tea_img: 'gs://brutea-app.appspot.com/images/green_tea.png',
    tea_type: 'Green Tea',
  },
  {
    brewing_data: {
      time: 270,
      waterAmount: 250,
    },
    cleaning: false,
    id: 'black_tea',
    tea_img: 'gs://brutea-app.appspot.com/images/black_tea.png',
    tea_type: 'Black Tea',
  },
  {
    brewing_data: {
      time: 210,
      waterAmount: 250,
    },
    cleaning: false,
    id: 'puer_tea',
    tea_img: 'gs://brutea-app.appspot.com/images/puer_tea.png',
    tea_type: 'Puer Tea',
  },
];

export const addInitPressets = async () => {
  try {
    initPressets.forEach(async presset => {
      await pressetsCollection.doc(uid).collection('pressets').add(presset);
    });
  } catch (error) {}
};

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
