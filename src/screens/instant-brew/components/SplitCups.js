import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CupIcon from '../../../core/components/icons/CupIcon';
import ArrowIcon from '../../../core/components/icons/ArrowIcon';
import Collapsible from 'react-native-collapsible';
import {colors, fonts} from '../../../core/const/style';
import MinusIcon from '../../../core/components/icons/MinusIcon';
import PlusIcon from '../../../core/components/icons/PlusIcon';
import {Switch} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {$themeStore} from '../../../core/store/theme';

const s = StyleSheet.create({
  container: {
    marginTop: 33,
    marginBottom: 30,
  },
  splitCupButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitCup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cupIcon: {
    marginRight: 6,
  },
  splitCupButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: fonts.defaultMenuFamily,
    marginRight: 5,
  },
  arrowIcon: {
    transform: [{rotate: '180deg'}],
  },
  collapsible: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3E3E3E',
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 1,
  },
  collapsibleTitle: {
    color: colors.gray.grayLightText,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.defaultMenuFamily,
    lineHeight: 17,
    letterSpacing: 0.4,
  },
  collapsibleSubTitle: {
    color: colors.gray.grayLightText,
    fontFamily: fonts.defaultMenuFamily,
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.4,
    lineHeight: 17,
  },
  collapsibleValue: {
    color: colors.gray.grayLightText,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 17,
    letterSpacing: 0.4,
    marginRight: 15,
  },
  counterButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderColor: colors.green.mid,
    height: 29,
    borderWidth: 1,
    backgroundColor: '#2A2A2A',
  },
  incrementButton: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  decrementButton: {
    borderLeftWidth: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cleaning: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleaningText: {
    color: colors.gray.lightGray,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    lineHeight: 22,
  },
});

const SplitCups = ({cleaning, setCleaning}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [splitedCups, setSplitedCups] = useState(0);
  const theme = useStore($themeStore);

  return (
    <View style={s.container}>
      <View style={s.splitCup}>
        <TouchableOpacity
          style={s.splitCupButton}
          onPress={() => setIsCollapsed(!isCollapsed)}>
          <CupIcon style={s.cupIcon} width={16} height={16} />
          <Text
            style={[
              s.splitCupButtonText,
              theme === 'light' && {color: colors.green.mid},
            ]}>
            Split cups {splitedCups > 0 && `(${splitedCups})`}
          </Text>
          <ArrowIcon style={isCollapsed && s.arrowIcon} />
        </TouchableOpacity>
        <View style={s.cleaning}>
          <Switch
            value={cleaning}
            onChange={() => setCleaning(prev => !prev)}
            sx={{
              _light: {
                props: {
                  trackColor: {
                    true: '#34C759',
                    false: 'rgba(120, 120, 128, 0.36)',
                  },
                },
              },
              _dark: {
                props: {
                  trackColor: {
                    false: 'rgba(120, 120, 128, 0.32)',
                    true: '#34C759',
                  },
                },
              },
            }}
          />
          <Text
            style={[
              s.cleaningText,
              theme === 'light' && {color: colors.gray.grayDarkText},
            ]}>
            Cleaning
          </Text>
        </View>
      </View>
      <Collapsible style={{height: 100}} collapsed={isCollapsed}>
        <View
          style={[
            s.collapsible,
            theme === 'light' && {backgroundColor: '#F2F2F2'},
          ]}>
          <View>
            <Text
              style={[
                s.collapsibleTitle,
                theme === 'light' && {color: colors.gray.grayDarkText},
              ]}>
              Split cups:
            </Text>
            <Text
              style={[
                s.collapsibleSubTitle,
                theme === 'light' && {color: colors.gray.grayDarkText},
              ]}>
              *Cold Water difusion not applied
            </Text>
          </View>
          <View style={s.counterButtons}>
            <Text
              style={[
                s.collapsibleValue,
                theme === 'light' && {color: colors.gray.grayDarkText},
              ]}>
              {splitedCups}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSplitedCups(prev => {
                  if (prev - 1 < 0) {
                    return 0;
                  }
                  return prev - 1;
                })
              }
              style={[
                s.counterButton,
                s.incrementButton,
                theme === 'light' && {backgroundColor: '#E6E7E8'},
              ]}>
              <MinusIcon width={15} height={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSplitedCups(prev => prev + 1)}
              style={[
                s.counterButton,
                s.decrementButton,
                theme === 'light' && {backgroundColor: '#E6E7E8'},
              ]}>
              <PlusIcon width={15} height={15} />
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default SplitCups;
