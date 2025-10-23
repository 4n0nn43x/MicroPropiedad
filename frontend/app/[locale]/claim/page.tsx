'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWallet } from '@/lib/hooks/useWallet';
import { callReadOnlyFunction } from '@/lib/stacks/api';
import { claimPayout } from '@/lib/stacks/contracts';
import { uintCV, principalCV } from '@stacks/transactions';

interface PayoutRound {
  propertyId: number;
  propertyName: string;
  roundId: number;
  totalAmount: number;
  userShares: number;
  totalShares: number;
  claimableAmount: number;
  alreadyClaimed: boolean;
  timestamp: number;
}

export default function ClaimPayoutPage() {
  const t = useTranslations('claim');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { connected, connect, userAddress } = useWallet();

  const [payoutRounds, setPayoutRounds] = useState<PayoutRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingRound, setClaimingRound] = useState<number | null>(null);

  const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';
  const [contractAddress, contractName] = PROPERTY_MULTI_CONTRACT.split('.');

  useEffect(() => {
    if (connected && userAddress) {
      fetchClaimablePayouts();
    }
  }, [connected, userAddress]);

  const fetchClaimablePayouts = async () => {
    if (!userAddress) return;

    setIsLoading(true);
    try {
      const rounds: PayoutRound[] = [];

      // Get property count
      const countResult = await callReadOnlyFunction(
        contractAddress,
        contractName,
        'get-property-count'
      );

      const propertyCount = countResult?.value?.value || 0;

      // For each property, check for claimable payouts
      for (let propertyId = 1; propertyId <= propertyCount; propertyId++) {
        // Get property info
        const propertyResult = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property',
          [uintCV(propertyId)]
        );

        if (!propertyResult?.value?.value) continue;

        const property = propertyResult.value.value;
        const propertyName = property.name?.value || `Property #${propertyId}`;

        // Get current round for this property
        const currentRoundResult = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-current-round',
          [uintCV(propertyId)]
        );

        const currentRound = currentRoundResult?.value?.value || 0;

        if (currentRound === 0) continue; // No payouts yet

        // Check all rounds for this property
        for (let roundId = 1; roundId <= currentRound; roundId++) {
          // Calculate claimable for this user
          const claimableResult = await callReadOnlyFunction(
            contractAddress,
            contractName,
            'calculate-claimable',
            [uintCV(propertyId), uintCV(roundId), principalCV(userAddress)]
          );

          if (claimableResult?.value?.value) {
            const data = claimableResult.value.value;
            const userShares = parseInt(data.shares?.value || '0');
            const claimable = parseInt(data.claimable?.value || '0');
            const alreadyClaimed = data['already-claimed']?.value === true;

            // Only show if user has shares and hasn't claimed
            if (userShares > 0 && !alreadyClaimed && claimable > 0) {
              // Get round data for details
              const roundDataResult = await callReadOnlyFunction(
                contractAddress,
                contractName,
                'get-payout-round',
                [uintCV(propertyId), uintCV(roundId)]
              );

              if (roundDataResult?.value?.value) {
                const roundData = roundDataResult.value.value;
                const totalAmount = parseInt(roundData['total-amount']?.value || '0');
                const totalShares = parseInt(roundData['total-shares-snapshot']?.value || '0');
                const timestamp = parseInt(roundData.timestamp?.value || '0');

                rounds.push({
                  propertyId,
                  propertyName,
                  roundId,
                  totalAmount,
                  userShares,
                  totalShares,
                  claimableAmount: claimable,
                  alreadyClaimed,
                  timestamp,
                });
              }
            }
          }
        }
      }

      setPayoutRounds(rounds);
    } catch (error) {
      console.error('Error fetching claimable payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (propertyId: number, roundId: number, propertyName: string) => {
    setClaimingRound(roundId);

    try {
      await claimPayout(propertyId, roundId, {
        onFinish: (data) => {
          alert(`✅ Successfully claimed payout from ${propertyName}!\nTransaction: ${data.txId}`);
          // Refresh the list
          fetchClaimablePayouts();
        },
        onCancel: () => {
          alert('❌ Claim cancelled');
        },
      });
    } catch (error) {
      console.error('Claim error:', error);
      alert(`❌ Failed to claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setClaimingRound(null);
    }
  };

  const totalClaimable = payoutRounds.reduce((sum, round) => sum + round.claimableAmount, 0);

  if (!connected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <DollarSign size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view and claim payouts</p>
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
    <div className="px-12 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">💰 Claim Payouts</h1>
        <p className="text-gray-400">Claim your rental income from your property investments</p>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <DollarSign size={16} />
              <span>Total Claimable</span>
            </div>
            <p className="text-3xl font-bold text-accent-green">
              {(totalClaimable / 1000000).toFixed(6)} STX
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <TrendingUp size={16} />
              <span>Available Rounds</span>
            </div>
            <p className="text-3xl font-bold text-white">{payoutRounds.length}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <CheckCircle size={16} />
              <span>Your Address</span>
            </div>
            <p className="text-sm font-mono text-white truncate">
              {userAddress?.substring(0, 10)}...{userAddress?.substring(userAddress.length - 6)}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-gray-400 mt-4">Loading claimable payouts...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && payoutRounds.length === 0 && (
        <div className="glass-card p-12 text-center">
          <DollarSign size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Payouts Available</h3>
          <p className="text-gray-400 mb-6">
            You don't have any unclaimed payouts at the moment. Payouts will appear here when property owners distribute rental income.
          </p>
          <a
            href={`/${locale}/marketplace`}
            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition"
          >
            Browse Properties
          </a>
        </div>
      )}

      {/* Payout Rounds List */}
      {!isLoading && payoutRounds.length > 0 && (
        <div className="space-y-4">
          {payoutRounds.map((round) => (
            <div
              key={`${round.propertyId}-${round.roundId}`}
              className="glass-card p-6 hover:border-primary-500/50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{round.propertyName}</h3>
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                      Round #{round.roundId}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Your Shares</p>
                      <p className="text-white font-medium">{round.userShares}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Shares</p>
                      <p className="text-white font-medium">{round.totalShares}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Your Portion</p>
                      <p className="text-white font-medium">
                        {((round.userShares / round.totalShares) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Claimable Amount</p>
                      <p className="text-accent-green font-bold text-lg">
                        {(round.claimableAmount / 1000000).toFixed(6)} STX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>Block: {round.timestamp}</span>
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleClaim(round.propertyId, round.roundId, round.propertyName)}
                    disabled={claimingRound === round.roundId}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      claimingRound === round.roundId
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-accent-green hover:bg-accent-green/90 text-white'
                    }`}
                  >
                    {claimingRound === round.roundId ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Claiming...
                      </>
                    ) : (
                      '💰 Claim Payout'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {!isLoading && payoutRounds.length > 0 && (
        <div className="mt-8 glass-card p-6 bg-primary-500/5 border border-primary-500/20">
          <h4 className="text-sm font-medium text-primary-400 mb-2">ℹ️ How Payouts Work</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Property owners distribute rental income to shareholders periodically</li>
            <li>• Your payout is proportional to your share ownership</li>
            <li>• Click "Claim Payout" to receive your STX</li>
            <li>• Gas fees apply for claiming transactions</li>
          </ul>
        </div>
      )}
    </div>
  );
}
