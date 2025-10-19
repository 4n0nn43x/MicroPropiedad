'use client';

import WalletConnect from '@/components/wallet/WalletConnect';
import { Shield, Zap, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-20">
      <div className="max-w-5xl w-full px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred Stacks wallet to get started
          </p>
        </div>

        {/* Wallet Options */}
        <WalletConnect />

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="font-bold mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Protected by Bitcoin's proof of work
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Zap size={24} />
            </div>
            <h3 className="font-bold mb-2">Fast</h3>
            <p className="text-sm text-gray-600">
              Connect in seconds, start investing immediately
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Lock size={24} />
            </div>
            <h3 className="font-bold mb-2">Non-Custodial</h3>
            <p className="text-sm text-gray-600">
              Your keys, your crypto - always in control
            </p>
          </div>
        </div>

        {/* New to Stacks */}
        <div className="mt-12 bg-white/90 backdrop-blur p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-3">New to Stacks?</h3>
          <p className="text-gray-600 mb-4">
            Stacks brings smart contracts to Bitcoin. Choose a wallet above to create your account - it's free and takes less than 2 minutes.
          </p>
          <a
            href="https://www.stacks.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Learn about Stacks →
          </a>
        </div>
      </div>
    </div>
  );
}
