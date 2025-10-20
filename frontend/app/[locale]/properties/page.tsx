'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MoreVertical, Edit, Trash2, Eye, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function MyPropertiesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Mock properties data (properties user has listed)
  const myProperties = [
    {
      id: 1,
      name: 'Luxury Penthouse Manhattan',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      location: 'New York, USA',
      totalShares: 1000,
      sharesSold: 750,
      sharesAvailable: 250,
      pricePerShare: 500,
      totalRaised: 375000,
      totalValue: 500000,
      monthlyRevenue: 12500,
      investors: 45,
      status: 'active',
      createdAt: '2025-01-15',
    },
    {
      id: 2,
      name: 'Beachfront Villa Miami',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      location: 'Miami, USA',
      totalShares: 800,
      sharesSold: 800,
      sharesAvailable: 0,
      pricePerShare: 600,
      totalRaised: 480000,
      totalValue: 480000,
      monthlyRevenue: 9600,
      investors: 32,
      status: 'sold_out',
      createdAt: '2024-11-20',
    },
    {
      id: 3,
      name: 'Modern Loft Downtown',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      location: 'Los Angeles, USA',
      totalShares: 1200,
      sharesSold: 450,
      sharesAvailable: 750,
      pricePerShare: 400,
      totalRaised: 180000,
      totalValue: 480000,
      monthlyRevenue: 7200,
      investors: 28,
      status: 'active',
      createdAt: '2025-09-10',
    },
  ];

  const stats = {
    totalProperties: myProperties.length,
    totalValue: myProperties.reduce((sum, p) => sum + p.totalValue, 0),
    totalRaised: myProperties.reduce((sum, p) => sum + p.totalRaised, 0),
    totalInvestors: myProperties.reduce((sum, p) => sum + p.investors, 0),
  };

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
        return 'Active';
      case 'sold_out':
        return 'Sold Out';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Properties</h1>
          <p className="text-gray-400">Manage properties you've listed on the platform</p>
        </div>
        <Link
          href={`/${locale}/add-property`}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
        >
          + Add New Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Properties</p>
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <Users size={20} className="text-primary-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProperties}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Value</p>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
              <DollarSign size={20} className="text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Raised</p>
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-purple" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalRaised.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Investors</p>
            <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <Users size={20} className="text-accent-pink" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalInvestors}</p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">All Properties</h2>

        {myProperties.map((property) => (
          <div key={property.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
            <div className="flex gap-6">
              {/* Property Image */}
              <div className="relative w-56 h-40 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={property.image}
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
                            <span>View</span>
                          </Link>
                          <Link
                            href={`/${locale}/edit-property/${property.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-hover hover:text-red-300 transition">
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-white font-medium">
                      {((property.sharesSold / property.totalShares) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-purple rounded-full transition-all"
                      style={{ width: `${(property.sharesSold / property.totalShares) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Shares</p>
                    <p className="text-sm font-bold text-white">{property.totalShares}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shares Sold</p>
                    <p className="text-sm font-bold text-white">{property.sharesSold}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price per Share</p>
                    <p className="text-sm font-bold text-white">${property.pricePerShare}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Raised</p>
                    <p className="text-sm font-bold text-accent-green">
                      ${property.totalRaised.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monthly Revenue</p>
                    <p className="text-sm font-bold text-white">${property.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-gray-500">{property.investors} investors</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-500">Listed on {property.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
