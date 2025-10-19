'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, TrendingUp, Users, Building2, Calendar, FileText, Download, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { demoProperties } from '@/lib/demoData';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const property = demoProperties.find(p => p.id === propertyId);

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents' | 'activity'>('overview');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [numShares, setNumShares] = useState(1);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  const progressPercent = (property.soldShares / property.totalShares) * 100;
  const availableShares = property.totalShares - property.soldShares;
  const totalCost = property.sharePrice * numShares;
  const estimatedMonthlyReturn = (totalCost * (property.roi / 100)) / 12;

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

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Building2 },
    { id: 'financials' as const, label: 'Financials', icon: TrendingUp },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'activity' as const, label: 'Activity', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/en/marketplace" className="hover:text-primary-600">Marketplace</a>
          <ChevronRight size={16} />
          <span>{property.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src={property.image}
                alt={property.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </div>
            </div>

            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-3">{property.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{property.propertyType}</Badge>
                <Badge variant="info">Built {property.yearBuilt}</Badge>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 pb-4 border-b-2 transition
                        ${activeTab === tab.id
                          ? 'border-primary-600 text-primary-600 font-semibold'
                          : 'border-transparent text-gray-600 hover:text-primary-600'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3">Key Features</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Total Property Value</p>
                    <p className="text-3xl font-bold text-primary-600">${property.totalValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Estimated Annual ROI</p>
                    <p className="text-3xl font-bold text-success">{property.roi}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Total Raised</p>
                    <p className="text-3xl font-bold">${property.stats.totalRaised.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600 mb-2">Total Investors</p>
                    <p className="text-3xl font-bold">{property.stats.totalInvestors}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-4">Revenue Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payout</span>
                      <span className="font-semibold">{property.stats.lastPayout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Payout</span>
                      <span className="font-semibold">{property.stats.nextPayout}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {property.documents.map((doc, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="text-primary-600" size={32} />
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-sm text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Download size={24} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <p className="text-gray-600">Activity feed coming soon...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Purchase Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Share Price</p>
                  <p className="text-4xl font-bold text-primary-600">${property.sharePrice}</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{property.soldShares.toLocaleString()} shares sold</span>
                    <span className="font-bold text-primary-600">{progressPercent.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Available Shares</span>
                    <span className="font-bold">{availableShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Minimum Purchase</span>
                    <span className="font-bold">{property.minPurchase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. ROI (Annual)</span>
                    <span className="font-bold text-success">{property.roi}%</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowPurchaseModal(true)}
                  disabled={property.status !== 'active'}
                >
                  {property.status === 'active' ? 'Purchase Shares' : 'Not Available'}
                </Button>
              </div>

              {/* Stats Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Property Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Contract Address</p>
                    <p className="text-xs font-mono bg-gray-50 p-2 rounded break-all">{property.contractAddress}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Investors</span>
                    <span className="font-bold">{property.stats.totalInvestors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Raised</span>
                    <span className="font-bold">${property.stats.totalRaised.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Purchase Shares"
        maxWidth="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Shares
            </label>
            <input
              type="number"
              min={property.minPurchase}
              max={availableShares}
              value={numShares}
              onChange={(e) => setNumShares(parseInt(e.target.value) || property.minPurchase)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Min: {property.minPurchase} | Max: {availableShares} available
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Share Price</span>
              <span className="font-bold">${property.sharePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shares</span>
              <span className="font-bold">{numShares}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-900 font-semibold">Total Cost</span>
              <span className="text-2xl font-bold text-primary-600">${totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Est. Monthly Return</span>
              <span className="font-semibold text-success">${estimatedMonthlyReturn.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowPurchaseModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1">
              Confirm Purchase
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By purchasing, you agree to our Terms of Service and understand the risks involved in real estate investment.
          </p>
        </div>
      </Modal>
    </div>
  );
}
