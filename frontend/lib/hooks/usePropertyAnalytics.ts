'use client';

import { useQuery } from '@tanstack/react-query';
import { callReadOnlyFunction } from '../stacks/api';
import { uintCV } from '@stacks/transactions';

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

        console.log('✅ Analytics loaded:', analytics);
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
 * Fetch all investors for a property by analyzing purchase transactions
 */
async function fetchPropertyInvestors(
  propertyId: string,
  contractAddress: string,
  contractName: string
): Promise<Array<{ address: string; shares: number }>> {
  try {
    console.log('👥 Fetching investors...');

    // Fetch all transactions to the property-multi contract
    const response = await fetch(
      `${STACKS_API}/extended/v1/address/${contractAddress}.${contractName}/transactions?limit=200`
    );

    if (!response.ok) {
      console.error('Failed to fetch transactions');
      return [];
    }

    const data = await response.json();
    const investorShares = new Map<string, number>();

    // Process purchase-shares transactions for this property
    for (const tx of data.results || []) {
      if (
        tx.tx_type === 'contract_call' &&
        tx.tx_status === 'success' &&
        tx.contract_call?.function_name === 'purchase-shares'
      ) {
        try {
          const args = tx.contract_call.function_args || [];
          const txPropertyId = parseInt(args[0]?.repr?.replace('u', '') || '0');

          // Only count purchases for this specific property
          if (txPropertyId.toString() !== propertyId) {
            continue;
          }

          const numShares = parseInt(args[1]?.repr?.replace('u', '') || '0');
          const buyer = tx.sender_address;

          // Accumulate shares per investor
          const currentShares = investorShares.get(buyer) || 0;
          investorShares.set(buyer, currentShares + numShares);
        } catch (error) {
          console.error('Error parsing transaction:', error);
        }
      }
    }

    // Convert map to array and sort by shares (descending)
    const investors = Array.from(investorShares.entries())
      .map(([address, shares]) => ({ address, shares }))
      .sort((a, b) => b.shares - a.shares);

    console.log(`✅ Found ${investors.length} unique investors`);
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
