'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet, getAddress, isWalletConnected, userSession } from '../stacks/wallet';
import { getAccountBalance } from '../stacks/api';
import { useQuery } from '@tanstack/react-query';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      const isConnected = isWalletConnected();
      setConnected(isConnected);
      if (isConnected) {
        setAddress(getAddress());
      } else {
        setAddress(null);
      }
    };

    checkConnection();

    // Listen for auth response
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', checkConnection);
      return () => window.removeEventListener('focus', checkConnection);
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      setConnected(true);
      setAddress(getAddress());
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    disconnectWallet();
    setConnected(false);
    setAddress(null);
  }, []);

  return {
    connected,
    address,
    isConnecting,
    connect,
    disconnect,
  };
}

/**
 * Get user's STX balance
 */
export function useBalance(address?: string | null) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      if (!address) return null;

      try {
        const balance = await getAccountBalance(address);
        return {
          stx: Number(balance.stx) / 1000000, // Convert from micro-STX to STX
          locked: Number(balance.locked) / 1000000,
          unlockHeight: balance.unlock_height,
        };
      } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
      }
    },
    enabled: !!address,
    refetchInterval: 30000,
  });
}
