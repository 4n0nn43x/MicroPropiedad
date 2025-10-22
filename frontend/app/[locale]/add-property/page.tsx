'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, MapPin, DollarSign, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { registerProperty } from '@/lib/stacks/contracts';
import ImageUpload from '@/components/upload/ImageUpload';
import { uploadPropertyMetadata } from '@/lib/ipfs/pinata';

export default function AddPropertyPage() {
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
    { id: 1, name: 'Basic Info', icon: FileText },
    { id: 2, name: 'Financial Details', icon: DollarSign },
    { id: 3, name: 'Property Details', icon: MapPin },
    { id: 4, name: 'Media & Documents', icon: ImageIcon },
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      alert('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      alert('Please upload at least one property image');
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

      console.log('Uploading property metadata to IPFS...');

      // Step 2: Upload metadata to IPFS
      const metadataResult = await uploadPropertyMetadata(metadata);
      console.log('Metadata uploaded to IPFS:', metadataResult.url);

      // Step 3: Generate property symbol from name (e.g., "Beach House" -> "BEACH")
      const symbol = formData.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 10) || 'PROP';

      // Step 4: For now, use a placeholder contract address
      // TODO: In production, we should deploy a new property contract for each property
      const placeholderContractAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ';
      const propertyContractAddress = `${placeholderContractAddress}.property-${Date.now()}`;

      console.log('Registering property on blockchain...');

      // Step 5: Register property with the factory contract
      await registerProperty({
        contractAddress: propertyContractAddress,
        name: formData.name,
        symbol: symbol,
        location: formData.location,
        totalShares: Number(formData.totalShares),
        metadataUri: metadataResult.url,
      }, {
        onFinish: (data) => {
          console.log('Property registered! Transaction:', data.txId);
          alert(
            `Property registered successfully!\n\n` +
            `Transaction ID: ${data.txId}\n` +
            `Metadata IPFS: ${metadataResult.IpfsHash}\n\n` +
            `It will appear in the marketplace once the transaction is confirmed (~10 minutes).`
          );
          router.push(`/${locale}/marketplace`);
        },
        onCancel: () => {
          console.log('Registration cancelled');
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Error registering property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register property';
      alert(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  // Wallet connection guard - rendered AFTER all hooks are initialized
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Upload size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">You need to connect your wallet to list a property</p>
          <button
            onClick={connect}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">List a New Property</h1>
        <p className="text-gray-400">Tokenize your property and start raising capital</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Luxury Penthouse Manhattan"
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                placeholder="Describe your property in detail..."
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="mixed">Mixed Use</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Financial Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Financial Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Property Value (USD) *
                </label>
                <input
                  type="number"
                  value={formData.totalValue}
                  onChange={(e) => handleInputChange('totalValue', e.target.value)}
                  placeholder="500000"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Shares *
                </label>
                <input
                  type="number"
                  value={formData.totalShares}
                  onChange={(e) => handleInputChange('totalShares', e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price per Share (USD) *
                </label>
                <input
                  type="number"
                  value={formData.pricePerShare}
                  onChange={(e) => handleInputChange('pricePerShare', e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
                {formData.totalValue && formData.totalShares && (
                  <p className="mt-2 text-xs text-gray-500">
                    Calculated: ${(Number(formData.totalValue) / Number(formData.totalShares)).toFixed(2)} per share
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Annual Return (%) *
                </label>
                <input
                  type="number"
                  value={formData.expectedReturn}
                  onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                  placeholder="8"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div className="glass-card p-4 bg-primary-500/5 border border-primary-500/20">
              <h3 className="text-sm font-medium text-primary-400 mb-2">Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Value</p>
                  <p className="text-white font-medium">${Number(formData.totalValue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Per Share</p>
                  <p className="text-white font-medium">${formData.pricePerShare || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Shares</p>
                  <p className="text-white font-medium">{formData.totalShares || '0'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Property Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Property Specifications</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="3"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Square Feet
                </label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  placeholder="2020"
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Media & Documents */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Media & Documents</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Images *
              </label>
              <ImageUpload
                onUploadComplete={(urls) => handleInputChange('images', urls)}
                maxImages={5}
                existingImages={formData.images}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Legal Documents
              </label>
              <div className="border-2 border-dashed border-dark-border rounded-xl p-12 text-center hover:border-primary-500/50 transition cursor-pointer">
                <Upload size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-white font-medium mb-1">Upload property documents</p>
                <p className="text-sm text-gray-500">PDF, DOC up to 20MB</p>
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
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            Next Step
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
            {isSubmitting ? 'Submitting to Blockchain...' : 'Submit Property to Blockchain'}
          </button>
        )}
      </div>
    </div>
  );
}
