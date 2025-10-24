'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, MapPin, DollarSign, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@/lib/hooks/useWallet';
import { registerProperty } from '@/lib/stacks/contracts';
import ImageUpload from '@/components/upload/ImageUpload';
import { uploadPropertyMetadata } from '@/lib/ipfs/pinata';

export default function AddPropertyPage() {
  const t = useTranslations('addProperty');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { connected, connect } = useWallet();

  // Initialize all hooks BEFORE any conditional returns
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    description: '',
    location: '',
    propertyType: 'residential',

    // Step 2: Financial Details
    totalValue: '',
    totalShares: '',
    pricePerShare: '',
    expectedReturn: '',
    minPurchase: '1', // Minimum shares to purchase

    // Step 3: Property Details
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',

    // Step 4: Documents & Images
    images: [] as string[],
    documents: [] as string[],
  });

  const steps = [
    { id: 1, name: t('steps.basicInfo'), icon: FileText },
    { id: 2, name: t('steps.financialDetails'), icon: DollarSign },
    { id: 3, name: t('steps.propertyDetails'), icon: MapPin },
    { id: 4, name: t('steps.mediaDocuments'), icon: ImageIcon },
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    const updated = { ...formData, [field]: value };

    // Auto-calculate price per share when totalValue or totalShares changes
    if (field === 'totalValue' || field === 'totalShares') {
      const totalVal = Number(field === 'totalValue' ? value : formData.totalValue);
      const shares = Number(field === 'totalShares' ? value : formData.totalShares);

      if (totalVal > 0 && shares > 0) {
        updated.pricePerShare = (totalVal / shares).toFixed(2);
      }
    }

    setFormData(updated);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.location || !formData.totalValue || !formData.totalShares) {
      alert(t('alerts.fillRequired'));
      return;
    }

    if (formData.images.length === 0) {
      alert(t('alerts.uploadImage'));
      return;
    }

    // Validate minPurchase
    const minPurchase = Number(formData.minPurchase) || 1;
    const totalShares = Number(formData.totalShares);
    if (minPurchase < 1) {
      alert('Minimum purchase must be at least 1 share');
      return;
    }
    if (minPurchase > totalShares) {
      alert('Minimum purchase cannot exceed total shares');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create complete property metadata JSON
      const sharePrice = Number(formData.pricePerShare) || Number(formData.totalValue) / Number(formData.totalShares);

      const metadata = {
        name: formData.name,
        description: formData.description || 'Property description',
        location: formData.location,
        propertyType: formData.propertyType,
        images: formData.images,
        documents: formData.documents,
        financials: {
          totalValue: Number(formData.totalValue),
          totalShares: Number(formData.totalShares),
          sharePrice: sharePrice,
          expectedReturn: Number(formData.expectedReturn) || 8,
          minPurchase: Number(formData.minPurchase) || 1,
        },
        details: {
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          squareFeet: Number(formData.squareFeet) || 0,
          yearBuilt: Number(formData.yearBuilt) || 0,
        },
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      };

      console.log(t('alerts.uploadingMetadata'));

      // Step 2: Upload metadata to IPFS
      const metadataResult = await uploadPropertyMetadata(metadata);
      console.log(t('alerts.metadataUploaded'), metadataResult.url);

      // Step 3: Generate property symbol from name (e.g., "Beach House" -> "BEACH")
      const symbol = formData.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 10) || 'PROP';

      console.log(t('alerts.registering'));

      // Step 4: Register property with the factory contract (now using property-multi architecture)
      await registerProperty({
        name: formData.name,
        symbol: symbol,
        location: formData.location,
        totalShares: Number(formData.totalShares),
        sharePrice: sharePrice,
        minPurchase: Number(formData.minPurchase) || 1,
        metadataUri: metadataResult.url,
      }, {
        onFinish: (data) => {
          console.log('Property registered! Transaction:', data.txId);
          alert(t('alerts.success', { txId: data.txId, ipfsHash: metadataResult.IpfsHash }));
          router.push(`/${locale}/marketplace`);
        },
        onCancel: () => {
          console.log(t('alerts.cancelled'));
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Error registering property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register property';
      alert(t('alerts.error', { message: errorMessage }));
      setIsSubmitting(false);
    }
  };

  // Wallet connection guard - rendered AFTER all hooks are initialized
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Upload size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('wallet.connectTitle')}</h2>
          <p className="text-gray-400 mb-6">{t('wallet.connectDescription')}</p>
          <button
            onClick={connect}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            {t('wallet.connectButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('header.title')}</h1>
        <p className="text-gray-400">{t('header.description')}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-accent-green text-white'
                        : isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-card text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isActive || isCompleted ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-accent-green' : 'bg-dark-card'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="glass-card p-8 mb-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('step1.title')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step1.propertyName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('step1.propertyNamePlaceholder')}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step1.description')} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                placeholder={t('step1.descriptionPlaceholder')}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step1.location')} *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t('step1.locationPlaceholder')}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step1.propertyType')} *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              >
                <option value="residential">{t('step1.types.residential')}</option>
                <option value="commercial">{t('step1.types.commercial')}</option>
                <option value="industrial">{t('step1.types.industrial')}</option>
                <option value="mixed">{t('step1.types.mixed')}</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Financial Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('step2.title')}</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step2.totalValue')} *
                </label>
                <input
                  type="number"
                  value={formData.totalValue}
                  onChange={(e) => handleInputChange('totalValue', e.target.value)}
                  placeholder={t('step2.totalValuePlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step2.totalShares')} *
                </label>
                <input
                  type="number"
                  value={formData.totalShares}
                  onChange={(e) => handleInputChange('totalShares', e.target.value)}
                  placeholder={t('step2.totalSharesPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step2.pricePerShare')} (Auto-calculated)
                </label>
                <div className="w-full px-4 py-3 bg-dark-card/50 border border-dark-border rounded-xl text-white flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-400">
                    ${formData.pricePerShare || '0'}
                  </span>
                  <span className="text-xs text-gray-500">per share</span>
                </div>
                {formData.totalValue && formData.totalShares && (
                  <p className="mt-2 text-xs text-accent-green">
                    ✓ {t('step2.calculatedPrice', { amount: (Number(formData.totalValue) / Number(formData.totalShares)).toFixed(2) })}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step2.expectedReturn')} *
                </label>
                <input
                  type="number"
                  value={formData.expectedReturn}
                  onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                  placeholder={t('step2.expectedReturnPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Purchase (shares) *
              </label>
              <input
                type="number"
                min="1"
                max={formData.totalShares || undefined}
                value={formData.minPurchase}
                onChange={(e) => handleInputChange('minPurchase', e.target.value)}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
              <p className="mt-2 text-xs text-gray-400">
                💡 Set the minimum number of shares an investor must purchase at once. Lower values make it more accessible.
              </p>
              {formData.minPurchase && formData.pricePerShare && (
                <p className="mt-1 text-xs text-primary-400">
                  Minimum investment: ${(Number(formData.minPurchase) * Number(formData.pricePerShare)).toFixed(2)} STX
                </p>
              )}
            </div>

            <div className="glass-card p-4 bg-primary-500/5 border border-primary-500/20">
              <h3 className="text-sm font-medium text-primary-400 mb-2">{t('step2.summary.title')}</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t('step2.summary.totalValue')}</p>
                  <p className="text-white font-medium">${Number(formData.totalValue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('step2.summary.perShare')}</p>
                  <p className="text-white font-medium">${formData.pricePerShare || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('step2.summary.totalShares')}</p>
                  <p className="text-white font-medium">{formData.totalShares || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Min. Purchase</p>
                  <p className="text-white font-medium">{formData.minPurchase || '1'} shares</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Property Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('step3.title')}</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step3.bedrooms')}
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder={t('step3.bedroomsPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step3.bathrooms')}
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder={t('step3.bathroomsPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step3.squareFeet')}
                </label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  placeholder={t('step3.squareFeetPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('step3.yearBuilt')}
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  placeholder={t('step3.yearBuiltPlaceholder')}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Media & Documents */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('step4.title')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step4.propertyImages')} *
              </label>
              <ImageUpload
                onUploadComplete={(urls) => handleInputChange('images', urls)}
                maxImages={5}
                existingImages={formData.images}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('step4.legalDocuments')}
              </label>
              <div className="border-2 border-dashed border-dark-border rounded-xl p-12 text-center hover:border-primary-500/50 transition cursor-pointer">
                <Upload size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-white font-medium mb-1">{t('step4.uploadDocuments')}</p>
                <p className="text-sm text-gray-500">{t('step4.fileTypes')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            currentStep === 1
              ? 'bg-dark-card text-gray-600 cursor-not-allowed'
              : 'bg-dark-card text-white hover:bg-dark-hover'
          }`}
        >
          {t('navigation.previous')}
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            {t('navigation.nextStep')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-xl font-medium transition ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-accent-green hover:bg-accent-green/90 text-white'
            }`}
          >
            {isSubmitting ? t('navigation.submitting') : t('navigation.submitButton')}
          </button>
        )}
      </div>
    </div>
  );
}
