import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {colors} from '../const/style';
import openLink from '../../helpers/openLink';
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
    paddingTop: 13,
    borderRadius: 10,
  },
  title: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 17.5,
  },
  button: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingVertical: 11,
  },
  buttonText: {
    color: colors.green.mid,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.4,
  },
});

const BruStoreModal = ({opened, closeModal}) => {
  const {t} = useTranslation();
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
          <Text style={s.title}>{t('StoreModal.Title')}</Text>
          <View style={s.buttonsContainer}>
            <TouchableOpacity
              onPress={async () => {
                openLink('https://bru.shop/collections/unsere-teesoerten');
              }}
              style={s.button}>
              <Text style={s.buttonText}>{t('StoreModal.TeaStore')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openLink('https://bru.shop/collections/zubehor');
              }}
              style={s.button}>
              <Text style={s.buttonText}>
                {t('StoreModal.PartsAndAccessories')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={s.button}>
              <Text style={s.buttonText}>{t('StoreModal.Back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BruStoreModal;
