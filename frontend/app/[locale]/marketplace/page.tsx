'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, TrendingUp, MapPin, Clock } from 'lucide-react';

export default function MarketplacePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [activeCategory, setActiveCategory] = useState('popular');

  const categories = [
    { id: 'popular', label: 'Popular', icon: '🔥' },
    { id: 'arts', label: 'Arts', icon: '🎨' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'photography', label: 'Photography', icon: '📸' },
  ];

  // Mock properties data
  const properties = [
    {
      id: 1,
      name: 'The Future wave #23',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      author: '@hgjftrentv',
      avatar: '1',
      currentBid: '0.24 BTC',
      endingIn: '12h 14m 16s',
      verified: true,
    },
    {
      id: 2,
      name: 'Astro World #244',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      author: '@nftrsmook',
      avatar: '2',
      currentBid: '0.24 BTC',
      endingIn: '12h 14m 16s',
      verified: true,
    },
    {
      id: 3,
      name: 'Cyber Art #234',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      author: '@tnrsmft',
      avatar: '3',
      currentBid: '0.24 BTC',
      endingIn: '7h 09m 20s',
      verified: true,
    },
    {
      id: 4,
      name: 'Modern Villa #156',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      author: '@realestpro',
      avatar: '4',
      currentBid: '0.18 BTC',
      endingIn: '5h 30m 45s',
      verified: true,
    },
    {
      id: 5,
      name: 'Urban Loft #089',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      author: '@cityhomes',
      avatar: '5',
      currentBid: '0.32 BTC',
      endingIn: '18h 45m 12s',
      verified: false,
    },
    {
      id: 6,
      name: 'Beach House #421',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      author: '@oceanview',
      avatar: '6',
      currentBid: '0.45 BTC',
      endingIn: '22h 10m 30s',
      verified: true,
    },
    {
      id: 7,
      name: 'Mountain Retreat #302',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
      author: '@naturelux',
      avatar: '7',
      currentBid: '0.28 BTC',
      endingIn: '9h 22m 18s',
      verified: true,
    },
    {
      id: 8,
      name: 'Downtown Penthouse #777',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      author: '@skylineking',
      avatar: '8',
      currentBid: '0.55 BTC',
      endingIn: '15h 08m 42s',
      verified: true,
    },
  ];

  const topNFTs = [
    {
      collection: 'Cool Cyber Apes',
      author: '@ryhogsmon',
      avatar: '4',
      volume: '0.24 BTC',
      change: '+25%',
      positive: true,
      owners: '5.5k',
      items: '12.5k',
    },
    {
      collection: 'Shadow Cube',
      author: '@ryhogsmon',
      avatar: '5',
      volume: '0.24 BTC',
      change: '-15%',
      positive: false,
      owners: '5.5k',
      items: '12.5k',
    },
  ];

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Hero Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-purple" />
        <div className="absolute inset-0 flex items-center justify-between px-12">
          {/* Left Content */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-display font-bold text-white">
              Discover, Collect &<br />Create your own NFT
            </h1>
            <p className="text-white/90 text-lg">
              Search items, collection, accounts
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition">
                Discover Now
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition">
                Create your NFT
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-64 h-64">
            <img
              src="https://i.pinimg.com/originals/36/b8/ee/36b8eeb48c6bc1b6bf8e0a1f8b6c1a95.png"
              alt="NFT Character"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* All NFTs Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            All NFTS <span className="text-gray-500 text-lg font-normal">2,345,678 items</span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 transition">See all</button>
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
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-4 gap-6">
          {properties.map((property) => (
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
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Title & Author */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">{property.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img
                          src={`https://i.pravatar.cc/150?img=${property.avatar}`}
                          alt="Author"
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-sm text-gray-400">{property.author}</span>
                    </div>
                  </div>
                  {property.verified && (
                    <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bid Info */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Bid</p>
                    <p className="font-bold text-white">{property.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Ending in</p>
                    <p className="font-bold text-white text-sm">{property.endingIn}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top NFTs Table */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Top NFTS <span className="text-gray-500 text-lg font-normal">564 Creators</span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 transition">See all</button>
        </div>

        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-dark-border bg-dark-card/30">
            <div className="text-sm font-medium text-gray-400">Collection</div>
            <div className="text-sm font-medium text-gray-400">Volume</div>
            <div className="text-sm font-medium text-gray-400">24h %</div>
            <div className="text-sm font-medium text-gray-400">Owners</div>
            <div className="text-sm font-medium text-gray-400">Items</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-dark-border">
            {topNFTs.map((nft, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-dark-hover transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-purple">
                    <img
                      src={`https://i.pravatar.cc/150?img=${nft.avatar}`}
                      alt={nft.collection}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{nft.collection}</p>
                    <p className="text-xs text-gray-500">{nft.author}</p>
                  </div>
                </div>
                <div className="flex items-center text-white font-medium">{nft.volume}</div>
                <div className="flex items-center">
                  <span className={`${nft.positive ? 'text-accent-green' : 'text-red-400'} font-medium`}>
                    {nft.change}
                  </span>
                </div>
                <div className="flex items-center text-gray-400">{nft.owners}</div>
                <div className="flex items-center text-gray-400">{nft.items}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
