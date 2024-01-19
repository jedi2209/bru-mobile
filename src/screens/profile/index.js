import React, {useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {basicStyles, colors} from '../../core/const/style';
import {useColorMode} from '@gluestack-style/react';
import PenIcon from '../../core/components/icons/PenIcon';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../core/components/icons/UserIcon';
import {EyeIcon} from '@gluestack-ui/themed';

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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  },
  chartBar: {
    width: 8,
    maxHeight: maxBarHeight,
    backgroundColor: colors.green.mid,
  },
});

const chartDaysData = [
  0, 1, 2, 3, 4, 5, 6, 2, 3, 5, 5, 3, 9, 3, 1, 5, 7, 4, 0, 9, 8, 3, 4, 2, 6,
];
const chartWeeksData = [14, 10, 8, 2];
const chartMonthsData = [14 * 3, 10 * 3, 8 * 3, 2 * 3];
const chartYearsData = [365, 363, 200, 100, 150];

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
          <TouchableOpacity style={s.editButton}>
            <PenIcon width={24} height={24} />
          </TouchableOpacity>
          <View style={[s.image, s.noImage, isDarkMode && s.noImageDark]}>
            <UserIcon width={66} height={66} fill="#999999" />
          </View>
        </View>
        <View style={s.userDataWrapper}>
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
            <TouchableOpacity style={s.userDataButton}>
              <Text style={s.validateButton}>Validate</Text>
            </TouchableOpacity>
          </View>
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
        </View>
      </LinearGradient>
      <Text style={[s.subtitle, isDarkMode && basicStyles.darkTextProfile]}>
        My statistics
      </Text>
      <View style={s.statisticWrapper}>
        <View style={s.statisticSelectors}>
          <TouchableOpacity
            onPress={() => setselectedFilter('days')}
            style={selectedFilter === 'days' && s.statisticSelectorSelected}>
            <Text style={s.statisticSelectorText}>Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setselectedFilter('weeks')}
            style={selectedFilter === 'weeks' && s.statisticSelectorSelected}>
            <Text style={s.statisticSelectorText}>Weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setselectedFilter('months')}
            style={selectedFilter === 'months' && s.statisticSelectorSelected}>
            <Text style={s.statisticSelectorText}>Months</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setselectedFilter('years')}
            style={selectedFilter === 'years' && s.statisticSelectorSelected}>
            <Text style={s.statisticSelectorText}>Years</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={[
            basicStyles.row,
            {alignItems: 'flex-end', gap: 1},
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.barStatistic}>
          {chartDaysData.map(item => {
            return (
              <View>
                {/* {item ? <Text>{item}</Text> : null} */}
                <View
                  key={item + new Date().getDate()}
                  style={[
                    s.chartBar,
                    {
                      height: scaleValue(
                        0,
                        Math.max(...chartDaysData),
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
      </View>
    </Wrapper>
  );
};

export default ProfileScreen;
