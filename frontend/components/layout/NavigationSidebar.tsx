'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Store,
  Briefcase,
  Building2,
  PlusCircle,
  History,
  UserCircle,
  Home
} from 'lucide-react';

export default function NavigationSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('navigation');

  const navigation = [
    {
      name: t('marketplace.name'),
      href: `/${locale}/marketplace`,
      icon: Store,
      description: t('marketplace.description')
    },
    {
      name: t('portfolio.name'),
      href: `/${locale}/portfolio`,
      icon: Briefcase,
      description: t('portfolio.description')
    },
    {
      name: t('properties.name'),
      href: `/${locale}/properties`,
      icon: Building2,
      description: t('properties.description')
    },
    {
      name: t('addProperty.name'),
      href: `/${locale}/add-property`,
      icon: PlusCircle,
      description: t('addProperty.description')
    },
    {
      name: t('transactions.name'),
      href: `/${locale}/transactions`,
      icon: History,
      description: t('transactions.description')
    },
    {
      name: t('profile.name'),
      href: `/${locale}/profile`,
      icon: UserCircle,
      description: t('profile.description')
    },
  ];

  const isActive = (href: string) => {
    return pathname?.includes(href);
  };

  return (
    <aside className="w-64 h-full bg-dark-bg/30 border-r border-dark-border p-4 space-y-2">
      <div className="mb-6 px-3">
        <h2 className="text-lg font-bold text-white">MicroPropiedad</h2>
        <p className="text-xs text-gray-500">{t('tagline')}</p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition group ${
                active
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-gray-400 hover:bg-dark-hover hover:text-white'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary-400' : 'text-gray-500 group-hover:text-white'} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${active ? 'text-primary-400' : ''}`}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-600 group-hover:text-gray-500">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
