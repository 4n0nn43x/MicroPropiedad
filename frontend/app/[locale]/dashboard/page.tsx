'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Building2, Calendar, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { demoHoldings, demoTransactions, demoPayoutRounds } from '@/lib/demoData';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [activeTab, setActiveTab] = useState<'portfolio' | 'holdings' | 'activity' | 'payouts'>('portfolio');

  // Calculate portfolio stats
  const totalValue = demoHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = demoHoldings.reduce((sum, h) => sum + h.invested, 0);
  const totalReturns = demoHoldings.reduce((sum, h) => sum + h.returns, 0);
  const overallROI = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const claimableAmount = demoHoldings.reduce((sum, h) => sum + h.claimableAmount, 0);

  const tabs = [
    { id: 'portfolio' as const, label: 'Portfolio' },
    { id: 'holdings' as const, label: 'Holdings' },
    { id: 'activity' as const, label: 'Activity' },
    { id: 'payouts' as const, label: 'Payouts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-xl text-gray-600">Track your real estate investments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Value</p>
              <Wallet className="text-primary-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-primary-600">${totalValue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="text-success" size={16} />
              <span className="text-sm text-success font-semibold">+{overallROI.toFixed(2)}%</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Invested</p>
              <DollarSign className="text-gray-600" size={24} />
            </div>
            <p className="text-3xl font-bold">${totalInvested.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Across {demoHoldings.length} properties</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Returns</p>
              <TrendingUp className="text-success" size={24} />
            </div>
            <p className="text-3xl font-bold text-success">${totalReturns.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">ROI: {overallROI.toFixed(2)}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Claimable</p>
              <DollarSign className="text-secondary-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-secondary-500">${claimableAmount.toFixed(2)}</p>
            <Button variant="secondary" size="sm" className="w-full mt-2">
              Claim All
            </Button>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-4 border-b-2 transition font-semibold
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Portfolio Distribution */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Portfolio Distribution</h2>
              <div className="space-y-4">
                {demoHoldings.map((holding, index) => {
                  const percentage = (holding.currentValue / totalValue) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{holding.propertyName}</span>
                        <span className="text-sm font-bold text-primary-600">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Performance Chart */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm">Best Performing</p>
                    <p className="font-bold">{demoHoldings[0]?.propertyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">+{demoHoldings[0]?.roi.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Total Properties</p>
                    <p className="text-2xl font-bold">{demoHoldings.length}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Avg. ROI</p>
                    <p className="text-2xl font-bold text-success">{overallROI.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'holdings' && (
          <div className="space-y-6">
            {demoHoldings.map((holding, index) => {
              const ownershipPercent = (holding.shares / holding.totalShares) * 100;
              return (
                <Card key={index} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={holding.propertyImage}
                        alt={holding.propertyName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{holding.propertyName}</h3>
                          <p className="text-gray-600">
                            {holding.shares} shares ({ownershipPercent.toFixed(2)}% ownership)
                          </p>
                        </div>
                        <Link href={`/${locale}/marketplace/${holding.propertyId}`}>
                          <Button variant="outline" size="sm">
                            View Property
                          </Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Current Value</p>
                          <p className="text-lg font-bold text-primary-600">${holding.currentValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Invested</p>
                          <p className="text-lg font-bold">${holding.invested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Returns</p>
                          <p className="text-lg font-bold text-success">+${holding.returns.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className="text-lg font-bold text-success">{holding.roi.toFixed(2)}%</p>
                        </div>
                      </div>

                      {holding.claimableAmount > 0 && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600">Claimable Amount</p>
                            <p className="text-lg font-bold text-secondary-500">${holding.claimableAmount.toFixed(2)}</p>
                          </div>
                          <Button variant="secondary" size="sm">
                            Claim Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'activity' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {demoTransactions.map((tx) => {
                const typeConfig = {
                  purchase: { icon: Building2, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Purchase' },
                  claim: { icon: DollarSign, color: 'text-success', bg: 'bg-green-50', label: 'Claim' },
                  transfer: { icon: ExternalLink, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Transfer' },
                }[tx.type];

                const Icon = typeConfig.icon;

                return (
                  <div key={tx.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${typeConfig.bg}`}>
                      <Icon className={typeConfig.color} size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{typeConfig.label} - {tx.propertyName}</p>
                          <p className="text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${tx.amount.toLocaleString()}</p>
                          {tx.shares && <p className="text-sm text-gray-600">{tx.shares} shares</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                          {tx.status}
                        </Badge>
                        <a
                          href={`https://explorer.stacks.co/txid/${tx.txId}?chain=testnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                        >
                          View TX <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {activeTab === 'payouts' && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 mb-2">Available to Claim</p>
                <p className="text-3xl font-bold text-secondary-500">${claimableAmount.toFixed(2)}</p>
                <Button variant="secondary" className="w-full mt-4">
                  Claim All
                </Button>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 mb-2">Total Claimed</p>
                <p className="text-3xl font-bold text-success">${totalReturns.toFixed(2)}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 mb-2">Pending Rounds</p>
                <p className="text-3xl font-bold">{demoPayoutRounds.filter(p => !p.claimed).length}</p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Payout History</h2>
              <div className="space-y-4">
                {demoPayoutRounds.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${payout.claimed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        {payout.claimed ? (
                          <CheckCircle className="text-success" size={24} />
                        ) : (
                          <Clock className="text-yellow-600" size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{payout.propertyName}</p>
                        <p className="text-sm text-gray-600">Round #{payout.id} - {payout.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${payout.yourShare.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Your share</p>
                      </div>
                      {payout.claimed ? (
                        <Badge variant="success">Claimed</Badge>
                      ) : (
                        <Button variant="secondary" size="sm">
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
