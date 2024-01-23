import React, {useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {basicStyles, colors} from '../../core/const/style';
import {useColorMode} from '@gluestack-style/react';
import PenIcon from '../../core/components/icons/PenIcon';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../core/components/icons/UserIcon';
import {EyeIcon} from '@gluestack-ui/themed';
import ArrowLeftIcon from '../../core/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../core/components/icons/ArrowRightIcon';
import ConfirmationModal from '../../core/components/ConfirmationModal';

const maxBarHeight = 80;

const resetModal = {
  text: 'st',
  cancelButtonText: 'dasd',
  cancelButton: () => {},
};

const acceptModal = {
  text: 'st',
  cancelButtonText: 'dasd',
  cancelButton: () => {},
};

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

const chartDaysData = [
  0, 1, 2, 3, 4, 5, 6, 2, 3, 5, 5, 3, 9, 3, 1, 5, 7, 4, 0, 9, 8, 3, 4, 2, 6, 0,
];
const chartWeeksData = [14, 10, 8, 2];
const chartMonthsData = [14 * 3, 10 * 3, 8 * 3, 2 * 3];
const chartYearsData = [365, 363, 200, 100, 150];

const selectData = mode => {
  switch (mode) {
    case 'days':
      return chartDaysData;
    case 'weeks':
      return chartWeeksData;
    case 'months':
      return chartMonthsData;
    case 'years':
      return chartYearsData;
    default:
      return [];
  }
};

function scaleValue(minValue, maxValue, value, maxHeight) {
  if (value === 0) {
    return 0;
  }
  const range = maxValue - minValue;
  const scaledHeight = ((value - minValue) / range) * (maxHeight - 1);
  const clampedHeight = Math.max(1, Math.min(maxHeight, scaledHeight));
  return clampedHeight;
}

const ProfileScreen = props => {
  const phoneTheme = useColorMode();
  const isDarkMode = phoneTheme === 'dark';
  const [selectedFilter, setselectedFilter] = useState('days');
  const [mode, setMode] = useState('view');
  const [modal, setModal] = useState(null);

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text
        style={[
          basicStyles.screenTitle,
          isDarkMode && basicStyles.darkTextProfile,
        ]}>
        Profile
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
            <UserIcon width={66} height={66} fill="#999999" />
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
                Name
              </Text>
              <Text
                style={[
                  s.userDataText,
                  s.value,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                John Doe
              </Text>
            </View>
          ) : (
            <View style={s.inputWrapper}>
              <Text style={s.inputLabel}>Name</Text>
              <TextInput
                placeholderTextColor={colors.gray.grayDarkText}
                style={s.input}
                value="John Doe"
              />
            </View>
          )}

          {mode === 'view' ? (
            <View style={s.userData}>
              <Text
                style={[
                  s.userDataText,
                  s.label,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                Email
              </Text>
              <Text
                style={[
                  s.userDataText,
                  s.value,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                john@usermail.com
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setModal({
                    confirmationText:
                      'Please follow the link in the email that we have sent to john@usermail.com. Validating on email address allows you to receive special tea deals and promotions fom BRU ',
                    confirmationButtonText: 'OK',
                    onConfirm: () => setModal(null),
                  })
                }
                style={s.userDataButton}>
                <Text style={s.validateButton}>Validate</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.inputWrapper}>
              <Text style={s.inputLabel}>Email</Text>
              <TextInput
                placeholderTextColor={colors.gray.grayDarkText}
                style={s.input}
                value="john@usermail.com"
              />
            </View>
          )}
          {mode === 'view' ? (
            <View style={s.userData}>
              <Text
                style={[
                  s.userDataText,
                  s.label,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                Password
              </Text>
              <Text
                style={[
                  s.userDataText,
                  s.value,
                  isDarkMode && basicStyles.darkTextProfile,
                ]}>
                ***************
              </Text>
              <TouchableOpacity style={s.userDataButton}>
                <EyeIcon width={24} height={24} color={colors.green.mid} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.inputWrapper}>
              <Text style={s.inputLabel}>Password</Text>
              <TextInput
                secureTextEntry
                placeholderTextColor={colors.gray.grayDarkText}
                style={s.input}
                value="****************"
              />
            </View>
          )}
        </View>
        {mode === 'edit' && (
          <TouchableOpacity
            onPress={() => setMode('view')}
            style={s.saveButton}>
            <Text style={[basicStyles.backgroundButtonText, {width: 132}]}>
              Save
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
      {mode === 'view' && (
        <>
          <Text style={[s.subtitle, isDarkMode && basicStyles.darkTextProfile]}>
            My statistics
          </Text>
          <View style={s.statisticWrapper}>
            <View style={s.statisticSelectors}>
              <TouchableOpacity
                onPress={() => setselectedFilter('days')}
                style={
                  selectedFilter === 'days' && s.statisticSelectorSelected
                }>
                <Text style={s.statisticSelectorText}>Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setselectedFilter('weeks')}
                style={
                  selectedFilter === 'weeks' && s.statisticSelectorSelected
                }>
                <Text style={s.statisticSelectorText}>Weeks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setselectedFilter('months')}
                style={
                  selectedFilter === 'months' && s.statisticSelectorSelected
                }>
                <Text style={s.statisticSelectorText}>Months</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setselectedFilter('years')}
                style={
                  selectedFilter === 'years' && s.statisticSelectorSelected
                }>
                <Text style={s.statisticSelectorText}>Years</Text>
              </TouchableOpacity>
            </View>
            <View style={s.dateFilterWrapper}>
              <TouchableOpacity>
                <ArrowLeftIcon />
              </TouchableOpacity>
              <Text style={s.dateFilterText}>
                <Text style={s.dateFilterMonth}>Oct 28, </Text>
                2020
              </Text>
              <TouchableOpacity>
                <ArrowRightIcon />
              </TouchableOpacity>
            </View>
            <ScrollView
              bounces={false}
              contentContainerStyle={[
                basicStyles.row,
                {alignItems: 'flex-end', gap: 1},
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.barStatistic}>
              {/* <Text style={s.totalTea}>53242 litres</Text> */}
              {selectData(selectedFilter).map(item => {
                return (
                  <View>
                    {/* {item ? <Text>{item}</Text> : null} */}
                    <View
                      key={item + new Date().getMilliseconds()}
                      style={[
                        s.chartBar,
                        {
                          height: scaleValue(
                            0,
                            Math.max(...selectData(selectedFilter)),
                            item,
                            maxBarHeight,
                          ),
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={s.popularPressets}>
              <View style={s.popularPresset}>
                <Text style={s.popularPressetCounter}>Most popular preset</Text>
                <View>
                  <Text
                    style={[s.popularPressetCounter, s.popularPressetTitle]}>
                    Black Tea
                  </Text>
                  <Text style={s.popularPressetValue}>2132 cups</Text>
                </View>
              </View>
              <View style={s.popularPresset}>
                <Text style={s.popularPressetCounter}>
                  2nd most popular preset
                </Text>
                <View>
                  <Text
                    style={[s.popularPressetCounter, s.popularPressetTitle]}>
                    Green Tea
                  </Text>
                  <Text style={s.popularPressetValue}>1432 cups</Text>
                </View>
              </View>
              <View style={s.popularPresset}>
                <Text style={s.popularPressetCounter}>
                  3nd most popular preset
                </Text>
                <View>
                  <Text
                    style={[s.popularPressetCounter, s.popularPressetTitle]}>
                    Pu Er
                  </Text>
                  <Text style={s.popularPressetValue}>132 cups</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              setModal({
                withCancelButton: true,
                cancelButtonText: 'No',
                modalTitle: 'Attention!',
                confirmationText:
                  'Reseting your tea consumption statistics cannot be undone!',
                confirmationButtonText: 'Yes, Reset',
                onConfirm: () => setModal(null),
              })
            }
            style={s.resetButton}>
            <Text style={s.resetButtonText}>Reset My Stats</Text>
          </TouchableOpacity>
        </>
      )}
      <ConfirmationModal
        opened={!!modal}
        closeModal={() => setModal(null)}
        {...modal}
      />
    </Wrapper>
  );
};

export default ProfileScreen;
