import NetInfo from '@react-native-community/netinfo';

export default async function () {
  const networkStatus = await NetInfo.fetch();
  return networkStatus.isConnected;
}
