'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Users, DollarSign, TrendingUp, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useProperty } from '@/lib/hooks/useProperties';
import { usePropertyAnalytics } from '@/lib/hooks/usePropertyAnalytics';

/**
 * Format number with smart decimal handling
 */
function formatNumber(num: number, maxDecimals: number = 2): string {
  if (Math.abs(num) < 0.01 && num !== 0) {
    return num.toFixed(4).replace(/\.?0+$/, '');
  }
  const rounded = Math.round(num * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  return rounded.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

export default function PropertyAnalyticsPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const locale = (params?.locale as string) || 'en';

  const { connected, address } = useWallet();
  const { data: property, isLoading: propertyLoading } = useProperty(propertyId);
  const { data: analytics, isLoading: analyticsLoading } = usePropertyAnalytics(propertyId);

  const isLoading = propertyLoading || analyticsLoading;

  // Check if user is the owner
  const isOwner = property && address && property.owner.toLowerCase() === address.toLowerCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Property not found</p>
          <Link href={`/${locale}/properties`} className="text-primary-400 hover:underline mt-4 inline-block">
            Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">You are not the owner of this property</p>
          <Link href={`/${locale}/properties`} className="text-primary-400 hover:underline">
            Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  const fundingProgress = (property.soldShares / property.totalShares) * 100;
  const totalRaised = property.soldShares * property.sharePrice;
  const totalValue = property.totalShares * property.sharePrice;

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="border-b border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href={`/${locale}/properties`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit mb-4"
          >
            <ChevronLeft size={20} />
            <span>Back to My Properties</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
              <p className="text-gray-400">{property.location}</p>
            </div>
            <Link
              href={`/${locale}/marketplace/${propertyId}`}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
            >
              View Public Page
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Key Metrics</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Total Raised</p>
                <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-accent-green" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {formatNumber(totalRaised)} STX
              </p>
              <p className="text-xs text-gray-500">
                {formatNumber(fundingProgress)}% of {formatNumber(totalValue)} STX goal
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Shares Sold</p>
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {property.soldShares}
              </p>
              <p className="text-xs text-gray-500">
                {property.totalShares - property.soldShares} remaining of {property.totalShares}
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Total Investors</p>
                <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                  <Users size={20} className="text-accent-purple" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {analytics?.totalInvestors || 0}
              </p>
              <p className="text-xs text-gray-500">
                Avg: {analytics?.totalInvestors > 0 ? formatNumber(property.soldShares / analytics.totalInvestors) : 0} shares/investor
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Revenue Distributed</p>
                <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
                  <Activity size={20} className="text-accent-pink" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {formatNumber(analytics?.totalPayouts || 0)} STX
              </p>
              <p className="text-xs text-gray-500">
                {analytics?.payoutRounds || 0} payout rounds
              </p>
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Funding Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Funding Goal</span>
                <span className="font-bold text-white">{formatNumber(fundingProgress)}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-dark-bg p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Share Price</p>
                <p className="text-lg font-bold text-white">{formatNumber(property.sharePrice)} STX</p>
              </div>
              <div className="bg-dark-bg p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Min Purchase</p>
                <p className="text-lg font-bold text-white">{property.minPurchase || 1} shares</p>
              </div>
              <div className="bg-dark-bg p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Expected ROI</p>
                <p className="text-lg font-bold text-accent-green">{formatNumber(property.roi)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Investor Breakdown</h3>
          {analytics && analytics.investors && analytics.investors.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-dark-border">
                <div>Investor Address</div>
                <div>Shares Owned</div>
                <div>Investment (STX)</div>
                <div>Ownership %</div>
              </div>
              {analytics.investors.map((investor, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3 bg-dark-bg rounded-xl hover:bg-dark-hover transition">
                  <div className="font-mono text-sm text-white truncate">
                    {investor.address.slice(0, 6)}...{investor.address.slice(-4)}
                  </div>
                  <div className="text-white font-medium">{investor.shares}</div>
                  <div className="text-white font-medium">{formatNumber(investor.shares * property.sharePrice)} STX</div>
                  <div className="text-accent-green font-medium">
                    {formatNumber((investor.shares / property.totalShares) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No investors yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Shares will appear here once purchased
              </p>
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Payout History</h3>
          {analytics && analytics.payouts && analytics.payouts.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-dark-border">
                <div>Round #</div>
                <div>Total Amount</div>
                <div>Per Share</div>
                <div>Date</div>
              </div>
              {analytics.payouts.map((payout, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3 bg-dark-bg rounded-xl">
                  <div className="text-white font-medium">#{payout.round}</div>
                  <div className="text-accent-green font-medium">{formatNumber(payout.totalAmount)} STX</div>
                  <div className="text-white">{formatNumber(payout.perShare)} STX</div>
                  <div className="text-gray-400 text-sm">{payout.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No payouts distributed yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Payout history will appear here
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <Link
              href={`/${locale}/edit-property/${propertyId}`}
              className="px-6 py-4 bg-dark-bg hover:bg-dark-hover text-white rounded-xl font-medium transition text-center"
            >
              Edit Property Details
            </Link>
            <button
              className="px-6 py-4 bg-dark-bg hover:bg-dark-hover text-white rounded-xl font-medium transition"
              disabled
              title="Coming soon"
            >
              Distribute Payout
            </button>
            <Link
              href={`/${locale}/marketplace/${propertyId}`}
              className="px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition text-center"
            >
              View on Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
