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
 * Purchase shares in a property
 */
export const purchaseShares = async (
  propertyContract: string,
  numShares: number,
  sharePrice: number,
  callbacks?: TransactionCallbacks
) => {
  const functionArgs = [uintCV(numShares)];
  const [contractAddress, contractName] = propertyContract.split('.');

  // Calculate total cost in micro-STX
  const totalCost = BigInt(Math.floor(sharePrice * numShares * 1000000));

  // Get user address
  const userData = userSession.loadUserData();
  const userAddress = network.isMainnet()
    ? userData.profile.stxAddress.mainnet
    : userData.profile.stxAddress.testnet;

  // Create post condition to ensure user sends the correct amount
  const postConditions = [
    makeStandardSTXPostCondition(
      userAddress,
      FungibleConditionCode.Equal,
      totalCost
    ),
  ];

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
      console.log('Purchase transaction submitted:', data.txId);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('Purchase transaction cancelled');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Claim payout from a property
 */
export const claimPayout = async (
  propertyContract: string,
  roundId: number,
  callbacks?: TransactionCallbacks
) => {
  const functionArgs = [uintCV(roundId)];
  const [contractAddress, contractName] = propertyContract.split('.');

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'claim-payout',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Claim transaction submitted:', data.txId);
      callbacks?.onFinish?.(data);
    },
    onCancel: () => {
      console.log('Claim transaction cancelled');
      callbacks?.onCancel?.();
    },
  });
};

/**
 * Register a new property (owner only)
 *
 * Smart contract expects:
 * 1. contract-addr (principal) - address of the property SIP-010 contract
 * 2. name (string-ascii 32) - property name
 * 3. symbol (string-ascii 10) - property token symbol
 * 4. total-shares (uint) - total number of shares
 * 5. location (string-utf8 256) - property location
 * 6. metadata-uri (string-utf8 256) - IPFS URI with full property metadata JSON
 */
export const registerProperty = async (
  propertyData: {
    contractAddress: string; // The deployed property contract address
    name: string;
    symbol: string;
    location: string;
    totalShares: number;
    metadataUri: string; // IPFS URI with full metadata (images, description, etc.)
  },
  callbacks?: TransactionCallbacks
) => {
  const [factoryAddress, factoryName] = FACTORY_CONTRACT.split('.');

  // Validate name and symbol lengths for Clarity
  const name = propertyData.name.substring(0, 32);
  const symbol = propertyData.symbol.substring(0, 10);

  const functionArgs = [
    principalCV(propertyData.contractAddress), // contract-addr
    stringAsciiCV(name), // name (max 32 chars)
    stringAsciiCV(symbol), // symbol (max 10 chars)
    uintCV(propertyData.totalShares), // total-shares
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
