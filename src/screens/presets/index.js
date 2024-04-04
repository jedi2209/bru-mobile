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
import TrashIconOutlined from '../../core/components/icons/TrashIconOutlined';
import PenIcon from '../../core/components/icons/PenIcon';
import {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
// import {Switch} from '@gluestack-ui/themed';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import {useStore} from 'effector-react';
import {$themeStore} from '../../core/store/theme';
import {
  addPressetToStoreFx,
  deletePressetFx,
  getPressetsFx,
  updatePressetFx,
} from '../../core/store/pressets';
import BrewingData from '../../core/components/TeaAlarm/BrewingData';
import {useBrewingData} from '../../hooks/useBrewingData';
import {usePressetList} from '../../hooks/usePressetList';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadPressetImage} from '../../utils/db/pressets';
import {useTranslation} from 'react-i18next';
import {$langSettingsStore} from '../../core/store/lang';
import useBle from '../../hooks/useBlePlx';
import {getStartCommand} from '../../utils/commands';

const s = StyleSheet.create({
  titleContainer: {
    ...basicStyles.row,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 15,
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
    color: colors.black,
  },
  teaImage: {marginBottom: 10, width: 74, height: 68, borderRadius: 100},
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
  cancelButton: {
    backgroundColor: colors.red,
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
  buttonTextDe: {fontSize: 10, letterSpacing: 0},
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
  saveButtonDe: {
    width: 185,
    paddingHorizontal: 5,
  },
  modalPressetName: {
    color: colors.green.mid,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
});

const PresetsScreen = props => {
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const [mode, setMode] = useState('list');
  const [modal, setModal] = useState(null);
  const [newTeaName, setNewTeaName] = useState('');
  const [image, setImage] = useState(null);
  const {t} = useTranslation();
  const currLang = useStore($langSettingsStore);

  useEffect(() => {
    getPressetsFx();
  }, []);

  const {selected, setSelected, pressets} = usePressetList();

  const {
    setBrewingTime,
    // setIsCleaning,
    setWaterAmount,
    setTemperature,
    brewingTime,
    waterAmount,
    isCleaning,
    temperature,
  } = useBrewingData(selected);

  const {writeValueWithResponse} = useBle();

  useEffect(() => {
    if (selected) {
      setNewTeaName(selected.tea_type);
    } else {
      setNewTeaName('');
    }
  }, [selected]);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <View style={s.titleContainer}>
        <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
          {t('Presets.Title')}
        </Text>
        {mode === 'list' && (
          <TouchableOpacity
            onPress={() => {
              setSelected({
                brewing_data: {
                  time: {label: '0m 10s', value: 0, seconds: 10},
                  waterAmount: 0,
                  temperature: 0,
                },
                cleaning: false,
              });
              setMode('create');
            }}>
            <PlusCircle style={s.plusIcon} />
          </TouchableOpacity>
        )}
      </View>
      <PressetList
        style={s.list}
        type="pressets"
        setSelected={setSelected}
        selected={selected}
        data={pressets}
      />
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
                disabled={!selected}
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
                    onConfirm: async () => {
                      deletePressetFx(selected.id);
                      setModal(null);
                      setSelected(null);
                    },
                    closeModal: () => setModal(null),
                  })
                }>
                <TrashIconOutlined width={24} height={24} fill="#B0B0B0" />
              </TouchableOpacity>
            )}
            <>
              {mode !== 'list' ? (
                <TextInput
                  value={newTeaName}
                  onChangeText={text => {
                    setNewTeaName(text);
                  }}
                  style={s.teaNameInput}
                />
              ) : (
                <Text style={s.teaName}>{newTeaName || 'Select presset'}</Text>
              )}
            </>
            {mode === 'list' && (
              <TouchableOpacity
                disabled={!selected}
                onPress={() => setMode('edit')}>
                <PenIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
          {mode !== 'list' ? (
            <TouchableOpacity
              onPress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                }).then(pickedImage => {
                  setImage(pickedImage.sourceURL);
                });
              }}>
              <Image
                resizeMode="cover"
                style={s.teaImage}
                source={
                  selected?.tea_img || image
                    ? {
                        uri: selected.tea_img ? selected.tea_img : image,
                      }
                    : require('../../../assets/teaImages/emptyPressetImage.png')
                }
              />
            </TouchableOpacity>
          ) : (
            <Image
              resizeMode="cover"
              style={s.teaImage}
              source={
                selected?.tea_img
                  ? {
                      uri: selected?.tea_img,
                    }
                  : require('../../../assets/teaImages/emptyPressetImage.png')
              }
            />
          )}
          <BrewingData
            waterAmount={waterAmount}
            setWaterAmount={setWaterAmount}
            brewingTime={brewingTime}
            setBrewingTime={setBrewingTime}
            temperature={temperature}
            setTemperature={setTemperature}
            disabled={mode === 'list'}
            type="pressets"
          />
          {mode === 'list' && isCleaning && (
            <Text style={s.cleaningText}>+ Cleaning</Text>
          )}
          {mode === 'list' && (
            <TouchableOpacity
              onPress={async () => {
                const command = getStartCommand(
                  0x40,
                  [temperature, brewingTime.value, waterAmount],
                  0x0f,
                );
                await writeValueWithResponse(command);
              }}
              style={s.brewButton}>
              <Text style={s.buttonText}>{t('InstantBrewing.BrewIt')}</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
      {/* {mode === 'list' ? (
        <>
          {pressets.length ? (
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
          ) : null}
        </>
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
              value={isCleaning}
              onChange={() => setIsCleaning(prev => !prev)}
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
      )} */}

      <View style={s.buttonContainer}>
        {mode !== 'list' && (
          <TouchableOpacity
            onPress={async () => {
              let imgUrl;
              if (image) {
                imgUrl = await uploadPressetImage(image, selected.id);
              }

              if (mode === 'create') {
                addPressetToStoreFx({
                  tea_type: newTeaName,
                  tea_img: imgUrl ? imgUrl : '',
                  brewing_data: {
                    time: brewingTime,
                    waterAmount,
                    temperature,
                  },
                  cleaning: isCleaning,
                });
              } else if (mode === 'edit') {
                updatePressetFx({
                  id: selected.id,
                  tea_type: newTeaName,
                  tea_img: imgUrl ? imgUrl : selected.tea_img,
                  brewing_data: {
                    time: brewingTime,
                    waterAmount,
                    temperature,
                  },
                  cleaning: isCleaning,
                });
              }
              setMode('list');
            }}
            style={[s.saveButton, currLang === 'de_US' && s.saveButtonDe]}>
            <Text
              style={[s.buttonText, currLang === 'de_US' && s.buttonTextDe]}>
              {t('Presets.SavePreset')}
            </Text>
          </TouchableOpacity>
        )}
        {mode !== 'list' ? (
          <TouchableOpacity
            onPress={() => {
              setMode('list');
              getPressetsFx();
            }}
            style={s.cancelButton}>
            <Text style={s.buttonText}>{t('Presets.Cancel')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {modal ? <ConfirmationModal {...modal} /> : null}
    </Wrapper>
  );
};

export default PresetsScreen;
