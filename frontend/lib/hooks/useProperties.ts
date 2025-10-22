'use client';

import { useQuery } from '@tanstack/react-query';
import { callReadOnlyFunction } from '../stacks/api';
import { uintCV, principalCV } from '@stacks/transactions';

const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory';

export interface Property {
  id: string;
  contractAddress: string;
  contractName: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  sharePrice: number;
  totalShares: number;
  soldShares: number;
  roi: number;
  status: 'active' | 'sold-out' | 'upcoming';
  estimatedAnnualReturn: number;
  propertyValue: number;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
}

/**
 * Fetch all registered properties from the factory contract
 */
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');

        // Get property count from factory
        const countResult = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property-count'
        );

        const propertyCount = countResult?.value?.value || 0;

        if (propertyCount === 0) {
          return [];
        }

        // Fetch all properties
        const properties: Property[] = [];

        for (let i = 1; i <= propertyCount; i++) {
          try {
            const propertyData = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-property',
              [uintCV(i)]
            );

            if (propertyData?.value) {
              const property = parsePropertyData(i, propertyData.value);
              if (property) {
                properties.push(property);
              }
            }
          } catch (error) {
            console.error(`Error fetching property ${i}:`, error);
          }
        }

        return properties;
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Fetch a single property by ID
 */
export function useProperty(propertyId: string) {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      try {
        const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');

        const propertyData = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property',
          [uintCV(parseInt(propertyId))]
        );

        if (!propertyData?.value) {
          return null;
        }

        return parsePropertyData(parseInt(propertyId), propertyData.value);
      } catch (error) {
        console.error(`Error fetching property ${propertyId}:`, error);
        return null;
      }
    },
    enabled: !!propertyId,
    refetchInterval: 30000,
  });
}

/**
 * Fetch property details from its own contract
 */
export function usePropertyDetails(contractAddress: string, contractName: string) {
  return useQuery({
    queryKey: ['property-details', contractAddress, contractName],
    queryFn: async () => {
      try {
        // Get property info
        const [name, symbol, totalShares, sharesSold, sharePrice] = await Promise.all([
          callReadOnlyFunction(contractAddress, contractName, 'get-name'),
          callReadOnlyFunction(contractAddress, contractName, 'get-symbol'),
          callReadOnlyFunction(contractAddress, contractName, 'get-total-supply'),
          callReadOnlyFunction(contractAddress, contractName, 'get-shares-sold'),
          callReadOnlyFunction(contractAddress, contractName, 'get-share-price'),
        ]);

        return {
          name: name?.value || 'Unknown Property',
          symbol: symbol?.value || 'PROP',
          totalShares: totalShares?.value || 0,
          sharesSold: sharesSold?.value || 0,
          sharePrice: sharePrice?.value || 0,
        };
      } catch (error) {
        console.error('Error fetching property details:', error);
        return null;
      }
    },
    enabled: !!contractAddress && !!contractName,
  });
}

/**
 * Fetch user holdings for a specific property
 */
export function useUserHoldings(propertyContract: string, userAddress?: string) {
  return useQuery({
    queryKey: ['user-holdings', propertyContract, userAddress],
    queryFn: async () => {
      if (!userAddress) return null;

      try {
        const [contractAddress, contractName] = propertyContract.split('.');

        const balance = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-balance',
          [principalCV(userAddress)]
        );

        return balance?.value || 0;
      } catch (error) {
        console.error('Error fetching user holdings:', error);
        return 0;
      }
    },
    enabled: !!userAddress && !!propertyContract,
  });
}

/**
 * Fetch all properties where user has shares
 */
export function useUserPortfolio(userAddress?: string) {
  const { data: allProperties } = useProperties();

  return useQuery({
    queryKey: ['user-portfolio', userAddress],
    queryFn: async () => {
      if (!userAddress || !allProperties) return [];

      const portfolio = [];

      for (const property of allProperties) {
        try {
          const [contractAddress, contractName] = [property.contractAddress, property.contractName];

          // Get user balance
          const balanceResult = await callReadOnlyFunction(
            contractAddress,
            contractName,
            'get-balance',
            [principalCV(userAddress)]
          );

          const shares = parseInt(balanceResult?.value?.value || '0');

          if (shares > 0) {
            // Get property info
            const infoResult = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-property-info'
            );

            const sharePrice = parseInt(infoResult?.value?.value?.['share-price']?.value || '0') / 1000000;
            const invested = shares * sharePrice;

            // Get current payout round
            const roundResult = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-current-round'
            );

            const currentRound = parseInt(roundResult?.value?.value || '0');

            // Check if user has unclaimed payouts
            let claimableAmount = 0;
            if (currentRound > 0) {
              const claimableResult = await callReadOnlyFunction(
                contractAddress,
                contractName,
                'calculate-claimable',
                [uintCV(currentRound), principalCV(userAddress)]
              );

              const alreadyClaimed = claimableResult?.value?.value?.['already-claimed']?.value === true;
              if (!alreadyClaimed) {
                claimableAmount = parseInt(claimableResult?.value?.value?.claimable?.value || '0') / 1000000;
              }
            }

            portfolio.push({
              ...property,
              sharesOwned: shares,
              invested,
              currentValue: invested * 1.1, // Rough estimate, would need price oracle
              currentRound,
              claimableAmount,
            });
          }
        } catch (error) {
          console.error(`Error fetching holdings for property ${property.id}:`, error);
        }
      }

      return portfolio;
    },
    enabled: !!userAddress && !!allProperties,
    refetchInterval: 30000,
  });
}

/**
 * Parse property data from contract response
 */
function parsePropertyData(id: number, data: any): Property | null {
  try {
    // The data structure from our property-factory contract:
    // contract-address, name, symbol, owner, total-shares, created-at, status, location

    const contractAddressFull = data['contract-address']?.value || '';
    const [contractAddress, contractName] = contractAddressFull.includes('.')
      ? contractAddressFull.split('.')
      : [contractAddressFull, ''];

    return {
      id: id.toString(),
      contractAddress: contractAddress || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: contractName || `property-${id}`,
      name: data.name?.value || `Property #${id}`,
      location: data.location?.value || 'Unknown Location',
      description: `Fractional ownership of ${data.name?.value || 'property'} in ${data.location?.value || 'location'}`,
      imageUrl: `https://images.unsplash.com/photo-${['1545324418-cc1a3fa10c00', '1512917774080-9991f1c4c750', '1564013799919-ab600027ffc6'][id % 3]}`,
      sharePrice: 0.025, // Will be fetched from property contract
      totalShares: parseInt(data['total-shares']?.value || '1000'),
      soldShares: 0, // Will be fetched from property contract
      roi: 8.5, // Default ROI, will be calculated from payouts
      status: (data.status?.value || 'active') as 'active' | 'sold-out' | 'upcoming',
      estimatedAnnualReturn: 8.5,
      propertyValue: parseInt(data['total-shares']?.value || '1000') * 500, // Estimated
      lastPayoutDate: undefined,
      nextPayoutDate: undefined,
    };
  } catch (error) {
    console.error('Error parsing property data:', error);
    return null;
  }
}
