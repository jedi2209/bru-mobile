import {useController} from 'react-hook-form';
import React, {TextInput} from 'react-native';
import {colors} from '../../core/const/style';

export const Input = ({
  name,
  control,
  style,
  keyboardType,
  placeholder,
  multiline,
  numberOfLines,
}) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name,
  });
  return (
    <TextInput
      keyboardType={keyboardType}
      value={field.value}
      onChangeText={field.onChange}
      style={style}
      placeholder={placeholder}
      placeholderTextColor={colors.gray.grayDarkText}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
};
