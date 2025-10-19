'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/property/PropertyCard';
import { demoProperties } from '@/lib/demoData';

export default function MarketplacePage() {
  const t = useTranslations('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = demoProperties;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.sharePrice - b.sharePrice;
        case 'priceDesc':
          return b.sharePrice - a.sharePrice;
        case 'roiDesc':
          return b.roi - a.roi;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filterStatus, sortBy]);

  const stats = {
    total: demoProperties.length,
    active: demoProperties.filter(p => p.status === 'active').length,
    soldOut: demoProperties.filter(p => p.status === 'sold-out').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Property Marketplace</h1>
          <p className="text-xl text-gray-600">
            Explore tokenized real estate opportunities in Latin America
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <p className="text-4xl font-bold text-primary-600">{stats.total}</p>
            <p className="text-gray-600 mt-2">Total Properties</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <p className="text-4xl font-bold text-success">{stats.active}</p>
            <p className="text-gray-600 mt-2">Active</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <p className="text-4xl font-bold text-gray-400">{stats.soldOut}</p>
            <p className="text-gray-600 mt-2">Sold Out</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="sold-out">Sold Out</option>
                  <option value="upcoming">Coming Soon</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="roiDesc">Highest ROI</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setSortBy('newest');
                  }}
                  className="w-full px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold">{filteredProperties.length}</span> of{' '}
            <span className="font-bold">{demoProperties.length}</span> properties
          </p>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
