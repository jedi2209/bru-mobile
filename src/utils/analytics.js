import firebaseAnalytics from '@react-native-firebase/analytics';

const analyticsLog = async (event, params = {}) => {
  return await firebaseAnalytics().logEvent(event, params);
};

const logScreenView = async routeName => {
  await firebaseAnalytics().logScreenView({
    screen_name: routeName,
    screen_class: routeName,
  });
};

export {analyticsLog, logScreenView};
