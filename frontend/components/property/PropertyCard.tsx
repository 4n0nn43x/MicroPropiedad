'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, TrendingUp, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const progressPercent = (property.soldShares / property.totalShares) * 100;

  const statusVariant = {
    'active': 'success' as const,
    'sold-out': 'danger' as const,
    'upcoming': 'info' as const,
  }[property.status];

  const statusLabel = {
    'active': 'Active',
    'sold-out': 'Sold Out',
    'upcoming': 'Coming Soon',
  }[property.status];

  return (
    <Link href={`/${locale}/marketplace/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge variant={statusVariant}>
              {statusLabel}
            </Badge>
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg">
            <span className="font-bold text-primary-600">{property.propertyType}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition">
            {property.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm">{property.location}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Share Price</p>
              <p className="text-lg font-bold text-primary-600">${property.sharePrice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Est. ROI</p>
              <p className="text-lg font-bold text-success flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {property.roi}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                {property.soldShares.toLocaleString()} / {property.totalShares.toLocaleString()} shares
              </span>
              <span className="font-bold text-primary-600">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{property.stats.totalInvestors} investors</span>
            </div>
            <div className="text-sm text-gray-600">
              Total: ${property.totalValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
