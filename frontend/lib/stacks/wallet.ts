import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
  ? new StacksMainnet()
  : new StacksTestnet();

export const connectWallet = async () => {
  return new Promise((resolve, reject) => {
    showConnect({
      appDetails: {
        name: 'MicroPropiedad',
        icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        resolve(userSession.loadUserData());
      },
      onCancel: () => {
        reject(new Error('User cancelled'));
      },
      userSession,
    });
  });
};

export const disconnectWallet = () => {
  userSession.signUserOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

export const getAddress = () => {
  if (!userSession.isUserSignedIn()) return null;
  const userData = userSession.loadUserData();
  return process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? userData.profile.stxAddress.mainnet
    : userData.profile.stxAddress.testnet;
};

export const isWalletConnected = () => {
  return userSession.isUserSignedIn();
};
