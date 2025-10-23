'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Filter, Search, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@/lib/hooks/useWallet';
import { useTransactions } from '@/lib/hooks/useTransactions';

export default function TransactionsPage() {
  const t = useTranslations('transactions');
  const { connected, address, connect } = useWallet();
  const { data: transactions = [], isLoading } = useTransactions(address || undefined);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Wallet connection guard
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.txHash.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight size={20} className="text-red-400" />;
      case 'sale':
        return <ArrowDownRight size={20} className="text-accent-green" />;
      case 'payout':
        return <ArrowDownRight size={20} className="text-accent-purple" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase':
        return t('types.purchase');
      case 'sale':
        return t('types.sale');
      case 'payout':
        return t('types.payout');
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-red-400';
      case 'sale':
        return 'text-accent-green';
      case 'payout':
        return 'text-accent-purple';
      default:
        return 'text-gray-400';
    }
  };

  const stats = {
    totalTransactions: transactions.length,
    totalPurchased: transactions
      .filter(tx => tx.type === 'purchase')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalSold: transactions
      .filter(tx => tx.type === 'transfer')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalPayouts: transactions
      .filter(tx => tx.type === 'payout')
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('header.title')}</h1>
        <p className="text-gray-400">{t('header.description')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">{t('stats.totalTransactions')}</p>
          <p className="text-3xl font-bold text-white">{stats.totalTransactions}</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">{t('stats.totalPurchased')}</p>
          <p className="text-3xl font-bold text-white">{stats.totalPurchased.toFixed(2)} STX</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">Total Sold</p>
          <p className="text-3xl font-bold text-accent-green">{stats.totalSold.toFixed(2)} STX</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">{t('stats.totalPayouts')}</p>
          <p className="text-3xl font-bold text-accent-purple">{stats.totalPayouts.toFixed(2)} STX</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('filters.all') },
            { value: 'purchase', label: t('filters.purchase') },
            { value: 'payout', label: t('filters.payout') },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                filterType === filter.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-dark-border bg-dark-card/30">
          <div className="text-sm font-medium text-gray-400">{t('table.type')}</div>
          <div className="col-span-2 text-sm font-medium text-gray-400">{t('table.property')}</div>
          <div className="text-sm font-medium text-gray-400">{t('table.shares')}</div>
          <div className="text-sm font-medium text-gray-400">{t('table.amount')}</div>
          <div className="text-sm font-medium text-gray-400">{t('table.date')}</div>
          <div className="text-sm font-medium text-gray-400">{t('table.transaction')}</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-dark-border">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-dark-hover transition"
            >
              <div className="flex items-center gap-2">
                {getTypeIcon(tx.type)}
                <span className={`text-sm font-medium ${getTypeColor(tx.type)}`}>
                  {getTypeLabel(tx.type)}
                </span>
              </div>

              <div className="col-span-2 flex items-center">
                <p className="text-white font-medium">{tx.propertyName}</p>
              </div>

              <div className="flex items-center">
                <p className="text-gray-400">{tx.shares}</p>
              </div>

              <div className="flex items-center">
                <p className={`font-medium ${
                  tx.type === 'purchase' ? 'text-red-400' : 'text-accent-green'
                }`}>
                  {tx.type === 'purchase' ? '-' : '+'}{tx.amount.toFixed(2)} STX
                </p>
              </div>

              <div className="flex items-center">
                <p className="text-gray-400 text-sm">{tx.timestamp}</p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => window.open(`https://explorer.hiro.so/txid/${tx.txHash}?chain=testnet`, '_blank')}
                  className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition"
                >
                  <span className="font-mono">{tx.txHash.slice(0, 8)}...</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ArrowUpRight size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-white mb-2">{t('empty.title')}</h3>
            <p className="text-gray-400 mb-6">
              {t('empty.description')}
            </p>
            <button
              onClick={() => window.open('https://explorer.hiro.so/?chain=testnet', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
            >
              {t('empty.explorerButton')}
              <ExternalLink size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
