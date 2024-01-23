import React, {Image, StyleSheet, Text, View} from 'react-native';
import {colors, fonts} from '../../../core/const/style';
import LinearGradient from 'react-native-linear-gradient';
import {useStore} from 'effector-react';
import {$themeStore} from '../../store/theme';

const s = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  presentItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 15,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderWidth: 4,
    borderColor: colors.green.mid,
  },
  imageContainer: {
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
  },
  pressetScreenImage: {
    width: 74,
    height: 68,
    marginBottom: 0,
  },
  pressetScreenItem: {
    minWidth: 134,
  },
  title: {
    color: colors.gray.grayDarkText,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.defaultMenuFamily,
  },
});

const PressetItem = ({title, id, img, selected, type}) => {
  const theme = useStore($themeStore);
  return (
    <View style={s.shadow}>
      <LinearGradient
        locations={[0, 0.01, 1]}
        colors={
          theme === 'light'
            ? colors.gradient.pressetItem.light
            : colors.gradient.pressetItem.dark
        }
        style={[
          s.presentItem,
          selected ? s.selectedBorder : {},
          type === 'pressets' && s.pressetScreenItem,
        ]}>
        <View
          style={[
            s.imageContainer,
            type === 'pressets' && s.pressetScreenImageContainer,
          ]}>
          {img ? (
            <Image
              style={[s.image, type === 'pressets' && s.pressetScreenImage]}
              source={img}
            />
          ) : (
            <Image />
          )}
        </View>
        <Text style={s.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

export default PressetItem;
