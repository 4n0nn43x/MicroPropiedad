'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Download,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Percent,
  Building2,
  X,
} from 'lucide-react';
import { useProperty } from '@/lib/hooks/useProperties';
import { useWallet } from '@/lib/hooks/useWallet';
import { purchaseShares } from '@/lib/stacks/contracts';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const locale = (params?.locale as string) || 'en';

  const { connected, address } = useWallet();
  const { data: property, isLoading } = useProperty(propertyId);

  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [numShares, setNumShares] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Mock images for carousel (in real app, these come from property data)
  const images = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
  ];

  const documents = [
    { name: 'Property Title', type: 'PDF', size: '2.4 MB', url: '#' },
    { name: 'Legal Structure', type: 'PDF', size: '1.8 MB', url: '#' },
    { name: 'Financial Report', type: 'PDF', size: '3.2 MB', url: '#' },
    { name: 'Inspection Report', type: 'PDF', size: '4.1 MB', url: '#' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Building2 size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Property not found</h2>
          <Link href={`/${locale}/marketplace`} className="text-primary-400 hover:underline">
            Return to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = (property.soldShares / property.totalShares) * 100;
  const availableShares = property.totalShares - property.soldShares;

  const handlePurchase = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsPurchasing(true);

    try {
      await purchaseShares(
        `${property.contractAddress}.${property.contractName}`,
        numShares,
        property.sharePrice,
        {
          onFinish: (data) => {
            alert(`Purchase successful! Transaction ID: ${data.txId}`);
            setShowPurchaseModal(false);
          },
          onCancel: () => {
            alert('Purchase cancelled');
          },
        }
      );
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Back Button */}
      <div className="p-6 border-b border-dark-border">
        <Link
          href={`/${locale}/marketplace`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit"
        >
          <ChevronLeft size={20} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="relative rounded-2xl overflow-hidden bg-dark-card">
              <div className="relative h-96">
                <Image
                  src={images[currentImageIndex]}
                  alt={property.name}
                  fill
                  className="object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-card/80 backdrop-blur-xl flex items-center justify-center text-white hover:bg-dark-hover transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-card/80 backdrop-blur-xl flex items-center justify-center text-white hover:bg-dark-hover transition"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-dark-card/80 backdrop-blur-xl flex items-center justify-center text-white hover:bg-dark-hover transition">
                    <Share2 size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-dark-card/80 backdrop-blur-xl flex items-center justify-center text-white hover:bg-dark-hover transition">
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card">
              {/* Tab Headers */}
              <div className="flex border-b border-dark-border">
                {['overview', 'financials', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-medium capitalize transition ${
                      activeTab === tab
                        ? 'text-primary-400 border-b-2 border-primary-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">About this property</h3>
                      <p className="text-gray-400 leading-relaxed">{property.description}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Features</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>Prime Location</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>High Occupancy Rate</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>Professional Management</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>Monthly Dividends</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Property Value</p>
                        <p className="text-2xl font-bold text-white">
                          ${property.propertyValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Annual ROI</p>
                        <p className="text-2xl font-bold text-accent-green">{property.roi}%</p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Total Raised</p>
                        <p className="text-2xl font-bold text-white">
                          {(property.soldShares * property.sharePrice).toLocaleString()} STX
                        </p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Next Payout</p>
                        <p className="text-2xl font-bold text-white">
                          {property.nextPayoutDate || 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-dark-bg rounded-xl hover:bg-dark-hover transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                            <FileText size={20} className="text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition">
                          <Download size={20} className="text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-6 space-y-6">
              {/* Title & Location */}
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-3">{property.name}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-dark-bg p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Share Price</p>
                <p className="text-3xl font-bold text-white">{property.sharePrice} STX</p>
                <p className="text-sm text-gray-500 mt-1">≈ ${(property.sharePrice * 0.5).toFixed(2)} USD</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="font-bold text-white">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink h-3 rounded-full transition-all duration-500 shadow-glow"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{property.soldShares.toLocaleString()} sold</span>
                  <span>{availableShares.toLocaleString()} available</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-bg p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent size={14} className="text-primary-400" />
                    <p className="text-xs text-gray-500">ROI</p>
                  </div>
                  <p className="font-bold text-white">{property.roi}%</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-accent-purple" />
                    <p className="text-xs text-gray-500">Investors</p>
                  </div>
                  <p className="font-bold text-white">145</p>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => setShowPurchaseModal(true)}
                disabled={availableShares === 0}
                className="btn btn-primary w-full"
              >
                {availableShares === 0 ? 'Sold Out' : 'Purchase Shares'}
              </button>

              {/* Info */}
              <div className="text-xs text-gray-500 space-y-2">
                <p>• Minimum purchase: 1 share</p>
                <p>• Monthly dividend distribution</p>
                <p>• Secured by blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Purchase Shares</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Shares
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableShares}
                  value={numShares}
                  onChange={(e) => setNumShares(parseInt(e.target.value) || 1)}
                  className="input-dark w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {availableShares.toLocaleString()} shares
                </p>
              </div>

              {/* Summary */}
              <div className="bg-dark-bg p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Share Price</span>
                  <span className="text-white font-medium">{property.sharePrice} STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white font-medium">{numShares}</span>
                </div>
                <div className="border-t border-dark-border pt-3 flex justify-between">
                  <span className="text-white font-bold">Total Cost</span>
                  <span className="text-white font-bold">{(property.sharePrice * numShares).toFixed(2)} STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. Monthly Return</span>
                  <span className="text-accent-green">
                    {((property.sharePrice * numShares * property.roi) / 100 / 12).toFixed(2)} STX
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing || !connected}
                  className="btn btn-primary flex-1"
                >
                  {isPurchasing ? 'Processing...' : connected ? 'Confirm Purchase' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
