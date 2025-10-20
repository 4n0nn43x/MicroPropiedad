'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar } from 'lucide-react';

export default function PortfolioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Mock portfolio data
  const stats = {
    totalInvested: 125000,
    currentValue: 158750,
    totalReturns: 33750,
    returnPercentage: 27,
    propertiesOwned: 8,
    totalShares: 245,
  };

  const investments = [
    {
      id: 1,
      name: 'Modern Loft Downtown',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      location: 'New York, USA',
      sharesOwned: 45,
      totalShares: 1000,
      invested: 22500,
      currentValue: 28800,
      returns: 6300,
      returnPercentage: 28,
      monthlyPayout: 450,
      nextPayout: '2025-11-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'Beachfront Villa',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      location: 'Miami, USA',
      sharesOwned: 30,
      totalShares: 800,
      invested: 18000,
      currentValue: 21600,
      returns: 3600,
      returnPercentage: 20,
      monthlyPayout: 360,
      nextPayout: '2025-11-20',
      status: 'active',
    },
    {
      id: 3,
      name: 'Urban Apartment Complex',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      location: 'Los Angeles, USA',
      sharesOwned: 60,
      totalShares: 1200,
      invested: 30000,
      currentValue: 36000,
      returns: 6000,
      returnPercentage: 20,
      monthlyPayout: 540,
      nextPayout: '2025-11-18',
      status: 'active',
    },
  ];

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
        <p className="text-gray-400">Track your real estate investments and returns</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Invested</p>
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-primary-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.totalInvested.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{stats.propertiesOwned} properties</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Current Value</p>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.currentValue.toLocaleString()}
          </p>
          <p className="text-xs text-accent-green">+${stats.totalReturns.toLocaleString()} total</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Returns</p>
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
              <Percent size={20} className="text-accent-purple" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.returnPercentage}%
          </p>
          <p className="text-xs text-gray-500">Average ROI</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Shares</p>
            <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <Calendar size={20} className="text-accent-pink" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.totalShares}
          </p>
          <p className="text-xs text-gray-500">Across all properties</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Investments</h2>
        <div className="flex gap-2">
          {['all', '1M', '3M', '6M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>
      </div>

      {/* Investments List */}
      <div className="space-y-4">
        {investments.map((investment) => (
          <div key={investment.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
            <div className="flex gap-6">
              {/* Property Image */}
              <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={investment.image}
                  alt={investment.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{investment.name}</h3>
                    <p className="text-sm text-gray-400">{investment.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shares Owned</p>
                    <p className="text-sm font-bold text-white">
                      {investment.sharesOwned} / {investment.totalShares}
                    </p>
                    <p className="text-xs text-gray-600">
                      {((investment.sharesOwned / investment.totalShares) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invested</p>
                    <p className="text-sm font-bold text-white">
                      ${investment.invested.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Value</p>
                    <p className="text-sm font-bold text-white">
                      ${investment.currentValue.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Returns</p>
                    <p className="text-sm font-bold text-accent-green">
                      +${investment.returns.toLocaleString()} ({investment.returnPercentage}%)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monthly Payout</p>
                    <p className="text-sm font-bold text-white">
                      ${investment.monthlyPayout}
                    </p>
                    <p className="text-xs text-gray-600">Next: {investment.nextPayout}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/${locale}/marketplace/${investment.id}`}
                    className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition">
                    Claim Payout
                  </button>
                  <button className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition">
                    Sell Shares
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
