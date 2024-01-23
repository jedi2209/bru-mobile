import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderIcon from '../../core/components/icons/HeaderIcon';
import {basicStyles, colors} from '../../core/const/style';
import Input from '../../core/components/Input';
import FacebookLogo from '../../core/components/icons/FacebookLogo';
import GoogleLogo from '../../core/components/icons/GoogleLogo';
import AppleLogo from '../../core/components/icons/AppleLogo';

const s = StyleSheet.create({
  container: {
    backgroundColor: '#353535',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    backgroundColor: '#222222',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 44,
    paddingBottom: 25,
  },
  iconWrapper: {
    borderWidth: 18,
    borderColor: colors.green.mid,
  },
  main: {
    width: '100%',
    paddingHorizontal: 26,
    display: 'flex',
    alignItems: 'center',
    marginTop: 14,
  },
  authSelector: {
    ...basicStyles.rowBetween,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#2B2B2B',
  },
  authSelectorButton: {
    paddingVertical: 11,
    width: '50%',
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
  },
  authSelectorText: {
    color: colors.gray.lightGray,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  selected: {borderBottomColor: colors.green.mid},
  input: {
    width: '100%',
  },
  label: {marginLeft: 15},
  remindPassword: {
    color: colors.green.mid,
    textDecorationLine: 'underline',
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    marginBottom: 30,
  },
  socialNetworkText: {
    color: colors.gray.lightGray,
    lineHeight: 18,
    letterSpacing: 0.4,
    marginBottom: 24,
  },
  signUpInput: {marginBottom: 40},
  socialButton: {
    ...basicStyles.row,
    gap: 10,
    marginBottom: 18,
    borderRadius: 4,
  },
  socialButtonText: {
    color: colors.white,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  facebookButton: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: '#3B5998',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  logoWrapper: {
    backgroundColor: colors.white,
    padding: 10,
    marginLeft: 1,
    marginVertical: 1,
  },
  googleText: {
    paddingRight: 17,
    marginLeft: 7.5,
  },
  appleButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 26.7,
    paddingVertical: 12,
  },
});

const AuthorizationScreen = () => {
  const [authState, setAuthState] = useState('login');

  return (
    <ScrollView showsVerticalScrollIndicator style={s.container}>
      <View style={s.wrapper}>
        <View style={s.header}>
          <View style={s.iconWrapper}>
            <HeaderIcon size={74} />
          </View>
        </View>
        <View style={s.authSelector}>
          <TouchableOpacity
            onPress={() => setAuthState('login')}
            style={[s.authSelectorButton, authState === 'login' && s.selected]}>
            <Text style={s.authSelectorText}>Existing user</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAuthState('register')}
            style={[
              s.authSelectorButton,
              authState === 'register' && s.selected,
            ]}>
            <Text style={s.authSelectorText}>New user</Text>
          </TouchableOpacity>
        </View>
        <View style={s.main}>
          {authState === 'register' && (
            <Input
              wrapperStyle={s.input}
              labelStyle={s.label}
              placeholder="Please enter your name"
              label="Name"
            />
          )}
          <Input
            wrapperStyle={s.input}
            labelStyle={s.label}
            placeholder="Please enter your email"
            label="Email"
          />
          <Input
            wrapperStyle={s.input}
            labelStyle={s.label}
            placeholder="Please enter your password"
            label="Password"
            secure
            withIcon
          />
          {authState === 'register' && (
            <Input
              wrapperStyle={{...s.input, ...s.signUpInput}}
              labelStyle={s.label}
              placeholder="Please confirm your password"
              label="Confirm Password"
              secure
              withIcon
            />
          )}
          {authState === 'login' && (
            <TouchableOpacity style={{alignSelf: 'flex-end'}}>
              <Text style={s.remindPassword}>Remind my password</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[basicStyles.backgroundButton, s.button]}>
            <Text style={basicStyles.backgroundButtonText}>
              {authState === 'login' ? 'Log in' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={s.socialNetworkText}>
          {authState === 'login' ? 'Log in' : 'Sign up'} with social networks
        </Text>
        <TouchableOpacity style={[s.socialButton, s.facebookButton]}>
          <FacebookLogo />
          <Text style={s.socialButtonText}>
            {authState === 'login' ? 'Sign in' : 'Sign up'} with Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.socialButton, s.googleButton]}>
          <View style={s.logoWrapper}>
            <GoogleLogo />
          </View>
          <Text style={[s.socialButtonText, s.googleText]}>
            {authState === 'login' ? 'Sign in' : 'Sign up'} with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.socialButton, s.appleButton]}>
          <AppleLogo />
          <Text style={s.socialButtonText}>
            {authState === 'login' ? 'Sign in' : 'Sign up'} with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AuthorizationScreen;
