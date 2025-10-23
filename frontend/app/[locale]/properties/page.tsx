'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MoreVertical, Edit, Trash2, Eye, Users, DollarSign, TrendingUp, Wallet, Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@/lib/hooks/useWallet';
import { useProperties } from '@/lib/hooks/useProperties';

export default function MyPropertiesPage() {
  const t = useTranslations('properties');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { connected, address, connect } = useWallet();
  const { data: allProperties, isLoading } = useProperties();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Wallet connection guard
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Wallet size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('wallet.connectTitle')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectDescription')}</p>
          <button
            onClick={connect}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            {t('wallet.connectButton')}
          </button>
        </div>
      </div>
    );
  }

  // Filter properties owned by current user (registered by their wallet)
  const myProperties = allProperties?.filter(prop =>
    prop.owner && address && prop.owner.toLowerCase() === address.toLowerCase()
  ) || [];

  // Log for debugging
  if (allProperties && address) {
    console.log('\n🏢 MY PROPERTIES PAGE');
    console.log('👤 Current wallet address:', address);
    console.log('📊 Total properties in system:', allProperties.length);
    console.log('🏘️ Properties owned by me:', myProperties.length);
    allProperties.forEach((prop, idx) => {
      const isOwned = prop.owner && prop.owner.toLowerCase() === address.toLowerCase();
      console.log(`  [${idx + 1}] ${prop.name}`, {
        owner: prop.owner || 'N/A',
        isOwnedByMe: isOwned ? '✅ YES' : '❌ NO',
      });
    });
  }

  // Calculate stats from blockchain data
  const stats = {
    totalProperties: myProperties.length,
    totalValue: myProperties.reduce((sum, p) => sum + p.propertyValue, 0),
    totalRaised: myProperties.reduce((sum, p) => sum + (p.soldShares * p.sharePrice), 0),
    totalInvestors: myProperties.reduce((sum, p) => sum + p.soldShares, 0), // Approximate
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('loading.message')}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-accent-green/10 text-accent-green';
      case 'sold_out':
        return 'bg-primary-500/10 text-primary-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return t('status.active');
      case 'sold_out':
        return t('status.soldOut');
      case 'pending':
        return t('status.pending');
      default:
        return status;
    }
  };

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('header.title')}</h1>
          <p className="text-gray-400">{t('header.description')}</p>
        </div>
        <Link
          href={`/${locale}/add-property`}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
        >
          {t('header.addButton')}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalProperties')}</p>
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <Users size={20} className="text-primary-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProperties}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalValue')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
              <DollarSign size={20} className="text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalRaised')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-purple" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalRaised.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalInvestors')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <Users size={20} className="text-accent-pink" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalInvestors}</p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{t('list.title')}</h2>

        {myProperties.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Building2 size={64} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-white mb-2">{t('empty.title')}</h3>
            <p className="text-gray-400 mb-6">
              {t('empty.description')}
            </p>
            <Link
              href={`/${locale}/add-property`}
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
            >
              {t('empty.addButton')}
            </Link>
          </div>
        ) : (
          myProperties.map((property) => (
          <div key={property.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
            <div className="flex gap-6">
              {/* Property Image */}
              <div className="relative w-56 h-40 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={property.imageUrl}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                    <p className="text-sm text-gray-400">{property.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === property.id ? null : property.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {menuOpen === property.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-10">
                          <Link
                            href={`/${locale}/marketplace/${property.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                          >
                            <Eye size={16} />
                            <span>{t('menu.view')}</span>
                          </Link>
                          <Link
                            href={`/${locale}/edit-property/${property.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                          >
                            <Edit size={16} />
                            <span>{t('menu.edit')}</span>
                          </Link>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-hover hover:text-red-300 transition">
                            <Trash2 size={16} />
                            <span>{t('menu.delete')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t('list.fundingProgress')}</span>
                    <span className="text-white font-medium">
                      {((property.soldShares / property.totalShares) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-purple rounded-full transition-all"
                      style={{ width: `${(property.soldShares / property.totalShares) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('list.totalShares')}</p>
                    <p className="text-sm font-bold text-white">{property.totalShares}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('list.sharesSold')}</p>
                    <p className="text-sm font-bold text-white">{property.soldShares}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('list.pricePerShare')}</p>
                    <p className="text-sm font-bold text-white">{property.sharePrice} STX</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('list.totalRaised')}</p>
                    <p className="text-sm font-bold text-accent-green">
                      {(property.soldShares * property.sharePrice).toFixed(2)} STX
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('list.roi')}</p>
                    <p className="text-sm font-bold text-white">{property.roi}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-gray-500">{property.soldShares} {t('list.sharesSoldLabel')}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-500">{property.totalShares - property.soldShares} {t('list.available')}</span>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
