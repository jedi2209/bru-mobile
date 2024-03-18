import {useStore} from 'effector-react';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {$profileStore} from '../store/profile.js';
import {colors} from '../const/style.js';
import Picker from './Picker/Picker.js';
import {timePickerData} from '../const/index.js';

const s = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: 277,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {color: colors.green.mid, fontSize: 15, fontWeight: '600'},
  closeButton: {marginRight: 40},
});

const TimePickerModal = ({opened, closeModal, setTime, initIndex = 0}) => {
  const {units} = useStore($profileStore);
  const values = useMemo(() => timePickerData(units), [units]);
  const [selected, setSelected] = useState();

  useEffect(() => {
    setSelected(values[0]);
  }, [values, opened]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={opened}
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={s.modal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={s.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={s.modalContainer}>
          <Text style={s.title}>Water amount</Text>
          <Picker
            data={values}
            setValue={setSelected}
            isTimePicker={true}
            initIndex={initIndex}
          />
          <View style={s.buttonsContainer}>
            <TouchableOpacity onPress={closeModal} style={s.closeButton}>
              <Text style={s.button}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTime(selected);
                closeModal();
              }}>
              <Text style={s.button}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;
