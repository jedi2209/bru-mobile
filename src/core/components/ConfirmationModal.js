import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {basicStyles, colors} from '../const/style';
import CheckedIcon from './icons/Checked';

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
    maxWidth: 325,
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  confirmationText: {fontSize: 14, fontWeight: '600', marginHorizontal: 20},
  confirmationButton: {
    backgroundColor: colors.green.mid,
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 90,
    minWidth: '50%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  confirmationButtonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cancelButtonText: {
    color: colors.green.mid,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dontShowAgainWrapper: {
    ...basicStyles.row,
    marginBottom: 17,
  },
  dontShowAgainFalse: {
    borderWidth: 1,
    borderColor: colors.gray.light,
    width: 22,
    height: 22,
    borderRadius: 100,
    marginRight: 15,
  },
  dontShowAgainText: {
    marginBottom: 0,
    fontWeight: '600',
    lineHeight: 24,
  },
  dontShowAgainTrue: {
    marginRight: 15,
  },
});

const ConfirmationModal = ({
  opened = false,
  closeModal = () => {},
  withCancelButton = false,
  withDontShowAgain = false,
  cancelButtonText = '',
  modalTitle = '',
  confirmationText = '',
  confirmationButtonText = '',
  onConfirm = () => {},
  dontShowAgainText = '',
}) => {
  const [dontShow, setDontShow] = useState(false);

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
          {modalTitle ? (
            <Text style={[s.text, s.modalTitle]}>{modalTitle}</Text>
          ) : null}
          <Text style={[s.text, s.confirmationText]}>{confirmationText}</Text>
          {withDontShowAgain && (
            <View style={s.dontShowAgainWrapper}>
              {dontShow ? (
                <TouchableOpacity
                  style={s.dontShowAgainTrue}
                  onPress={() => setDontShow(false)}>
                  <CheckedIcon />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setDontShow(true)}>
                  <View style={s.dontShowAgainFalse} />
                </TouchableOpacity>
              )}
              <Text style={[s.text, s.dontShowAgainText]}>
                {dontShowAgainText}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={onConfirm} style={s.confirmationButton}>
            <Text style={s.confirmationButtonText}>
              {confirmationButtonText}
            </Text>
          </TouchableOpacity>
          {withCancelButton ? (
            <TouchableOpacity onPress={closeModal} style={s.cancelButton}>
              <Text style={s.cancelButtonText}>{cancelButtonText}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
