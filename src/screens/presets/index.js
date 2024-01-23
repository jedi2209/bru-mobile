import Wrapper from '@comp/Wrapper';
import React, {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PlusCircle from '../../core/components/icons/PlusCircle';
import {basicStyles, colors} from '../../core/const/style';
import PressetList from '../../core/components/PressetList/PressetList';
import {mockedData} from '../instant-brew';
import TrashIconOutlined from '../../core/components/icons/TrashIconOutlined';
import PenIcon from '../../core/components/icons/PenIcon';
import {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import TeaAlarm from '../../core/components/TeaAlarm/TeaAlarmInfo';
import {Switch} from '@gluestack-ui/themed';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';

const s = StyleSheet.create({
  titleContainer: {
    ...basicStyles.row,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 20,
  },
  screenTitle: {
    ...basicStyles.screenTitle,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
  },
  plusIcon: {},
  list: {paddingLeft: 16, marginBottom: 20},
  pressetInfo: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
  },
  pressetInfoHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  teaName: {
    lineHeight: 24,
    letterSpacing: 0.4,
    fontWeight: '600',
    fontSize: 18,
  },
  teaNameInput: {
    lineHeight: 24,
    letterSpacing: 0.4,
    fontWeight: '600',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
    borderBottomColor: colors.green.mid,
    borderBottomWidth: 2,
    paddingBottom: 2,
    marginBottom: 6,
  },
  teaImage: {marginBottom: 10, width: 74, height: 68},
  cleaningText: {
    color: colors.gray.grayDarkText,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  brewButton: {
    backgroundColor: colors.green.mid,
    paddingHorizontal: 57,
    paddingVertical: 15,
    borderRadius: 90,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    lineHeight: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  resetButton: {
    color: '#9D9D9D',
    textAlign: 'right',
    marginRight: 16,
    fontSize: 14,
    textTransform: 'uppercase',
    lineHeight: 22,
    fontWeight: '500',
  },
  switchWrapper: {
    ...basicStyles.rowBetween,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  switchContainer: {...basicStyles.row, gap: 12},
  switchText: {
    color: colors.gray.grayDarkText,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.green.mid,
    paddingVertical: 15,
    borderRadius: 90,
    width: 164,
    alignSelf: 'center',
  },
  modalPressetName: {
    color: colors.green.mid,
  },
});

const PresetsScreen = props => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const [selected, setSelected] = useState({
    id: 1,
    title: 'Black tea',
    img: require('/assets/teaImages/black_tea.png'),
  });
  const [mode, setMode] = useState('list');
  const [modal, setModal] = useState(null);
  return (
    <Wrapper {...props}>
      <View style={s.titleContainer}>
        <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
          Presets
        </Text>
        {mode === 'list' && (
          <TouchableOpacity onPress={() => setMode('create')}>
            <PlusCircle style={s.plusIcon} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <PressetList
          style={s.list}
          data={mockedData}
          type="pressets"
          setSelected={setSelected}
          selected={selected}
        />
      </View>
      <View style={s.shadow}>
        <LinearGradient
          colors={
            isDarkMode
              ? colors.gradient.pressetInfo.dark
              : colors.gradient.pressetInfo.light
          }
          locations={[0, 0.01, 1]}
          style={s.pressetInfo}>
          <View style={s.pressetInfoHeader}>
            {mode === 'list' && (
              <TouchableOpacity
                onPress={() =>
                  setModal({
                    opened: true,
                    withCancelButton: true,
                    cancelButtonText: 'No',
                    modalTitle: 'Attention!',
                    confirmationText: (
                      <Text>
                        Do you really want to delete current preset{' '}
                        <Text style={s.modalPressetName}>Green Tea</Text>?
                      </Text>
                    ),
                    confirmationButtonText: 'Yes, Delete',
                    onConfirm: () => setModal(null),
                    closeModal: () => setModal(null),
                  })
                }>
                <TrashIconOutlined width={24} height={24} fill="#B0B0B0" />
              </TouchableOpacity>
            )}
            {mode === 'edit' || mode === 'create' ? (
              <TextInput value={selected.title} style={s.teaNameInput} />
            ) : (
              <Text style={s.teaName}>{selected.title}</Text>
            )}
            {mode === 'list' && (
              <TouchableOpacity onPress={() => setMode('edit')}>
                <PenIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
          {mode === 'create' ? (
            <TouchableOpacity>
              <Image
                style={s.teaImage}
                source={require('../../../assets/teaImages/emptyPressetImage.png')}
              />
            </TouchableOpacity>
          ) : (
            <Image style={s.teaImage} source={selected.img} />
          )}
          <TeaAlarm type="pressets" />
          {mode === 'list' && <Text style={s.cleaningText}>+ Cleaning</Text>}
          {mode === 'list' && (
            <TouchableOpacity style={s.brewButton}>
              <Text style={s.buttonText}>Brew it</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
      {mode === 'list' ? (
        <TouchableOpacity
          onPress={() =>
            setModal({
              opened: true,
              withCancelButton: true,
              cancelButtonText: 'No',
              modalTitle: 'Attention!',
              confirmationText:
                'Do you really want to return standart tea presets to default values? We will keep the presets that you’ve added intact.',
              confirmationButtonText: 'Yes, Return',
              onConfirm: () => setModal(null),
              closeModal: () => setModal(null),
            })
          }>
          <Text style={s.resetButton}>Reset Default presets</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.switchWrapper}>
          <View style={s.switchContainer}>
            <Switch
              sx={{
                props: {
                  trackColor: {
                    true: '#34C759',
                  },
                },
              }}
            />
            <Text style={[s.switchText, isDarkMode && basicStyles.darkText]}>
              Cold water
            </Text>
          </View>
          <View style={s.switchContainer}>
            <Switch
              sx={{
                props: {
                  trackColor: {
                    true: '#34C759',
                  },
                },
              }}
            />
            <Text style={[s.switchText, isDarkMode && basicStyles.darkText]}>
              Cleaning
            </Text>
          </View>
        </View>
      )}
      {mode !== 'list' && (
        <TouchableOpacity onPress={() => setMode('list')} style={s.saveButton}>
          <Text style={s.buttonText}>Save Preset</Text>
        </TouchableOpacity>
      )}
      {modal ? <ConfirmationModal {...modal} /> : null}
    </Wrapper>
  );
};

export default PresetsScreen;
