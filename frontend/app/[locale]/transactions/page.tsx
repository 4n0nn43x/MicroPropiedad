'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Filter, Search } from 'lucide-react';

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock transactions data
  const transactions = [
    {
      id: '0x1a2b3c...',
      type: 'purchase',
      propertyName: 'Modern Loft Downtown',
      shares: 45,
      amount: 22500,
      pricePerShare: 500,
      timestamp: '2025-10-15 14:32:18',
      status: 'confirmed',
      txHash: '0x1a2b3c4d5e6f7g8h9i0j...',
    },
    {
      id: '0x2b3c4d...',
      type: 'payout',
      propertyName: 'Beachfront Villa',
      shares: 30,
      amount: 360,
      timestamp: '2025-10-14 09:15:42',
      status: 'confirmed',
      txHash: '0x2b3c4d5e6f7g8h9i0j1k...',
    },
    {
      id: '0x3c4d5e...',
      type: 'purchase',
      propertyName: 'Urban Apartment Complex',
      shares: 60,
      amount: 30000,
      pricePerShare: 500,
      timestamp: '2025-10-12 16:45:30',
      status: 'confirmed',
      txHash: '0x3c4d5e6f7g8h9i0j1k2l...',
    },
    {
      id: '0x4d5e6f...',
      type: 'sale',
      propertyName: 'Downtown Penthouse',
      shares: 20,
      amount: 12000,
      pricePerShare: 600,
      timestamp: '2025-10-10 11:20:15',
      status: 'confirmed',
      txHash: '0x4d5e6f7g8h9i0j1k2l3m...',
    },
    {
      id: '0x5e6f7g...',
      type: 'payout',
      propertyName: 'Modern Loft Downtown',
      shares: 45,
      amount: 450,
      timestamp: '2025-10-08 10:00:00',
      status: 'confirmed',
      txHash: '0x5e6f7g8h9i0j1k2l3m4n...',
    },
    {
      id: '0x6f7g8h...',
      type: 'purchase',
      propertyName: 'Beachfront Villa',
      shares: 30,
      amount: 18000,
      pricePerShare: 600,
      timestamp: '2025-09-28 13:50:22',
      status: 'confirmed',
      txHash: '0x6f7g8h9i0j1k2l3m4n5o...',
    },
  ];

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
        return 'Purchase';
      case 'sale':
        return 'Sale';
      case 'payout':
        return 'Payout';
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
      .filter(tx => tx.type === 'sale')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalPayouts: transactions
      .filter(tx => tx.type === 'payout')
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  return (
    <div className="px-12 py-8 space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View all your property transactions on the blockchain</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-white">{stats.totalTransactions}</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">Total Purchased</p>
          <p className="text-3xl font-bold text-white">${stats.totalPurchased.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">Total Sold</p>
          <p className="text-3xl font-bold text-accent-green">${stats.totalSold.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm text-gray-400 mb-2">Total Payouts</p>
          <p className="text-3xl font-bold text-accent-purple">${stats.totalPayouts.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by property name or transaction hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'purchase', label: 'Purchase' },
            { value: 'sale', label: 'Sale' },
            { value: 'payout', label: 'Payout' },
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
          <div className="text-sm font-medium text-gray-400">Type</div>
          <div className="col-span-2 text-sm font-medium text-gray-400">Property</div>
          <div className="text-sm font-medium text-gray-400">Shares</div>
          <div className="text-sm font-medium text-gray-400">Amount</div>
          <div className="text-sm font-medium text-gray-400">Date</div>
          <div className="text-sm font-medium text-gray-400">Transaction</div>
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
                  {tx.type === 'purchase' ? '-' : '+'} ${tx.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center">
                <p className="text-gray-400 text-sm">{tx.timestamp}</p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => window.open(`https://explorer.hiro.so/txid/${tx.txHash}?chain=mainnet`, '_blank')}
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
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
