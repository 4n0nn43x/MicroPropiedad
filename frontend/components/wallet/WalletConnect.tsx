'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { showConnect } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/connect';
import Image from 'next/image';

export default function WalletConnect() {
  const t = useTranslations('login.wallets');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [connecting, setConnecting] = useState(false);

  const wallets = [
    {
      id: 'xverse',
      name: t('xverse.name'),
      description: t('xverse.description'),
      icon: '💼'
    },
    {
      id: 'leather',
      name: t('leather.name'),
      description: t('leather.description'),
      icon: '🎒'
    },
    {
      id: 'hiro',
      name: t('hiro.name'),
      description: t('hiro.description'),
      icon: '🔐'
    }
  ];

  const handleConnect = async (walletId: string) => {
    setConnecting(true);
    try {
      const appConfig = new AppConfig(['store_write', 'publish_data']);
      const userSession = new UserSession({ appConfig });

      await showConnect({
        appDetails: {
          name: 'MicroPropiedad',
          icon: window.location.origin + '/logo.svg',
        },
        onFinish: () => {
          router.push(`/${locale}/marketplace`);
        },
        userSession,
      });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {wallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => handleConnect(wallet.id)}
          disabled={connecting}
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-primary-500 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="h-12 w-12 mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center text-3xl">
            {wallet.icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{wallet.name}</h3>
          <p className="text-gray-600 text-sm">{wallet.description}</p>
        </button>
      ))}
    </div>
  );
}
