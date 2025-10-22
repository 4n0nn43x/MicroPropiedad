'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Wallet } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useUserPortfolio } from '@/lib/hooks/useProperties';
import { claimPayout } from '@/lib/stacks/contracts';
import { useTranslations } from 'next-intl';

export default function PortfolioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { connected, address, connect } = useWallet();
  const { data: portfolio, isLoading } = useUserPortfolio(address || undefined);
  const t = useTranslations('portfolio');

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
      alert(t('alerts.connectWallet'));
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
            alert(t('alerts.payoutClaimed', { txId: data.txId, amount: investment.claimableAmount.toFixed(4) }));
            setClaimingPropertyId(null);
          },
          onCancel: () => {
            console.log('Claim cancelled');
            alert(t('alerts.claimCancelled'));
            setClaimingPropertyId(null);
          }
        }
      );
    } catch (error) {
      console.error('Error claiming payout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim payout';
      alert(t('alerts.claimError', { message: errorMessage }));
      setClaimingPropertyId(null);
    }
  };

  // Not connected view
  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Wallet size={64} className="mx-auto mb-4 text-gray-600" />
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

  // Loading view
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('loading.message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('header.title')}</h1>
        <p className="text-gray-400">{t('header.description')}</p>
      </div>

      {/* Claimable Payouts Alert */}
      {stats.claimableTotal > 0 && (
        <div className="glass-card p-6 bg-accent-green/10 border border-accent-green/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{t('claimable.title')}</h3>
              <p className="text-gray-400">{t('claimable.description')}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-accent-green">{stats.claimableTotal.toFixed(4)} STX</p>
              <p className="text-sm text-gray-500">{t('claimable.usdApprox', { amount: (stats.claimableTotal * 0.5).toFixed(2) })}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalInvested')}</p>
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-primary-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.totalInvested.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{stats.propertiesOwned} {t('stats.properties')}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.currentValue')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${stats.currentValue.toLocaleString()}
          </p>
          <p className="text-xs text-accent-green">+${stats.totalReturns.toLocaleString()} {t('stats.total')}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalReturns')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
              <Percent size={20} className="text-accent-purple" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.returnPercentage}%
          </p>
          <p className="text-xs text-gray-500">{t('stats.averageRoi')}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{t('stats.totalShares')}</p>
            <div className="w-10 h-10 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <Calendar size={20} className="text-accent-pink" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.totalShares}
          </p>
          <p className="text-xs text-gray-500">{t('stats.acrossAll')}</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('investments.title')}</h2>
        <div className="flex gap-2">
          {(['all', '1M', '3M', '6M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {t(`investments.period.${period}`)}
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
                    {t('investments.status.active')}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('investments.sharesOwned')}</p>
                    <p className="text-sm font-bold text-white">
                      {investment.sharesOwned} / {investment.totalShares}
                    </p>
                    <p className="text-xs text-gray-600">
                      {((investment.sharesOwned / investment.totalShares) * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('investments.invested')}</p>
                    <p className="text-sm font-bold text-white">
                      {investment.invested.toFixed(2)} STX
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('investments.currentValue')}</p>
                    <p className="text-sm font-bold text-white">
                      {investment.currentValue.toFixed(2)} STX
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('investments.returns')}</p>
                    <p className="text-sm font-bold text-accent-green">
                      +{(investment.currentValue - investment.invested).toFixed(2)} STX ({(((investment.currentValue - investment.invested) / investment.invested) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('investments.claimablePayout')}</p>
                    {investment.claimableAmount > 0 ? (
                      <>
                        <p className="text-sm font-bold text-accent-green">
                          {investment.claimableAmount.toFixed(4)} STX
                        </p>
                        <p className="text-xs text-accent-green">Round #{investment.currentRound}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">{t('investments.noPending')}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/${locale}/marketplace/${investment.id}`}
                    className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition"
                  >
                    {t('investments.viewDetails')}
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
                      {claimingPropertyId === investment.id ? t('investments.claiming') : t('investments.claimButton', { amount: investment.claimableAmount.toFixed(4) })}
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-white rounded-lg text-sm font-medium transition"
                    title="Coming soon"
                  >
                    {t('investments.transferShares')}
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
          <h3 className="text-xl font-bold text-white mb-2">{t('empty.title')}</h3>
          <p className="text-gray-400 mb-6">{t('empty.description')}</p>
          <Link
            href={`/${locale}/marketplace`}
            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            {t('empty.exploreButton')}
          </Link>
        </div>
      )}
    </div>
  );
}
