'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import WalletButton from '@/components/wallet/WalletButton';
import { Building2 } from 'lucide-react';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition">
          <Building2 size={32} />
          <span className="text-xl font-bold">MicroPropiedad</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 transition">
            {t('buttons.explore')}
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
            Dashboard
          </Link>
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/en" className="text-sm text-gray-600 hover:text-primary-600">
              EN
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/es" className="text-sm text-gray-600 hover:text-primary-600">
              ES
            </Link>
          </div>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
