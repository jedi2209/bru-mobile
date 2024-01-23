import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {EyeIcon, EyeOffIcon} from '@gluestack-ui/themed';
import {colors} from '../const/style';

const s = StyleSheet.create({
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
    color: colors.gray.grayDarkText,
  },
  inputContainer: {position: 'relative'},
  icon: {
    position: 'absolute',
    top: '30%',
    right: 17,
  },
});

const Input = ({
  label,
  value,
  onChange,
  placeholder = '',
  wrapperStyle,
  labelStyle,
  inputStyle,
  secure = false,
  withIcon = false,
}) => {
  const [hidden, setHidden] = useState(secure);
  console.log(hidden);
  return (
    <View style={[s.inputWrapper, wrapperStyle]}>
      <Text style={[s.inputLabel, labelStyle]}>{label}</Text>
      <View style={s.inputContainer}>
        <TextInput
          secureTextEntry={hidden}
          onChangeText={text => console.log(text)}
          placeholderTextColor={colors.gray.grayDarkText}
          placeholder={placeholder}
          style={[s.input, inputStyle]}
          value={value}
        />
        {withIcon && (
          <TouchableOpacity
            onPress={() => setHidden(prev => !prev)}
            style={s.icon}>
            {hidden ? <EyeIcon /> : <EyeOffIcon />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
