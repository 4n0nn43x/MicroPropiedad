import { useTranslations } from 'next-intl';

export default function MarketplacePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Property Marketplace</h1>
        <p className="text-xl text-gray-600">
          Explore tokenized real estate opportunities
        </p>
      </div>

      {/* Placeholder for property grid */}
      <div className="text-center py-20 bg-white rounded-xl">
        <p className="text-gray-500 text-lg">
          Property marketplace coming soon...
        </p>
        <p className="text-gray-400 mt-2">
          Demo properties will be displayed here
        </p>
      </div>
    </div>
  );
}
