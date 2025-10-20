'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { connectWallet, disconnectWallet, isWalletConnected, getAddress } from '@/lib/stacks/wallet';
import { Wallet } from 'lucide-react';

export default function WalletButton() {
  const t = useTranslations('common.buttons');
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      const isConnected = isWalletConnected();
      setConnected(isConnected);
      if (isConnected) {
        setAddress(getAddress());
      }
    };

    checkConnection();
    // Check connection status on mount and when window gains focus
    window.addEventListener('focus', checkConnection);
    return () => window.removeEventListener('focus', checkConnection);
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setConnected(true);
      setAddress(getAddress());
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setConnected(false);
    setAddress(null);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected && address) {
    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-green to-accent-cyan text-white rounded-xl hover:shadow-glow transition-all font-medium"
      >
        <Wallet size={18} />
        <span className="hidden md:inline">{truncateAddress(address)}</span>
        <span className="md:hidden">Connected</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="btn btn-primary"
    >
      <Wallet size={18} />
      <span>{t('connect')}</span>
    </button>
  );
}
