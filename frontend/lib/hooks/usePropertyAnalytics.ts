'use client';

import { useQuery } from '@tanstack/react-query';
import { callReadOnlyFunction } from '../stacks/api';
import { uintCV, principalCV } from '@stacks/transactions';

const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';
const STACKS_API = process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so';

export interface PropertyAnalytics {
  totalInvestors: number;
  investors: Array<{
    address: string;
    shares: number;
  }>;
  totalPayouts: number;
  payoutRounds: number;
  payouts: Array<{
    round: number;
    totalAmount: number;
    perShare: number;
    date: string;
  }>;
}

/**
 * Fetch detailed analytics for a property (owner view)
 */
export function usePropertyAnalytics(propertyId: string) {
  return useQuery({
    queryKey: ['property-analytics', propertyId],
    queryFn: async (): Promise<PropertyAnalytics> => {
      try {
        console.log(`\n📊 FETCHING ANALYTICS FOR PROPERTY #${propertyId}`);

        const [contractAddress, contractName] = PROPERTY_MULTI_CONTRACT.split('.');

        // Get all investors by fetching transfer events
        const investors = await fetchPropertyInvestors(propertyId, contractAddress, contractName);

        // Get payout history
        const payoutData = await fetchPayoutHistory(propertyId, contractAddress, contractName);

        const analytics: PropertyAnalytics = {
          totalInvestors: investors.length,
          investors,
          totalPayouts: payoutData.totalPayouts,
          payoutRounds: payoutData.payouts.length,
          payouts: payoutData.payouts,
        };

        console.log('✅ Analytics loaded:', {
          totalInvestors: analytics.totalInvestors,
          investorsCount: analytics.investors.length,
          investors: analytics.investors,
          totalPayouts: analytics.totalPayouts,
          payoutRounds: analytics.payoutRounds,
        });
        return analytics;
      } catch (error) {
        console.error('❌ Error fetching property analytics:', error);
        return {
          totalInvestors: 0,
          investors: [],
          totalPayouts: 0,
          payoutRounds: 0,
          payouts: [],
        };
      }
    },
    enabled: !!propertyId,
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Fetch all investors for a property by querying balances directly from contract
 * Since we can't enumerate all holders, we'll fetch from transaction history
 */
async function fetchPropertyInvestors(
  propertyId: string,
  contractAddress: string,
  contractName: string
): Promise<Array<{ address: string; shares: number }>> {
  try {
    console.log('👥 Fetching investors for property #' + propertyId);

    // Strategy 1: Try to fetch from contract transactions (might not be indexed yet)
    const contractFullAddress = `${contractAddress}.${contractName}`;
    const uniqueBuyers = new Set<string>();

    try {
      const response = await fetch(
        `${STACKS_API}/extended/v1/contract/${contractFullAddress}/transactions?limit=200`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`📦 Found ${data.results?.length || 0} contract transactions`);

        if (data.results && data.results.length > 0) {
          // Process transactions (existing code below)
        } else {
          console.warn('⚠️ No contract transactions found via contract endpoint');
        }
      }
    } catch (error) {
      console.warn('⚠️ Contract transactions endpoint failed:', error);
    }

    // Strategy 2: Search for purchase-shares transactions globally
    console.log('🔍 Searching for purchase-shares transactions globally...');
    try {
      const globalResponse = await fetch(
        `${STACKS_API}/extended/v1/tx/mempool?limit=50&unanchored=true`
      );

      if (globalResponse.ok) {
        const globalData = await globalResponse.json();
        console.log(`📦 Found ${globalData.results?.length || 0} mempool transactions`);
      }
    } catch (error) {
      console.warn('⚠️ Mempool search failed:', error);
    }

    // Strategy 3: Use STX transfer events to find buyers
    console.log('💰 Searching for STX transfers to property-multi...');
    try {
      const transferResponse = await fetch(
        `${STACKS_API}/extended/v1/address/${contractFullAddress}/stx?limit=200`
      );

      if (transferResponse.ok) {
        const transferData = await transferResponse.json();
        console.log(`📦 Found ${transferData.results?.length || 0} STX transfers`);

        // Extract senders (buyers) from STX transfers
        for (const transfer of transferData.results || []) {
          if (transfer.sender) {
            uniqueBuyers.add(transfer.sender);
            console.log(`💵 Found STX sender: ${transfer.sender}`);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ STX transfer search failed:', error);
    }

    console.log(`👥 Found ${uniqueBuyers.size} potential buyers from STX transfers`);

    // Second pass: Query current balance for each buyer
    const investors: Array<{ address: string; shares: number }> = [];

    for (const buyer of uniqueBuyers) {
      try {
        const balanceResult = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-balance',
          [uintCV(parseInt(propertyId)), principalCV(buyer)]
        );

        const shares = parseInt(balanceResult?.value?.value || '0');

        if (shares > 0) {
          investors.push({ address: buyer, shares });
          console.log(`✅ ${buyer.slice(0, 6)}...${buyer.slice(-4)}: ${shares} shares`);
        }
      } catch (error) {
        console.error(`Error fetching balance for ${buyer}:`, error);
      }
    }

    // Sort by shares (descending)
    investors.sort((a, b) => b.shares - a.shares);

    console.log(`✅ Total active investors: ${investors.length}`);
    return investors;
  } catch (error) {
    console.error('Error fetching investors:', error);
    return [];
  }
}

/**
 * Fetch payout history for a property
 */
async function fetchPayoutHistory(
  propertyId: string,
  contractAddress: string,
  contractName: string
): Promise<{ totalPayouts: number; payouts: Array<any> }> {
  try {
    console.log('💰 Fetching payout history...');

    // Get current payout round
    const roundResult = await callReadOnlyFunction(
      contractAddress,
      contractName,
      'get-current-round',
      [uintCV(parseInt(propertyId))]
    );

    const currentRound = parseInt(roundResult?.value?.value || '0');

    if (currentRound === 0) {
      console.log('⚠️ No payout rounds yet');
      return { totalPayouts: 0, payouts: [] };
    }

    const payouts = [];
    let totalPayouts = 0;

    // Fetch data for each payout round
    for (let round = 1; round <= currentRound; round++) {
      try {
        // Get payout round data from contract
        // Note: This requires a read-only function in the contract
        // For now, we'll use a placeholder structure

        // TODO: Implement contract read-only function to get payout round details
        // const payoutData = await callReadOnlyFunction(
        //   contractAddress,
        //   contractName,
        //   'get-payout-round',
        //   [uintCV(parseInt(propertyId)), uintCV(round)]
        // );

        // Placeholder data structure
        payouts.push({
          round,
          totalAmount: 0, // TODO: Extract from contract
          perShare: 0, // TODO: Calculate
          date: 'N/A', // TODO: Get from blockchain timestamp
        });
      } catch (error) {
        console.error(`Error fetching payout round ${round}:`, error);
      }
    }

    console.log(`✅ Found ${payouts.length} payout rounds, total: ${totalPayouts} STX`);
    return { totalPayouts, payouts };
  } catch (error) {
    console.error('Error fetching payout history:', error);
    return { totalPayouts: 0, payouts: [] };
  }
}
