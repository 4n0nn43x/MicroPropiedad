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
 * Parse property data from contract response
 */
function parsePropertyData(id: number, data: any): Property | null {
  try {
    // Extract data from the contract response
    // The structure depends on how your contract returns data
    const contractId = data.contract?.value || '';
    const [contractAddress, contractName] = contractId.split('.');

    return {
      id: id.toString(),
      contractAddress,
      contractName,
      name: data.name?.value || `Property #${id}`,
      location: data.location?.value || 'Unknown Location',
      description: data.description?.value || '',
      imageUrl: data.imageUrl?.value || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      sharePrice: parseInt(data.sharePrice?.value || '0') / 1000000, // Convert from micro-STX to STX
      totalShares: parseInt(data.totalShares?.value || '0'),
      soldShares: parseInt(data.soldShares?.value || '0'),
      roi: parseFloat(data.roi?.value || '0'),
      status: data.status?.value || 'active',
      estimatedAnnualReturn: parseFloat(data.estimatedReturn?.value || '0'),
      propertyValue: parseInt(data.propertyValue?.value || '0'),
      lastPayoutDate: data.lastPayoutDate?.value,
      nextPayoutDate: data.nextPayoutDate?.value,
    };
  } catch (error) {
    console.error('Error parsing property data:', error);
    return null;
  }
}
