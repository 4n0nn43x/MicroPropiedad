'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Wallet } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useUserPortfolio } from '@/lib/hooks/useProperties';
import { claimPayout } from '@/lib/stacks/contracts';

export default function PortfolioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { connected, address, connect } = useWallet();
  const { data: portfolio, isLoading } = useUserPortfolio(address || undefined);

  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [claimingPropertyId, setClaimingPropertyId] = useState<string | null>(null);

  // Calculate stats from real blockchain data
  const stats = portfolio && portfolio.length > 0 ? {
    totalInvested: portfolio.reduce((sum, inv) => sum + inv.invested, 0),
    currentValue: portfolio.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalReturns: portfolio.reduce((sum, inv) => sum + (inv.currentValue - inv.invested), 0),
    returnPercentage: portfolio.reduce((sum, inv) => sum + inv.invested, 0) > 0
      ? ((portfolio.reduce((sum, inv) => sum + (inv.currentValue - inv.invested), 0) /
          portfolio.reduce((sum, inv) => sum + inv.invested, 0)) * 100)
      : 0,
    propertiesOwned: portfolio.length,
    totalShares: portfolio.reduce((sum, inv) => sum + inv.sharesOwned, 0),
    claimableTotal: portfolio.reduce((sum, inv) => sum + (inv.claimableAmount || 0), 0),
  } : {
    totalInvested: 0,
    currentValue: 0,
    totalReturns: 0,
    returnPercentage: 0,
    propertiesOwned: 0,
    totalShares: 0,
    claimableTotal: 0,
  };

  const handleClaimPayout = async (investment: any) => {
    if (!connected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setClaimingPropertyId(investment.id);

    try {
      await claimPayout(
        `${investment.contractAddress}.${investment.contractName}`,
        investment.currentRound,
        {
          onFinish: (data) => {
            console.log('Payout claimed! Transaction:', data.txId);
            alert(`Payout claimed successfully! Transaction ID: ${data.txId}\n\nAmount: ${investment.claimableAmount.toFixed(4)} STX`);
            setClaimingPropertyId(null);
          },
          onCancel: () => {
            console.log('Claim cancelled');
            setClaimingPropertyId(null);
          }
        }
      );
    } catch (error) {
      console.error('Error claiming payout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim payout';
      alert(`Error: ${errorMessage}`);
      setClaimingPropertyId(null);
    }
  };

  // Not connected view
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Wallet size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your portfolio</p>
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

  // Loading view
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your portfolio from blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
        <p className="text-gray-400">Track your real estate investments and returns</p>
      </div>

      {/* Claimable Payouts Alert */}
      {stats.claimableTotal > 0 && (
        <div className="glass-card p-6 bg-accent-green/10 border border-accent-green/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Claimable Payouts Available!</h3>
              <p className="text-gray-400">You have unclaimed revenue distributions</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-accent-green">{stats.claimableTotal.toFixed(4)} STX</p>
              <p className="text-sm text-gray-500">≈ ${(stats.claimableTotal * 0.5).toFixed(2)} USD</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Invested</p>
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-primary-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.totalInvested.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{stats.propertiesOwned} properties</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Current Value</p>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.currentValue.toLocaleString()}
          </p>
          <p className="text-xs text-accent-green">+${stats.totalReturns.toLocaleString()} total</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Returns</p>
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
              <Percent size={20} className="text-accent-purple" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.returnPercentage}%
          </p>
          <p className="text-xs text-gray-500">Average ROI</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">Total Shares</p>
            <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <Calendar size={20} className="text-accent-pink" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.totalShares}
          </p>
          <p className="text-xs text-gray-500">Across all properties</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Investments</h2>
        <div className="flex gap-2">
          {['all', '1M', '3M', '6M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>
      </div>

      {/* Investments List */}
      {portfolio && portfolio.length > 0 ? (
        <div className="space-y-4">
          {portfolio.map((investment) => (
          <div key={investment.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
            <div className="flex gap-6">
              {/* Property Image */}
              <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={investment.imageUrl}
                  alt={investment.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{investment.name}</h3>
                    <p className="text-sm text-gray-400">{investment.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shares Owned</p>
                    <p className="text-sm font-bold text-white">
                      {investment.sharesOwned} / {investment.totalShares}
                    </p>
                    <p className="text-xs text-gray-600">
                      {((investment.sharesOwned / investment.totalShares) * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invested</p>
                    <p className="text-sm font-bold text-white">
                      {investment.invested.toFixed(2)} STX
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Value</p>
                    <p className="text-sm font-bold text-white">
                      {investment.currentValue.toFixed(2)} STX
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Returns</p>
                    <p className="text-sm font-bold text-accent-green">
                      +{(investment.currentValue - investment.invested).toFixed(2)} STX ({(((investment.currentValue - investment.invested) / investment.invested) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Claimable Payout</p>
                    {investment.claimableAmount > 0 ? (
                      <>
                        <p className="text-sm font-bold text-accent-green">
                          {investment.claimableAmount.toFixed(4)} STX
                        </p>
                        <p className="text-xs text-accent-green">Round #{investment.currentRound}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">No pending payouts</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/${locale}/marketplace/${investment.id}`}
                    className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </Link>
                  {investment.claimableAmount > 0 && (
                    <button
                      onClick={() => handleClaimPayout(investment)}
                      disabled={claimingPropertyId === investment.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        claimingPropertyId === investment.id
                          ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                          : 'bg-accent-green hover:bg-accent-green/90 text-white'
                      }`}
                    >
                      {claimingPropertyId === investment.id ? 'Claiming...' : `Claim ${investment.claimableAmount.toFixed(4)} STX`}
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition"
                    title="Coming soon"
                  >
                    Transfer Shares
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <TrendingUp size={64} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">No Investments Yet</h3>
          <p className="text-gray-400 mb-6">Start building your real estate portfolio today</p>
          <Link
            href={`/${locale}/marketplace`}
            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            Explore Properties
          </Link>
        </div>
      )}
    </div>
  );
}
