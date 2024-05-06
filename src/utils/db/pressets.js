import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const pressetsCollection = firestore().collection('pressets');
export const defaultPressetsCollection =
  firestore().collection('default_pressets');

const initPressets = [
  {
    brewing_data: {
      time: {value: 17},
      waterAmount: 4,
      temperature: 12,
    },
    cleaning: false,
    id: 'evening_tea',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fevening_tea.png?alt=media&token=a5e5e69d-5018-40b8-8800-77c979f10626',
    tea_type: 'Evening tea',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 23},
      waterAmount: 4,
      temperature: 11,
    },
    cleaning: false,
    id: 'premium_earl_grey',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fpremium_earl_grey.png?alt=media&token=8325551c-aee1-4365-9683-8ed34b63bc7b',
    tea_type: 'Premium Earl Grey',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 17},
      waterAmount: 4,
      temperature: 8,
    },
    cleaning: false,
    id: 'ginger_lemon',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fginger-lemon.png?alt=media&token=9374e4bb-319f-43b9-880c-8fe04ea8724f',
    tea_type: 'Green tea\nginger-lemon',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 11},
      waterAmount: 4,
      temperature: 9,
    },
    cleaning: false,
    id: 'jasmintee',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fjasmintee.png?alt=media&token=0107164a-d664-4894-bfa1-a6cf484e147e',
    tea_type: 'Jasmintee',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 29},
      waterAmount: 4,
      temperature: 12,
    },
    cleaning: false,
    id: 'rooibos_marzipan',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Frooibos-marzipan.png?alt=media&token=57c5a715-56d0-4d18-a287-dc28217479a7',
    tea_type: 'Rooibos Marzipan',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 23},
      waterAmount: 4,
      temperature: 11,
    },
    cleaning: false,
    id: 'sweet_orange',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fsweet-orange.png?alt=media&token=d979cbfd-9ecc-4a67-b9ea-52e8d0822e0c',
    tea_type: 'Sweet Orange',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 29},
      waterAmount: 4,
      temperature: 12,
    },
    cleaning: false,
    id: 'wild_mango',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fwild-mango.png?alt=media&token=66f8d170-ec81-4310-b16d-1e4d5ac778a0',
    tea_type: 'Wild Mango',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 11},
      waterAmount: 4,
      temperature: 7,
    },
    cleaning: false,
    id: 'sencha_japan',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fsencha-japan.png?alt=media&token=9512f075-4f67-4e5d-8b7b-612b6135420d',
    tea_type: 'Green tea Sencha\nfrom Japan',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 29},
      waterAmount: 4,
      temperature: 10,
    },
    cleaning: false,
    id: 'fresh_peach',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Ffresh-peach.png?alt=media&token=10e5b045-0e72-49b0-b510-8ad4fb58b4b6',
    tea_type: 'Fresh Peach',
    created_at: 0,
  },
  {
    brewing_data: {
      time: {value: 23},
      waterAmount: 4,
      temperature: 12,
    },
    cleaning: false,
    id: 'assam_from_india',
    tea_img:
      'https://firebasestorage.googleapis.com/v0/b/brutea-app.appspot.com/o/images%2Fassam-from-india.png?alt=media&token=91a5162f-c269-45ca-b188-dee04afd5b3f',
    tea_type: 'Assam from India',
    created_at: 0,
  },
];

export const addInitPressets = async uid => {
  try {
    // const uid = auth().currentUser.uid;

    initPressets.forEach(async presset => {
      await pressetsCollection.doc(uid).collection('pressets').add(presset);
    });
  } catch (error) {
    console.log(error, 'addInitPressets error');
  }
};

export const getUserPressets = async () => {
  try {
    const uid = auth().currentUser.uid;
    const deletedDefaults = JSON.parse(
      await AsyncStorage.getItem('deletedDefaults'),
    );
    const updatedDefaults = JSON.parse(
      await AsyncStorage.getItem('updatedDefaults'),
    );

    const pressets = await pressetsCollection
      .doc(uid)
      .collection('pressets')
      .get();

    const defaultPressets = (await defaultPressetsCollection.get()).docs
      .map(doc => doc.data())
      .filter(presset => {
        if (!deletedDefaults) {
          return true;
        }
        if (deletedDefaults.includes(presset.id)) {
          return false;
        }
        if (updatedDefaults.includes(presset.id)) {
          return false;
        }
        return true;
      });
    const pressetsWithid = pressets.docs.map(presset => {
      return {
        id: presset.id,
        ...presset.data(),
      };
    });
    return [...pressetsWithid, ...defaultPressets];
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
