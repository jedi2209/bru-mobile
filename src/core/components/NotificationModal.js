import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../const/style';
import CircleCheck from './icons/CircleCheck';

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
    maxWidth: 305,
    paddingHorizontal: 19,
    paddingVertical: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: colors.gray.grayDarkText,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
});

const NotificationModal = ({
  opened = false,
  closeModal = () => {},
  modalTitle = '',
}) => {
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
          <Text style={[s.text, s.modalTitle]}>{modalTitle}</Text>
          <CircleCheck />
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;
