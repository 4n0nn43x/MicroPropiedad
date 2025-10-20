'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, TrendingUp, DollarSign, Percent } from 'lucide-react';

interface PropertyCardProps {
  property: any;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const progressPercent = (property.soldShares / property.totalShares) * 100;

  const statusColors: Record<string, string> = {
    'active': 'bg-accent-green',
    'sold-out': 'bg-accent-purple',
    'upcoming': 'bg-accent-cyan',
  };

  const statusLabels: Record<string, string> = {
    'active': 'Active',
    'sold-out': 'Sold Out',
    'upcoming': 'Coming Soon',
  };

  return (
    <Link href={`/${locale}/marketplace/${property.id}`}>
      <div className="glass-card-hover overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className={`${statusColors[property.status]} px-3 py-1.5 rounded-lg shadow-lg`}>
              <span className="text-xs font-bold text-white">{statusLabels[property.status]}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Location */}
          <div className="mb-4">
            <h3 className="text-xl font-display font-bold mb-2 text-white group-hover:text-primary-400 transition">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-400">
              <MapPin size={14} className="mr-1.5 flex-shrink-0" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dark-bg p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} className="text-accent-green" />
                <p className="text-xs text-gray-500">Share Price</p>
              </div>
              <p className="text-lg font-bold text-white">{property.sharePrice} STX</p>
            </div>
            <div className="bg-dark-bg p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Percent size={16} className="text-primary-400" />
                <p className="text-xs text-gray-500">ROI</p>
              </div>
              <p className="text-lg font-bold text-white flex items-center">
                {property.roi}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="font-bold text-white">{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink h-2 rounded-full transition-all duration-500 shadow-glow"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{property.soldShares.toLocaleString()} sold</span>
              <span>{property.totalShares.toLocaleString()} total</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent-green" />
              <span className="text-sm text-gray-400">
                ${property.propertyValue.toLocaleString()}
              </span>
            </div>
            <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
