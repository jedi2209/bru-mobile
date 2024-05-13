import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../const/style';
import Picker from './Picker/Picker';
import {useStore} from 'effector-react';
import {$profileStore} from '../store/profile';
import {waterPickerData} from '../const';
import {useTranslation} from 'react-i18next';

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
    justifyContent: 'space-between',
  },
  button: {color: colors.green.mid, fontSize: 15, fontWeight: '600'},
  closeButton: {marginRight: 40},
});

const WaterAmountModal = ({opened, closeModal, setWaterAmount, initIndex}) => {
  const {units} = useStore($profileStore);
  const values = useMemo(() => waterPickerData(units), [units]);
  const [selected, setSelected] = useState(values[0].value);
  const {t} = useTranslation();

  useEffect(() => {
    setSelected(values[0].value);
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
          <Text style={s.title}>{t('Picker.WaterAmount')}</Text>
          <Picker initIndex={initIndex} data={values} setValue={setSelected} />
          <View style={s.buttonsContainer}>
            <TouchableOpacity onPress={closeModal} style={s.closeButton}>
              <Text style={s.button}>{t('Picker.Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setWaterAmount(selected);
                closeModal();
              }}>
              <Text style={s.button}>{t('Picker.Done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WaterAmountModal;
