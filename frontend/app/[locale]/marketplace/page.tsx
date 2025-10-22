'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useProperties } from '@/lib/hooks/useProperties';
import { useTranslations } from 'next-intl';

export default function MarketplacePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [activeCategory, setActiveCategory] = useState('all');
  const t = useTranslations();

  // Fetch properties from smart contracts
  const { data: contractProperties, isLoading } = useProperties();

  const categories = [
    { id: 'all', label: 'All Properties' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'vacation', label: 'Vacation Rentals' },
    { id: 'land', label: 'Land' },
    { id: 'development', label: 'Under Development' },
  ];

  // Map blockchain properties to display format
  const displayProperties = contractProperties ? contractProperties.map(prop => ({
    id: parseInt(prop.id),
    name: prop.name,
    image: prop.imageUrl,
    location: prop.location,
    owner: prop.contractAddress,
    totalShares: prop.totalShares,
    availableShares: prop.totalShares - prop.soldShares,
    sharePrice: prop.sharePrice,
    roi: prop.roi,
    verified: prop.status === 'active',
  })) : [];

  // Calculate top performing properties from blockchain data
  const topProperties = displayProperties
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 2)
    .map((prop, idx) => ({
      name: prop.name,
      location: prop.location,
      avatar: String(idx + 1),
      totalValue: `${(prop.totalShares * prop.sharePrice).toFixed(2)} sBTC`,
      change: `+${prop.roi.toFixed(1)}%`,
      positive: true,
      investors: String(prop.totalShares - prop.availableShares), // Approximate from sold shares
      shares: String(prop.totalShares),
    }));

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto relative">
      {/* Hero Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-purple" />
        <div className="absolute inset-0 flex items-center justify-between px-12">
          {/* Left Content */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-display font-bold text-white">
              {t('marketplace.hero.title').split('with Bitcoin').map((part, i) => (
                i === 0 ? <span key={i}>{part}<br /></span> : <span key={i}>with Bitcoin</span>
              ))}
            </h1>
            <p className="text-white/90 text-lg">
              {t('marketplace.hero.subtitle')}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition">
                {t('marketplace.hero.exploreButton')}
              </button>
              <Link
                href={`/${locale}/add-property`}
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition inline-block"
              >
                {t('marketplace.hero.listButton')}
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <Building2 size={200} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* All Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Available Properties <span className="text-gray-500 text-lg font-normal">
              {isLoading ? 'Loading...' : `${displayProperties.length} listing${displayProperties.length !== 1 ? 's' : ''}`}
            </span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 transition">View all</button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-dark-card text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card/50'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-400">Loading properties from blockchain...</div>
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 size={64} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Properties Yet</h3>
            <p className="text-gray-400 mb-6">Be the first to list a property on the platform!</p>
            <Link
              href={`/${locale}/add-property`}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
            >
              List Your Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {displayProperties.map((property) => (
            <Link
              key={property.id}
              href={`/${locale}/marketplace/${property.id}`}
              className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform"
            >
              {/* Image */}
              <div className="relative h-64">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
                {property.verified && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-accent-green flex items-center justify-center shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Title & Location */}
                <div>
                  <h3 className="font-bold text-white mb-1">{property.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-400">{property.location}</span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Share Price</p>
                    <p className="font-bold text-white">{property.sharePrice} sBTC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Available</p>
                    <p className="font-bold text-white">{property.availableShares}/{property.totalShares}</p>
                  </div>
                </div>

                {/* ROI Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 bg-accent-green/10 text-accent-green rounded-full font-medium">
                    {property.roi}% ROI
                  </span>
                  <TrendingUp size={16} className="text-accent-green" />
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Properties Table */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Top Performing Properties <span className="text-gray-500 text-lg font-normal">Highest ROI</span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 transition">View all</button>
        </div>

        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-dark-border bg-dark-card/30">
            <div className="text-sm font-medium text-gray-400">Property</div>
            <div className="text-sm font-medium text-gray-400">Total Value</div>
            <div className="text-sm font-medium text-gray-400">Performance</div>
            <div className="text-sm font-medium text-gray-400">Investors</div>
            <div className="text-sm font-medium text-gray-400">Shares</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-dark-border">
            {topProperties.map((prop, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-dark-hover transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary-500 to-accent-purple">
                    <img
                      src={`https://i.pravatar.cc/150?img=${prop.avatar}`}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{prop.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={10} />
                      {prop.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-white font-medium">{prop.totalValue}</div>
                <div className="flex items-center">
                  <span className={`${prop.positive ? 'text-accent-green' : 'text-red-400'} font-medium`}>
                    {prop.change}
                  </span>
                </div>
                <div className="flex items-center text-gray-400">{prop.investors}</div>
                <div className="flex items-center text-gray-400">{prop.shares}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
