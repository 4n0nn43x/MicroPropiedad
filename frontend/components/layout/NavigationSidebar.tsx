'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
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

  const navigation = [
    {
      name: 'Marketplace',
      href: `/${locale}/marketplace`,
      icon: Store,
      description: 'Browse properties'
    },
    {
      name: 'My Portfolio',
      href: `/${locale}/portfolio`,
      icon: Briefcase,
      description: 'Your investments'
    },
    {
      name: 'My Properties',
      href: `/${locale}/properties`,
      icon: Building2,
      description: 'Properties you own'
    },
    {
      name: 'Add Property',
      href: `/${locale}/add-property`,
      icon: PlusCircle,
      description: 'List a new property'
    },
    {
      name: 'Transactions',
      href: `/${locale}/transactions`,
      icon: History,
      description: 'Transaction history'
    },
    {
      name: 'Profile',
      href: `/${locale}/profile`,
      icon: UserCircle,
      description: 'Account settings'
    },
  ];

  const isActive = (href: string) => {
    return pathname?.includes(href);
  };

  return (
    <aside className="w-64 h-full bg-dark-bg/30 border-r border-dark-border p-4 space-y-2">
      <div className="mb-6 px-3">
        <h2 className="text-lg font-bold text-white">MicroPropiedad</h2>
        <p className="text-xs text-gray-500">Real Estate Tokenization</p>
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
