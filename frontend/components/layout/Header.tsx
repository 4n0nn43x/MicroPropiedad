'use client';

import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import WalletButton from '@/components/wallet/WalletButton';
import { Building2, Plus } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';

export default function Header() {
  const t = useTranslations('common');
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || 'en';
  const { connected } = useWallet();

  // Get current path without locale for language switching
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-dark-border/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 text-white hover:text-primary-400 transition">
          <Building2 size={32} className="text-primary-500" />
          <span className="text-xl font-bold font-display">MicroPropiedad</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}/marketplace`} className="text-gray-300 hover:text-primary-400 transition font-medium">
            {t('buttons.explore')}
          </Link>
          <Link href={`/${locale}/dashboard`} className="text-gray-300 hover:text-primary-400 transition font-medium">
            Dashboard
          </Link>
          {connected && (
            <Link
              href={`/${locale}/owner/add-property`}
              className="flex items-center gap-1.5 text-accent-green hover:text-accent-cyan transition font-medium"
            >
              <Plus size={18} />
              Add Property
            </Link>
          )}
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-dark-card px-3 py-1.5 rounded-lg border border-dark-border">
            <Link
              href={`/en${pathnameWithoutLocale}`}
              className={`text-sm transition ${locale === 'en' ? 'text-primary-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              EN
            </Link>
            <span className="text-dark-border">|</span>
            <Link
              href={`/es${pathnameWithoutLocale}`}
              className={`text-sm transition ${locale === 'es' ? 'text-primary-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              ES
            </Link>
          </div>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
