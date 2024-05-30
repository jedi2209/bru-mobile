import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setDefaults} from '../../core/store/defaultPresets';

export const pressetsCollection = firestore().collection('pressets');
export const defaultPressetsCollection =
  firestore().collection('default_pressets');

export class PresetApi {
  static async getUserPresets() {
    try {
      const uid = auth().currentUser.uid;
      const deletedDefaults = JSON.parse(
        await AsyncStorage.getItem('deletedDefaults'),
      );

      const pressets = await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .get();

      const defaultPressets = (await defaultPressetsCollection.get()).docs.map(
        doc => doc.data(),
      );
      setDefaults(defaultPressets);
      const filteredPressets = defaultPressets.filter(
        presset => !deletedDefaults?.includes?.(presset.id),
      );
      const pressetsWithid = pressets.docs.map(presset => {
        return {
          ...presset.data(),
          id: presset.id,
        };
      });
      return {presets: pressetsWithid, defaultPresets: filteredPressets};
    } catch (error) {
      console.log(error, 'error getUserPresset');
    }
  }
  static async addPreset(preset) {
    try {
      const uid = auth().currentUser.uid;
      const newPresset = await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .add(preset);
      const id = newPresset.id;
      return {id, ...preset};
    } catch (error) {
      console.log(error);
    }
  }
  static async updatePreset(newPreset) {
    try {
      const uid = auth().currentUser.uid;
      await pressetsCollection
        .doc(uid)
        .collection('pressets')
        .doc(newPreset.id)
        .update(newPreset);

      return {id: newPreset.id, ...newPreset};
    } catch (error) {
      console.log(error);
    }
  }
  static async deletePreset(id) {
    const uid = auth().currentUser.uid;
    await pressetsCollection.doc(uid).collection('pressets').doc(id).delete();
  }
  static async uploadPresetImage(uri, name) {
    try {
      const fileUri = decodeURI(uri);
      console.log(fileUri, name, 'uri, name');
      const imageRef = storage().ref(`images/${name}`);
      console.log(imageRef, 'imageRef');
      await imageRef.putFile(fileUri, {contentType: 'image/jpg'});
      console.log('after put file');
      const url = await imageRef.getDownloadURL();
      console.log(url, 'donwloaded successfully');
      return url;
    } catch (err) {
      console.log(err, 'erererere');
      throw err;
    }
  }
}
