'use client';

import { useQuery } from '@tanstack/react-query';
import { callReadOnlyFunction } from '../stacks/api';
import { uintCV, principalCV } from '@stacks/transactions';

const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory';

export interface Property {
  id: string;
  contractAddress: string;
  contractName: string;
  owner: string; // Principal who registered the property
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  images?: string[];
  propertyType?: string;
  sharePrice: number;
  totalShares: number;
  soldShares: number;
  roi: number;
  status: 'active' | 'sold-out' | 'upcoming';
  estimatedAnnualReturn: number;
  propertyValue: number;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
  // Additional metadata from IPFS
  details?: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
  };
  documents?: string[];
  metadataUri?: string;
}

/**
 * Fetch all registered properties from the factory contract
 */
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        console.log('🔄 Starting to fetch properties from factory...');
        const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');
        console.log('📋 Factory contract:', `${contractAddress}.${contractName}`);

        // Get property count from factory
        console.log('🔢 Fetching property count...');
        const countResult = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property-count'
        );

        const propertyCount = countResult?.value?.value || 0;
        console.log(`✅ Found ${propertyCount} properties registered`);

        if (propertyCount === 0) {
          console.log('⚠️ No properties found in factory');
          return [];
        }

        // Fetch all properties
        const properties: Property[] = [];

        for (let i = 1; i <= propertyCount; i++) {
          try {
            console.log(`\n📦 [${i}/${propertyCount}] Fetching property #${i}...`);

            // Fetch property basic data
            const propertyData = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-property',
              [uintCV(i)]
            );

            console.log(`📦 [${i}/${propertyCount}] Raw contract data:`, propertyData?.value);

            // Fetch metadata URI from separate map
            const metadataUriData = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-property-metadata',
              [uintCV(i)]
            );

            console.log(`📦 [${i}/${propertyCount}] Metadata URI data:`, metadataUriData?.value);

            if (propertyData?.value) {
              const property = await parsePropertyData(i, propertyData.value, metadataUriData?.value);
              if (property) {
                console.log(`✅ [${i}/${propertyCount}] Property parsed successfully:`, {
                  id: property.id,
                  name: property.name,
                  location: property.location,
                  hasMetadata: !!property.metadataUri,
                  hasImages: property.images ? property.images.length : 0,
                  hasDetails: !!property.details,
                  hasDocuments: property.documents ? property.documents.length : 0,
                });
                properties.push(property);
              } else {
                console.warn(`⚠️ [${i}/${propertyCount}] Property parsing returned null`);
              }
            }
          } catch (error) {
            console.error(`❌ [${i}/${propertyCount}] Error fetching property ${i}:`, error);
          }
        }

        console.log(`\n🎉 Successfully loaded ${properties.length} properties`);
        return properties;
      } catch (error) {
        console.error('❌ Fatal error fetching properties:', error);
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
        console.log(`\n🔍 Fetching single property #${propertyId}...`);
        const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');
        console.log('📋 Factory contract:', `${contractAddress}.${contractName}`);

        // Fetch property basic data
        const propertyData = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property',
          [uintCV(parseInt(propertyId))]
        );

        console.log(`📦 Raw contract data for property #${propertyId}:`, propertyData?.value);

        // Fetch metadata URI from separate map
        const metadataUriData = await callReadOnlyFunction(
          contractAddress,
          contractName,
          'get-property-metadata',
          [uintCV(parseInt(propertyId))]
        );

        console.log(`📦 Metadata URI data for property #${propertyId}:`, metadataUriData?.value);

        if (!propertyData?.value) {
          console.warn(`⚠️ No data found for property #${propertyId}`);
          return null;
        }

        const parsed = await parsePropertyData(parseInt(propertyId), propertyData.value, metadataUriData?.value);
        console.log(`✅ Property #${propertyId} parsed:`, {
          name: parsed?.name,
          hasMetadata: !!parsed?.metadataUri,
          hasImages: parsed?.images ? parsed.images.length : 0,
          hasDetails: !!parsed?.details,
        });
        return parsed;
      } catch (error) {
        console.error(`❌ Error fetching property ${propertyId}:`, error);
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

          // Get user balance from property-multi contract (takes property-id and holder)
          const balanceResult = await callReadOnlyFunction(
            contractAddress,
            contractName,
            'get-balance',
            [uintCV(parseInt(property.id)), principalCV(userAddress)]
          );

          const shares = parseInt(balanceResult?.value?.value || '0');
          console.log(`📊 Portfolio: Property #${property.id} - User ${userAddress} has ${shares} shares`);

          if (shares > 0) {
            // Use share price from property data (already fetched in useProperties)
            const sharePrice = property.sharePrice;
            const invested = shares * sharePrice;

            // Get current payout round for this property
            const roundResult = await callReadOnlyFunction(
              contractAddress,
              contractName,
              'get-current-round',
              [uintCV(parseInt(property.id))]
            );

            const currentRound = parseInt(roundResult?.value?.value || '0');

            // Check if user has unclaimed payouts
            let claimableAmount = 0;
            if (currentRound > 0) {
              const claimableResult = await callReadOnlyFunction(
                contractAddress,
                contractName,
                'calculate-claimable',
                [uintCV(parseInt(property.id)), uintCV(currentRound), principalCV(userAddress)]
              );

              const alreadyClaimed = claimableResult?.value?.value?.['already-claimed']?.value === true;
              if (!alreadyClaimed) {
                claimableAmount = parseInt(claimableResult?.value?.value?.claimable?.value || '0') / 1000000;
              }
            }

            console.log(`✅ Portfolio: Adding property #${property.id} with ${shares} shares, invested: ${invested} STX`);

            // Current value is the same as invested (shares are not tradeable yet, no price appreciation)
            // In the future, this could be calculated based on a price oracle or market data
            const currentValue = invested;

            portfolio.push({
              ...property,
              sharesOwned: shares,
              invested,
              currentValue,
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
 * Fetch metadata from IPFS
 */
async function fetchMetadata(metadataUri: string) {
  try {
    console.log('\n🌐 IPFS METADATA FETCH STARTED');
    console.log('📍 Original URI:', metadataUri);

    // Handle both IPFS URI formats and direct URLs
    let gatewayUrl = metadataUri;
    if (metadataUri.startsWith('ipfs://')) {
      const ipfsHash = metadataUri.replace('ipfs://', '');
      gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      console.log('🔄 Converted to gateway URL');
    }

    console.log('🔗 Gateway URL:', gatewayUrl);
    console.log('⏳ Fetching from IPFS gateway...');

    const fetchStartTime = Date.now();
    const response = await fetch(gatewayUrl);
    const fetchDuration = Date.now() - fetchStartTime;

    console.log(`📡 Response received in ${fetchDuration}ms`);
    console.log('📊 Response status:', response.status, response.statusText);
    console.log('📦 Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch metadata:', response.statusText);
      console.error('❌ Status code:', response.status);
      return null;
    }

    const rawText = await response.text();
    console.log('📄 Raw response length:', rawText.length, 'characters');
    console.log('📄 First 200 chars:', rawText.substring(0, 200));

    const metadata = JSON.parse(rawText);
    console.log('✅ Metadata parsed successfully!');
    console.log('📋 Metadata structure:', {
      hasName: !!metadata.name,
      hasDescription: !!metadata.description,
      hasLocation: !!metadata.location,
      hasPropertyType: !!metadata.propertyType,
      imagesCount: metadata.images?.length || 0,
      documentsCount: metadata.documents?.length || 0,
      hasFinancials: !!metadata.financials,
      hasDetails: !!metadata.details,
    });
    console.log('🎯 Full metadata:', metadata);
    console.log('✅ IPFS METADATA FETCH COMPLETED\n');

    return metadata;
  } catch (error) {
    console.error('❌ CRITICAL ERROR fetching IPFS metadata:', error);
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack trace:', error.stack);
    }
    return null;
  }
}

/**
 * Parse property data from contract response
 */
async function parsePropertyData(id: number, data: any, metadataUriData?: any): Promise<Property | null> {
  try {
    console.log(`\n🔧 PARSING PROPERTY #${id}`);
    console.log('📦 Raw contract data structure:', Object.keys(data));
    console.log('📦 Full raw data:', JSON.stringify(data, null, 2));

    // The data structure from our property-factory contract:
    // contract-address, name, symbol, owner, total-shares, created-at, status, location
    // metadata-uri is in a SEPARATE map that we fetch separately
    // Note: Clarity responses are nested: data.value.value contains the actual tuple data
    const level1 = data.value || data;
    console.log('📦 Level 1 (after data.value):', JSON.stringify(level1, null, 2));

    const actualData = level1.value || level1;
    console.log('📦 Actual data to parse (after unwrapping):', JSON.stringify(actualData, null, 2));
    console.log('📦 Keys available:', Object.keys(actualData));
    console.log('📦 Type of actualData:', typeof actualData);
    console.log('📦 actualData.owner:', actualData.owner);
    console.log('📦 actualData.owner?.value:', actualData.owner?.value);

    const contractAddressFull = actualData['contract-address']?.value || '';
    const [contractAddress, contractName] = contractAddressFull.includes('.')
      ? contractAddressFull.split('.')
      : [contractAddressFull, ''];

    console.log('📝 Contract info extracted:', {
      fullAddress: contractAddressFull,
      contractAddress,
      contractName,
    });

    // Extract basic contract fields
    const contractName_field = actualData.name?.value;
    const contractLocation = actualData.location?.value;
    const contractStatus = actualData.status?.value;
    const contractTotalShares = actualData['total-shares']?.value;
    const contractOwner = actualData.owner?.value;

    // Extract metadata URI from separate contract call
    // metadataUriData structure: {value: {type: '...', value: 'ipfs://...'}}
    let metadataUri = null;
    if (metadataUriData) {
      const metadataLevel1 = metadataUriData.value || metadataUriData;
      metadataUri = metadataLevel1.value || metadataLevel1;
      console.log('🌐 Extracted metadata URI from separate map:', metadataUri);
    }

    console.log('🔍 Extracted field values:', {
      'contract-address': contractAddressFull,
      'name': contractName_field,
      'location': contractLocation,
      'status': contractStatus,
      'total-shares': contractTotalShares,
      'owner': contractOwner,
      'metadata-uri': metadataUri || '❌ NO METADATA URI',
    });

    console.log('📋 Basic contract fields:', {
      name: contractName_field,
      location: contractLocation,
      status: contractStatus,
      totalShares: contractTotalShares,
      metadataUri: metadataUri || '❌ NO METADATA URI',
    });

    let metadata = null;

    // Fetch metadata from IPFS if available
    if (metadataUri) {
      console.log('🌐 Metadata URI found, fetching from IPFS...');
      metadata = await fetchMetadata(metadataUri);
      if (metadata) {
        console.log('✅ Metadata loaded from IPFS');
      } else {
        console.warn('⚠️ Failed to load metadata from IPFS');
      }
    } else {
      console.warn('⚠️ No metadata URI in contract, using defaults');
    }

    // Use metadata if available, otherwise fallback to defaults
    const name = contractName_field || metadata?.name || `Property #${id}`;
    const location = contractLocation || metadata?.location || 'Unknown Location';
    const description = metadata?.description || `Fractional ownership of ${name} in ${location}`;
    const images = metadata?.images || [];
    const imageUrl = images[0] || `https://images.unsplash.com/photo-${['1545324418-cc1a3fa10c00', '1512917774080-9991f1c4c750', '1564013799919-ab600027ffc6'][id % 3]}`;
    const totalShares = parseInt(contractTotalShares || metadata?.financials?.totalShares || '1000');
    const sharePrice = metadata?.financials?.sharePrice || 0.025;
    const roi = metadata?.financials?.expectedReturn || 8.5;
    const propertyValue = metadata?.financials?.totalValue || totalShares * 500;

    console.log('🎯 Merged data (contract + IPFS):', {
      owner: contractOwner,
      name,
      location,
      description: description.substring(0, 50) + '...',
      imageCount: images.length,
      firstImage: imageUrl.substring(0, 50) + '...',
      propertyType: metadata?.propertyType || '❌ not set',
      totalShares,
      sharePrice,
      roi,
      propertyValue,
      hasDetails: !!metadata?.details,
      detailsData: metadata?.details,
      documentCount: metadata?.documents?.length || 0,
    });

    // Validate owner exists - if not, return null to skip this property
    if (!contractOwner) {
      console.warn(`⚠️ Property #${id} has no owner, skipping...`);
      return null;
    }

    // Fetch soldShares from property-multi contract
    let soldShares = 0;
    try {
      const soldSharesResult = await callReadOnlyFunction(
        contractAddress,
        contractName,
        'get-shares-sold',
        [uintCV(id)]
      );
      soldShares = parseInt(soldSharesResult?.value?.value || '0');
      console.log(`📊 Property #${id} - Shares sold: ${soldShares}/${totalShares}`);
    } catch (error) {
      console.warn(`⚠️ Could not fetch soldShares for property #${id}, defaulting to 0`);
    }

    const result = {
      id: id.toString(),
      contractAddress: contractAddress || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: contractName || `property-${id}`,
      owner: contractOwner,
      name,
      location,
      description,
      imageUrl,
      images,
      propertyType: metadata?.propertyType,
      sharePrice,
      totalShares,
      soldShares,
      roi,
      status: (contractStatus || 'active') as 'active' | 'sold-out' | 'upcoming',
      estimatedAnnualReturn: roi,
      propertyValue,
      details: metadata?.details,
      documents: metadata?.documents || [],
      metadataUri,
      lastPayoutDate: undefined,
      nextPayoutDate: undefined,
    };

    console.log('✅ Final property object created');
    console.log('🏁 PARSING COMPLETE FOR PROPERTY #' + id + '\n');

    return result;
  } catch (error) {
    console.error(`❌ CRITICAL ERROR parsing property #${id}:`, error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack trace:', error.stack);
    }
    return null;
  }
}
