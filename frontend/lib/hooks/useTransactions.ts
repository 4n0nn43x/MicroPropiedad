'use client';

import { useQuery } from '@tanstack/react-query';
import { useProperties } from './useProperties';

const STACKS_API = process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so';
const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';

export interface Transaction {
  id: string;
  type: 'purchase' | 'payout' | 'transfer';
  propertyId: string;
  propertyName: string;
  shares: number;
  amount: number;
  timestamp: string;
  txHash: string;
  status: 'success' | 'pending' | 'failed';
}

/**
 * Fetch user's transaction history from Stacks blockchain
 */
export function useTransactions(userAddress?: string) {
  const { data: properties } = useProperties();

  return useQuery({
    queryKey: ['transactions', userAddress],
    queryFn: async () => {
      if (!userAddress) return [];

      try {
        console.log('\n💳 FETCHING TRANSACTIONS FOR USER:', userAddress);

        // Fetch all transactions for the user's address
        const response = await fetch(
          `${STACKS_API}/extended/v1/address/${userAddress}/transactions?limit=50`
        );

        if (!response.ok) {
          console.error('Failed to fetch transactions:', response.statusText);
          return [];
        }

        const data = await response.json();
        console.log('📦 Raw transactions data:', data);

        const transactions: Transaction[] = [];

        // Filter for contract calls to property-multi
        for (const tx of data.results || []) {
          // Only process successful contract calls initiated by this user
          if (tx.tx_type !== 'contract_call' || tx.tx_status !== 'success') {
            continue;
          }

          // CRITICAL: Only show transactions where this user is the sender
          if (tx.sender_address !== userAddress) {
            continue;
          }

          const contractId = `${tx.contract_call?.contract_id}`;

          // Only process transactions to property-multi contract
          if (contractId !== PROPERTY_MULTI_CONTRACT) {
            continue;
          }

          const functionName = tx.contract_call?.function_name;

          console.log('🔍 Processing transaction:', {
            txId: tx.tx_id,
            sender: tx.sender_address,
            function: functionName,
            timestamp: tx.burn_block_time_iso,
          });

          // Parse purchase-shares transactions
          if (functionName === 'purchase-shares') {
            try {
              // Extract property-id and num-shares from function args
              const args = tx.contract_call?.function_args || [];

              // Args are in hex format, need to parse
              // arg[0] = property-id (uint)
              // arg[1] = num-shares (uint)
              const propertyIdArg = args[0];
              const numSharesArg = args[1];

              if (!propertyIdArg || !numSharesArg) continue;

              // Parse hex values (remove '0x' prefix and convert)
              const propertyId = parseInt(propertyIdArg.repr.replace('u', ''));
              const numShares = parseInt(numSharesArg.repr.replace('u', ''));

              console.log('📊 Purchase details:', { propertyId, numShares });

              // Find property name from properties list
              const property = properties?.find(p => p.id === propertyId.toString());
              const propertyName = property?.name || `Property #${propertyId}`;

              // Extract amount from STX transfer event
              let amount = 0;
              const stxTransfer = tx.events?.find((e: any) =>
                e.event_type === 'stx_asset' &&
                e.asset?.asset_event_type === 'transfer'
              );

              if (stxTransfer) {
                amount = parseInt(stxTransfer.asset.amount) / 1000000; // Convert from micro-STX
              }

              transactions.push({
                id: tx.tx_id,
                type: 'purchase',
                propertyId: propertyId.toString(),
                propertyName,
                shares: numShares,
                amount,
                timestamp: new Date(tx.burn_block_time_iso).toLocaleDateString(),
                txHash: tx.tx_id,
                status: 'success',
              });

              console.log('✅ Added purchase transaction');
            } catch (error) {
              console.error('Error parsing purchase transaction:', error);
            }
          }

          // Parse claim-payout transactions
          if (functionName === 'claim-payout') {
            try {
              const args = tx.contract_call?.function_args || [];
              const propertyIdArg = args[0];

              if (!propertyIdArg) continue;

              const propertyId = parseInt(propertyIdArg.repr.replace('u', ''));
              const property = properties?.find(p => p.id === propertyId.toString());
              const propertyName = property?.name || `Property #${propertyId}`;

              // Extract amount from STX transfer event (payout received)
              let amount = 0;
              const stxTransfer = tx.events?.find((e: any) =>
                e.event_type === 'stx_asset' &&
                e.asset?.asset_event_type === 'transfer' &&
                e.asset?.recipient === userAddress
              );

              if (stxTransfer) {
                amount = parseInt(stxTransfer.asset.amount) / 1000000;
              }

              transactions.push({
                id: tx.tx_id,
                type: 'payout',
                propertyId: propertyId.toString(),
                propertyName,
                shares: 0, // Not applicable for payouts
                amount,
                timestamp: new Date(tx.burn_block_time_iso).toLocaleDateString(),
                txHash: tx.tx_id,
                status: 'success',
              });

              console.log('✅ Added payout transaction');
            } catch (error) {
              console.error('Error parsing payout transaction:', error);
            }
          }
        }

        console.log(`\n✅ Found ${transactions.length} transactions for user`);
        return transactions.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } catch (error) {
        console.error('❌ Error fetching transactions:', error);
        return [];
      }
    },
    enabled: !!userAddress && !!properties,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
