import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {basicStyles, colors} from '../../core/const/style';
import PenIcon from '../../core/components/icons/PenIcon';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../core/components/icons/UserIcon';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import Input from '../../core/components/Input';
import {useStore} from 'effector-react';
import {$profileStore, getUserFx} from '../../core/store/profile';
import {updateUser, uploadImage} from '../../utils/db/auth';
import {updateEmail, updatePassword} from '../../utils/auth';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import {$themeStore} from '../../core/store/theme';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';

const maxBarHeight = 80;

const s = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  },
  gradientBg: {
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 20,
  },
  profileInfoWrapper: {
    ...basicStyles.row,
    justifyContent: 'center',
    position: 'relative',
  },
  editButton: {position: 'absolute', top: -4, right: 16},
  image: {
    width: 90,
    height: 90,
    borderRadius: 90,
    marginBottom: 20,
  },
  noImage: {
    backgroundColor: '#E1E1E1',
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageDark: {backgroundColor: '#393939'},
  userDataWrapper: {marginHorizontal: 14, gap: 10},
  userData: {
    ...basicStyles.row,
  },
  userDataWithButton: {
    justifyContent: 'space-between',
  },
  userDataText: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  label: {
    fontWeight: '600',
    width: 85,
  },
  value: {
    fontWeight: '400',
  },
  userDataButton: {marginLeft: 'auto'},
  validateButton: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    color: colors.green.mid,
  },
  subtitle: {
    marginLeft: 16,
    marginVertical: 20,
    color: colors.gray.grayDarkText,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  statisticWrapper: {
    marginHorizontal: 16,
    backgroundColor: '#ECECEC',
    borderRadius: 10,
  },
  statisticSelectors: {
    ...basicStyles.rowBetween,
    backgroundColor: '#CDCACA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  statisticSelectorSelected: {
    backgroundColor: '#ECECEC',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  statisticSelectorText: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: colors.gray.grayDarkText,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  barStatistic: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#E6E7E8',
    width: 311,
    height: 90,
    opacity: 0.5,
    position: 'relative',
    marginBottom: 20,
  },
  chartBar: {
    width: 8,
    maxHeight: maxBarHeight,
    backgroundColor: colors.green.mid,
  },
  dateFilterWrapper: {
    ...basicStyles.rowBetween,
    marginHorizontal: 35,
    marginVertical: 11,
  },
  dateFilterText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray.grayDarkText,
    textTransform: 'uppercase',
  },
  dateFilterMonth: {fontWeight: '700'},
  totalTea: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.4,
    color: '#999',
    position: 'absolute',
    top: 1,
    right: -80,
  },
  popularPressets: {
    marginHorizontal: 16,
  },
  popularPresset: {
    ...basicStyles.rowBetween,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  popularPressetCounter: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  popularPressetTitle: {
    fontWeight: '400',
    alignSelf: 'flex-end',
  },
  popularPressetValue: {
    color: colors.green.mid,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '400',
    alignSelf: 'flex-end',
  },
  resetButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#9D9D9D',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.green.mid,
    marginBottom: 5,
  },
  input: {
    paddingLeft: 15,
    paddingVertical: 14,
    backgroundColor: '#E6E7E8',
  },
  saveButton: {
    ...basicStyles.backgroundButton,
    alignSelf: 'center',
    marginTop: 15,
  },
});

const schema = yup
  .object({
    name: yup.string(),
    email: yup.string().email('Email is incorrect'),
    password: yup.string(),
  })
  .required();

const ProfileScreen = props => {
  const theme = useStore($themeStore);
  const user = useStore($profileStore);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [mode, setMode] = useState('view');
  const [modal, setModal] = useState(null);
  const [selectedFilter, setselectedFilter] = useState('days');
  const [image, setImage] = useState(null);
  const {t} = useTranslation();

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    getUserFx();
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Toast.show({
        type: 'error',
        text1: errors[Object.keys(errors)[0]].message,
        visibilityTime: 1500,
      });
    }
  }, [errors]);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text
        style={[
          basicStyles.screenTitle,
          isDarkMode && basicStyles.darkTextProfile,
        ]}>
        {t('Profile.Title')}
      </Text>
      <LinearGradient
        style={s.gradientBg}
        colors={
          isDarkMode
            ? colors.gradient.profileInfo.dark
            : colors.gradient.profileInfo.light
        }>
        <View style={s.profileInfoWrapper}>
          {mode === 'view' && (
            <TouchableOpacity
              onPress={() => setMode('edit')}
              style={s.editButton}>
              <PenIcon width={24} height={24} />
            </TouchableOpacity>
          )}
          <View style={[s.image, s.noImage, isDarkMode && s.noImageDark]}>
            {mode === 'view' ? (
              <Image
                width={90}
                height={90}
                style={{borderRadius: 100}}
                source={{
                  uri: user.img || image,
                }}
              />
            ) : (
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
                {image || user.img ? (
                  <Image
                    width={90}
                    height={90}
                    style={{borderRadius: 100}}
                    source={{
                      uri: image || user.img,
                    }}
                  />
                ) : (
                  <UserIcon width={66} height={66} fill="#999999" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={s.userDataWrapper}>
          {mode === 'view' ? (
            <View style={s.userData}>
              <Text
                style={[
                  s.userDataText,
                  s.label,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                {t('Profile.Name')}
              </Text>
              <Text
                style={[
                  s.userDataText,
                  s.value,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                {user.name}
              </Text>
            </View>
          ) : (
            <Input
              placeholder={t('Profile.PleaseEnterName')}
              label="Name"
              control={control}
              name="name"
              error={errors.name}
              defaultValue={user.name}
            />
          )}

          {mode === 'view' ? (
            <View style={s.userData}>
              <Text
                style={[
                  s.userDataText,
                  s.label,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                {t('Profile.Email')}
              </Text>
              <Text
                style={[
                  s.userDataText,
                  s.value,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                {user.email}
              </Text>
            </View>
          ) : (
            <Input
              placeholder={t('Profile.PleaseEnterEmail')}
              label="Email"
              control={control}
              name="email"
              error={errors.email}
              defaultValue={user.email}
            />
          )}
          {mode === 'view' ? (
            <></>
          ) : (
            <Input
              placeholder={t('Profile.PleaseEnterPassword')}
              label={t('Profile.Password')}
              secure
              withIcon
              name="password"
              control={control}
              error={errors.password}
            />
          )}
        </View>
        {mode === 'edit' && (
          <TouchableOpacity
            onPress={handleSubmit(async data => {
              if (data.password) {
                await updatePassword(data.password);
              }
              if (data.email && data.email !== user.email) {
                await updateEmail(data.email);
              }
              if (
                (data.name && data.name !== user.name) ||
                (data.email && data.email !== user.email)
              ) {
                await updateUser(user.uid, {
                  email: data.email,
                  name: data.name,
                });
              }
              if (image) {
                const url = await uploadImage(image, user.uid);
                await updateUser(user.uid, {
                  img: url,
                });
              }
              setMode('view');
              setImage(null);
            })}
            style={s.saveButton}>
            <Text style={[basicStyles.backgroundButtonText, {width: 132}]}>
              {t('Profile.Save')}
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
      <ConfirmationModal
        opened={!!modal}
        closeModal={() => setModal(null)}
        {...modal}
      />
    </Wrapper>
  );
};

export default ProfileScreen;
