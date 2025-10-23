import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  principalCV,
  PostConditionMode,
  AnchorMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  makeContractSTXPostCondition,
} from '@stacks/transactions';
import { network, userSession } from './wallet';

const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory';

export interface TransactionCallbacks {
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

/**
 * Purchase shares in a property (using property-multi contract)
 */
export const purchaseShares = async (
  propertyId: number,
  numShares: number,
  sharePrice: number,
  minPurchase: number = 1,
  callbacks?: TransactionCallbacks
) => {
  console.log('\n💰 PURCHASE SHARES TRANSACTION');
  console.log('🆔 Property ID:', propertyId);
  console.log('📊 Number of shares:', numShares);
  console.log('💵 Price per share:', sharePrice, 'STX');
  console.log('🔢 Minimum purchase:', minPurchase);

  // Validation
  if (numShares < minPurchase) {
    throw new Error(`Minimum purchase is ${minPurchase} shares`);
  }

  // Use property-multi contract
  const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';
  const [contractAddress, contractName] = PROPERTY_MULTI_CONTRACT.split('.');

  if (!contractAddress || !contractName) {
    throw new Error('Invalid contract format. Expected: ADDRESS.CONTRACT_NAME');
  }

  console.log('🔍 Using property-multi contract:', {
    contractAddress,
    contractName,
    propertyId,
  });

  // Function args: property-id and num-shares
  const functionArgs = [uintCV(propertyId), uintCV(numShares)];

  // Calculate total cost in micro-STX (precise calculation)
  const totalCostSTX = sharePrice * numShares;
  const totalCost = BigInt(Math.floor(totalCostSTX * 1000000));

  console.log('💰 Total cost calculation:', {
    sharePrice,
    numShares,
    totalSTX: totalCostSTX,
    totalMicroSTX: totalCost.toString(),
  });

  // Get user address
  const userData = userSession.loadUserData();
  const userAddress = network.isMainnet()
    ? userData.profile.stxAddress.mainnet
    : userData.profile.stxAddress.testnet;

  console.log('👤 User address:', userAddress);

  // Create post condition to ensure user sends the correct amount
  const postConditions = [
    makeStandardSTXPostCondition(
      userAddress,
      FungibleConditionCode.Equal,
      totalCost
    ),
  ];

  console.log('✅ Post-conditions set: User must send exactly', totalCost.toString(), 'micro-STX');

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'purchase-shares',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('✅ Purchase transaction submitted:', data.txId);
      console.log('🔗 View on explorer:', `https://explorer.stacks.co/txid/${data.txId}?chain=${network.isMainnet() ? 'mainnet' : 'testnet'}`);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('❌ Purchase transaction cancelled by user');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Purchase shares in a property using sBTC (new!)
 */
export const purchaseSharesSBTC = async (
  propertyId: number,
  numShares: number,
  sharePrice: number,
  minPurchase: number = 1,
  callbacks?: TransactionCallbacks
) => {
  console.log('\n💰 PURCHASE SHARES TRANSACTION (sBTC)');
  console.log('🆔 Property ID:', propertyId);
  console.log('📊 Number of shares:', numShares);
  console.log('💵 Price per share:', sharePrice, 'STX');
  console.log('🔢 Minimum purchase:', minPurchase);

  // Validation
  if (numShares < minPurchase) {
    throw new Error(`Minimum purchase is ${minPurchase} shares`);
  }

  const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';
  const [contractAddress, contractName] = PROPERTY_MULTI_CONTRACT.split('.');

  console.log('🔍 Using property-multi contract:', {
    contractAddress,
    contractName,
    propertyId,
    currency: 'sBTC'
  });

  // Function args: property-id and num-shares
  const functionArgs = [uintCV(propertyId), uintCV(numShares)];

  // Calculate total cost in micro-STX (same price, different currency)
  const totalCostSTX = sharePrice * numShares;
  const totalCost = BigInt(Math.floor(totalCostSTX * 1000000));

  console.log('💰 Total cost calculation:', {
    sharePrice,
    numShares,
    totalSTX: totalCostSTX,
    totalMicroSTX: totalCost.toString(),
    currency: 'sBTC'
  });

  // Get user address
  const userData = userSession.loadUserData();
  const userAddress = network.isMainnet()
    ? userData.profile.stxAddress.mainnet
    : userData.profile.stxAddress.testnet;

  console.log('👤 User address:', userAddress);

  // Note: For sBTC, we would need to add post-conditions for sBTC token transfer
  // For MVP, we'll use Allow mode
  console.log('⚠️ Using Allow mode for sBTC (post-conditions to be implemented)');

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'purchase-shares-sbtc',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow, // TODO: Add sBTC post-conditions
    onFinish: (data) => {
      console.log('✅ sBTC Purchase transaction submitted:', data.txId);
      console.log('🔗 View on explorer:', `https://explorer.stacks.co/txid/${data.txId}?chain=${network.isMainnet() ? 'mainnet' : 'testnet'}`);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('❌ sBTC Purchase transaction cancelled by user');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Claim payout from a property (updated for property-multi)
 */
export const claimPayout = async (
  propertyId: number,
  roundId: number,
  callbacks?: TransactionCallbacks
) => {
  console.log('\n💰 CLAIM PAYOUT TRANSACTION');
  console.log('🆔 Property ID:', propertyId);
  console.log('🔄 Round ID:', roundId);

  const PROPERTY_MULTI_CONTRACT = process.env.NEXT_PUBLIC_PROPERTY_MULTI_CONTRACT || 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ.property-multi';
  const [contractAddress, contractName] = PROPERTY_MULTI_CONTRACT.split('.');

  const functionArgs = [uintCV(propertyId), uintCV(roundId)];

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'claim-payout',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('✅ Claim transaction submitted:', data.txId);
      console.log('🔗 View on explorer:', `https://explorer.stacks.co/txid/${data.txId}?chain=${network.isMainnet() ? 'mainnet' : 'testnet'}`);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('❌ Claim transaction cancelled');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Register a new property (owner only)
 *
 * Smart contract expects (updated for property-multi):
 * 1. name (string-ascii 32) - property name
 * 2. symbol (string-ascii 10) - property token symbol
 * 3. total-shares (uint) - total number of shares
 * 4. share-price (uint) - price per share in micro-STX
 * 5. min-purchase (uint) - minimum shares per purchase
 * 6. location (string-utf8 256) - property location
 * 7. metadata-uri (string-utf8 256) - IPFS URI with full property metadata JSON
 */
export const registerProperty = async (
  propertyData: {
    name: string;
    symbol: string;
    location: string;
    totalShares: number;
    sharePrice: number; // In STX, will be converted to micro-STX
    minPurchase: number;
    metadataUri: string; // IPFS URI with full metadata (images, description, etc.)
  },
  callbacks?: TransactionCallbacks
) => {
  const [factoryAddress, factoryName] = FACTORY_CONTRACT.split('.');

  // Validate name and symbol lengths for Clarity
  const name = propertyData.name.substring(0, 32);
  const symbol = propertyData.symbol.substring(0, 10);

  // Convert share price to micro-STX
  const sharePriceMicroStx = Math.floor(propertyData.sharePrice * 1000000);

  const functionArgs = [
    stringAsciiCV(name), // name (max 32 chars)
    stringAsciiCV(symbol), // symbol (max 10 chars)
    uintCV(propertyData.totalShares), // total-shares
    uintCV(sharePriceMicroStx), // share-price in micro-STX
    uintCV(propertyData.minPurchase), // min-purchase
    stringUtf8CV(propertyData.location), // location
    stringUtf8CV(propertyData.metadataUri), // metadata-uri
  ];

  return openContractCall({
    contractAddress: factoryAddress,
    contractName: factoryName,
    functionName: 'register-property',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Property registration submitted:', data.txId);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('Property registration cancelled');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Distribute payout to property shareholders (owner only)
 */
export const distributePayout = async (
  propertyContract: string,
  totalAmount: number,
  callbacks?: TransactionCallbacks
) => {
  const [contractAddress, contractName] = propertyContract.split('.');

  const functionArgs = [
    uintCV(Math.floor(totalAmount * 1000000)), // Convert to micro-STX
  ];

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'distribute-payout',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Payout distribution submitted:', data.txId);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('Payout distribution cancelled');
      callbacks?.onCancel?.();
    },
  });
};
