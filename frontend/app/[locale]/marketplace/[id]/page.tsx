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
import { useTranslations } from 'next-intl';
import { useProperty } from '@/lib/hooks/useProperties';
import { useWallet } from '@/lib/hooks/useWallet';
import { purchaseShares } from '@/lib/stacks/contracts';

export default function PropertyDetailPage() {
  const t = useTranslations('propertyDetail');
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

  // Log property data when loaded
  if (property && !isLoading) {
    console.log('\n🏠 PROPERTY DETAIL PAGE - Data loaded for property #' + propertyId);
    console.log('📊 Property overview:', {
      id: property.id,
      name: property.name,
      location: property.location,
      propertyType: property.propertyType || '❌ not set',
      status: property.status,
      contractAddress: property.contractAddress,
      contractName: property.contractName,
    });
    console.log('💰 Financial info:', {
      sharePrice: property.sharePrice,
      totalShares: property.totalShares,
      soldShares: property.soldShares,
      propertyValue: property.propertyValue,
      roi: property.roi,
    });
    console.log('🖼️ Media & content:', {
      mainImageUrl: property.imageUrl,
      hasImagesArray: !!property.images,
      imagesArrayLength: property.images?.length || 0,
      allImages: property.images,
      description: property.description?.substring(0, 100) + '...',
    });
    console.log('📋 Property details:', {
      hasDetails: !!property.details,
      details: property.details,
    });
    console.log('📄 Documents:', {
      hasDocuments: !!property.documents,
      documentCount: property.documents?.length || 0,
      documents: property.documents,
    });
    console.log('🌐 IPFS:', {
      metadataUri: property.metadataUri || '❌ no metadata URI',
    });
  }

  // Use all images from IPFS metadata, fallback to single imageUrl
  const images = property ? (property.images && property.images.length > 0 ? property.images : [property.imageUrl]) : [];

  // Load documents from IPFS metadata
  const documents: Array<{ name: string; type: string; size: string; url: string }> = property?.documents?.map((url, idx) => ({
    name: `Document ${idx + 1}`,
    type: 'PDF',
    size: 'N/A',
    url
  })) || [];

  // Log what will be displayed
  if (property && !isLoading) {
    console.log('🎨 Display data:', {
      imagesToShow: images.length,
      documentsToShow: documents.length,
      currentImageIndex,
    });
    console.log('✅ Property detail page ready to render\n');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('loading.message')}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Building2 size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('notFound.title')}</h2>
          <Link href={`/${locale}/marketplace`} className="text-primary-400 hover:underline">
            {t('notFound.backLink')}
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = (property.soldShares / property.totalShares) * 100;
  const availableShares = property.totalShares - property.soldShares;

  const handlePurchase = async () => {
    if (!connected) {
      alert(t('alerts.connectWallet'));
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
            alert(t('alerts.purchaseSuccess', { txId: data.txId }));
            setShowPurchaseModal(false);
          },
          onCancel: () => {
            alert(t('alerts.purchaseCancelled'));
          },
        }
      );
    } catch (error) {
      console.error('Purchase error:', error);
      alert(t('alerts.purchaseFailed'));
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
          <span>{t('backButton')}</span>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  priority={currentImageIndex === 0}
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
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 150px"
                      className="object-cover"
                    />
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
                    {t(`tabs.${tab}`)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">{t('overview.aboutTitle')}</h3>
                      <p className="text-gray-400 leading-relaxed">{property.description}</p>
                    </div>

                    {/* Property Details */}
                    {property.details && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Property Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {property.details.bedrooms && (
                            <div className="flex justify-between p-4 bg-dark-card rounded-xl">
                              <span className="text-gray-400">Bedrooms</span>
                              <span className="text-white font-semibold">{property.details.bedrooms}</span>
                            </div>
                          )}
                          {property.details.bathrooms && (
                            <div className="flex justify-between p-4 bg-dark-card rounded-xl">
                              <span className="text-gray-400">Bathrooms</span>
                              <span className="text-white font-semibold">{property.details.bathrooms}</span>
                            </div>
                          )}
                          {property.details.squareFeet && (
                            <div className="flex justify-between p-4 bg-dark-card rounded-xl">
                              <span className="text-gray-400">Square Feet</span>
                              <span className="text-white font-semibold">{property.details.squareFeet.toLocaleString()} sq ft</span>
                            </div>
                          )}
                          {property.details.yearBuilt && (
                            <div className="flex justify-between p-4 bg-dark-card rounded-xl">
                              <span className="text-gray-400">Year Built</span>
                              <span className="text-white font-semibold">{property.details.yearBuilt}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">{t('overview.featuresTitle')}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>{t('overview.features.primeLocation')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>{t('overview.features.highOccupancy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>{t('overview.features.professionalManagement')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 bg-accent-green rounded-full" />
                          <span>{t('overview.features.monthlyDividends')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">{t('financials.propertyValue')}</p>
                        <p className="text-2xl font-bold text-white">
                          ${property.propertyValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">{t('financials.annualRoi')}</p>
                        <p className="text-2xl font-bold text-accent-green">{property.roi}%</p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">{t('financials.totalRaised')}</p>
                        <p className="text-2xl font-bold text-white">
                          {(property.soldShares * property.sharePrice).toLocaleString()} STX
                        </p>
                      </div>
                      <div className="bg-dark-bg p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">{t('financials.nextPayout')}</p>
                        <p className="text-2xl font-bold text-white">
                          {property.nextPayoutDate || t('financials.tbd')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    {documents.length > 0 ? (
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
                    ) : (
                      <div className="text-center py-12">
                        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">
                          {t('documents.emptyTitle')}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {t('documents.emptyDescription')}
                        </p>
                      </div>
                    )}
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
                <p className="text-sm text-gray-500 mb-1">{t('sharePrice')}</p>
                <p className="text-3xl font-bold text-white">{property.sharePrice} STX</p>
                <p className="text-sm text-gray-500 mt-1">{t('usdApprox', { amount: (property.sharePrice * 0.5).toFixed(2) })}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{t('fundingProgress')}</span>
                  <span className="font-bold text-white">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink h-3 rounded-full transition-all duration-500 shadow-glow"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{property.soldShares.toLocaleString()} {t('sold')}</span>
                  <span>{availableShares.toLocaleString()} {t('available')}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-bg p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent size={14} className="text-primary-400" />
                    <p className="text-xs text-gray-500">{t('stats.roi')}</p>
                  </div>
                  <p className="font-bold text-white">{property.roi}%</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} className="text-accent-purple" />
                    <p className="text-xs text-gray-500">{t('stats.sharesSold')}</p>
                  </div>
                  <p className="font-bold text-white">{property.soldShares}</p>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => setShowPurchaseModal(true)}
                disabled={availableShares === 0}
                className="btn btn-primary w-full"
              >
                {availableShares === 0 ? t('soldOut') : t('purchaseButton')}
              </button>

              {/* Info */}
              <div className="text-xs text-gray-500 space-y-2">
                <p>{t('info.minPurchase')}</p>
                <p>{t('info.dividend')}</p>
                <p>{t('info.secured')}</p>
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
              <h3 className="text-2xl font-bold text-white">{t('modal.title')}</h3>
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
                  {t('modal.numberOfShares')}
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
                  {t('modal.availableLabel', { amount: availableShares.toLocaleString() })}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-dark-bg p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('modal.summary.sharePrice')}</span>
                  <span className="text-white font-medium">{property.sharePrice} STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('modal.summary.quantity')}</span>
                  <span className="text-white font-medium">{numShares}</span>
                </div>
                <div className="border-t border-dark-border pt-3 flex justify-between">
                  <span className="text-white font-bold">{t('modal.summary.totalCost')}</span>
                  <span className="text-white font-bold">{(property.sharePrice * numShares).toFixed(2)} STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('modal.summary.monthlyReturn')}</span>
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
                  {t('modal.cancelButton')}
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing || !connected}
                  className="btn btn-primary flex-1"
                >
                  {isPurchasing ? t('modal.processingButton') : connected ? t('modal.confirmButton') : t('modal.connectWalletButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
