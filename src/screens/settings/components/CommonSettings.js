import {useStore} from 'effector-react';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {$themeStore, setThemeFx} from '../../../core/store/theme';
import Collapsible from 'react-native-collapsible';
import {basicStyles, colors} from '../../../core/const/style';
import {Switch} from '@gluestack-ui/themed';
import {updateUser} from '../../../utils/db/auth';
import {$profileStore, updateProfileUser} from '../../../core/store/profile';

const s = StyleSheet.create({
  wrapper: {marginBottom: 50},
  darkTextMain: {
    color: colors.white,
  },
  filterStatus: {
    ...basicStyles.rowBetween,
    paddingVertical: 16,
  },
  bottomBorder: {
    borderBottomColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  subTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  filterHealth: {color: colors.green.mid, lineHeight: 16},
  unitTitle: {
    color: colors.gray.grayDarkText,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 10,
  },
  units: {
    ...basicStyles.row,
  },
  unit: {
    backgroundColor: '#C5C5C8',
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  darkUnit: {
    backgroundColor: '#555558',
  },
  unitText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  unitLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  unitRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selected: {
    backgroundColor: colors.green.mid,
  },
  autoRinse: {
    ...basicStyles.rowBetween,
    paddingBottom: 16,
  },
  filterNotification: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorial: {
    color: colors.green.mid,
    textDecorationLine: 'underline',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorialDark: {
    color: '#FFF',
  },
  autoRinseWrapper: {
    paddingTop: 16,
    paddingBottom: 11,
  },
});

const CommonSettings = () => {
  const user = useStore($profileStore);
  const [autoRinse, setAutoRinse] = useState(user.autoRinse);
  const [coldTea, setColdTea] = useState(user.coldTea);
  const [amount, setAmount] = useState(user.amount || 'small');
  const [dispence, setDispence] = useState(user.dispenceTo || 'cup');
  const [units, setUnits] = useState(user.units || 'metric');
  const [notifications, setNotifications] = useState(user.notifications);
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';

  const setSetting = async (cb, data) => {
    cb();
    updateProfileUser({...data});
    await updateUser(user.uid, {...data});
  };

  return (
    <View style={s.wrapper}>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <View>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>
            Filter Status
          </Text>
          <Text style={s.filterNotification}>
            Please replace the water filter
          </Text>
          <TouchableOpacity>
            <Text
              style={[s.filterTutorial, isDarkMode && s.filterTutorialDark]}>
              View tutorial video
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[s.title, s.filterHealth]}>Health 85%</Text>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <View>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>Cold tea</Text>
          <Text style={s.subTitle}>
            {coldTea
              ? 'Add cold water to every tea you make. You may need to add more tea because of water diffusion.'
              : 'Add cold water to every tea you make'}
          </Text>
        </View>
        <Switch
          value={coldTea}
          onChange={() =>
            setSetting(() => setColdTea(prev => !prev), {coldTea: !coldTea})
          }
          sx={{
            props: {
              trackColor: {
                true: colors.green.mid,
              },
            },
          }}
        />
      </View>
      <View style={[s.bottomBorder, {}]}>
        <View style={[s.filterStatus, s.autoRinseWrapper]}>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>
            Auto-rinse
          </Text>
          <Switch
            value={autoRinse}
            onChange={async () =>
              setSetting(() => setAutoRinse(prev => !prev), {
                autoRinse: !autoRinse,
              })
            }
            sx={{
              props: {
                trackColor: {
                  true: colors.green.mid,
                },
              },
            }}
          />
        </View>
        <Collapsible collapsed={!autoRinse} style={s.autoRinse}>
          <View>
            <Text style={[s.unitTitle, s.darkTextMain]}>Water amount</Text>
            <View style={s.units}>
              <TouchableOpacity
                onPress={() =>
                  setSetting(() => setAmount('small'), {
                    amount: 'small',
                  })
                }
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitLeft,
                  amount === 'small' && s.selected,
                ]}>
                <Text style={[s.unitText, amount === 'small' && s.selected]}>
                  Small
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setSetting(() => setAmount('medium'), {
                    amount: 'medium',
                  })
                }
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  amount === 'medium' && s.selected,
                ]}>
                <Text style={[s.unitText]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setSetting(() => setAmount('large'), {
                    amount: 'large',
                  })
                }
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitRight,
                  amount === 'large' && s.selected,
                ]}>
                <Text style={s.unitText}>Large</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={[s.unitTitle, s.darkTextMain]}>Dispence to</Text>
            <View style={s.units}>
              <TouchableOpacity
                onPress={() =>
                  setSetting(() => setDispence('tray'), {
                    dispenceTo: 'tray',
                  })
                }
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitLeft,
                  dispence === 'tray' && s.selected,
                ]}>
                <Text style={s.unitText}>Tray</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setSetting(() => setDispence('cup'), {
                    dispenceTo: 'cup',
                  })
                }
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitRight,
                  dispence === 'cup' && s.selected,
                ]}>
                <Text style={s.unitText}>Cup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Collapsible>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>Units</Text>
        <View style={s.units}>
          <TouchableOpacity
            onPress={() =>
              setSetting(() => setUnits('metric'), {
                units: 'metric',
              })
            }
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitLeft,
              units === 'metric' && s.selected,
            ]}>
            <Text style={s.unitText}>°C - ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSetting(() => setUnits('customary'), {
                units: 'customary',
              })
            }
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitRight,
              units === 'customary' && s.selected,
            ]}>
            <Text style={s.unitText}>°F - oz</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>
          Notifications
        </Text>
        <Switch
          value={notifications}
          onChange={() =>
            setSetting(() => setNotifications(prev => !prev), {
              notifications: !notifications,
            })
          }
          sx={{
            props: {
              trackColor: {
                true: colors.green.mid,
              },
            },
          }}
        />
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>
          App color theme
        </Text>
        <View style={s.units}>
          <TouchableOpacity
            onPress={() => setThemeFx('dark')}
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitLeft,
              isDarkMode && s.selected,
            ]}>
            <Text style={s.unitText}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setThemeFx('light')}
            style={[
              s.unit,
              isDarkMode && s.darkUnit,
              s.unitRight,
              !isDarkMode && s.selected,
            ]}>
            <Text style={s.unitText}>Light</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonSettings;
