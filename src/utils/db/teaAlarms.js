import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const teaAlarmsCollection = firestore().collection('tea_alarms');
const uid = auth().currentUser.uid;

export const getUserTeaAlarms = async () => {
  try {
    const teaAlarms = await teaAlarmsCollection
      .doc(uid)
      .collection('tea_alarms')
      .get();

    return teaAlarms.docs.map(teaAlarm => {
      return {
        id: teaAlarm.id,
        ...teaAlarm.data(),
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export const createTeaAlarm = async teaAlarm => {
  try {
    const newTeaAlarm = await teaAlarmsCollection
      .doc(uid)
      .collection('tea_alarms')
      .add(teaAlarm);
    const id = newTeaAlarm.id;
    return {id, ...teaAlarm};
  } catch (error) {
    console.log(error);
  }
};

export const getTeaAlarmById = async id => {
  try {
    const teaAlarm = await teaAlarmsCollection
      .doc(uid)
      .collection('tea_alarms')
      .doc(id)
      .get();
    return {id: teaAlarm.id, ...teaAlarm.data()};
  } catch (error) {
    console.log(error);
  }
};

export const updateTeaAlarm = async updatedTeaAlarm => {
  try {
    await teaAlarmsCollection
      .doc(uid)
      .collection('tea_alarms')
      .doc(updatedTeaAlarm.id)
      .update(updatedTeaAlarm);

    return {id: updatedTeaAlarm.id, ...updatedTeaAlarm};
  } catch (error) {
    console.log(error);
  }
};

export const deleteTeaAlarm = async id => {
  await teaAlarmsCollection.doc(uid).collection('tea_alarms').doc(id).delete();
};
