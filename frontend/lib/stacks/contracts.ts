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
 */
export const registerProperty = async (
  propertyData: {
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    totalShares: number;
    sharePrice: number;
    propertyValue: number;
    roi: number;
  },
  callbacks?: TransactionCallbacks
) => {
  const [contractAddress, contractName] = FACTORY_CONTRACT.split('.');

  const functionArgs = [
    stringUtf8CV(propertyData.name),
    stringUtf8CV(propertyData.location),
    stringUtf8CV(propertyData.description),
    stringUtf8CV(propertyData.imageUrl),
    uintCV(propertyData.totalShares),
    uintCV(Math.floor(propertyData.sharePrice * 1000000)), // Convert to micro-STX
    uintCV(propertyData.propertyValue),
    uintCV(Math.floor(propertyData.roi * 100)), // Store as basis points
  ];

  return openContractCall({
    contractAddress,
    contractName,
    functionName: 'register-property',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
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
