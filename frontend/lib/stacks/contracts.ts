import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  principalCV,
  PostConditionMode,
  AnchorMode
} from '@stacks/transactions';
import { network } from './wallet';

const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory';

export const purchaseShares = async (
  propertyContract: string,
  numShares: number
) => {
  const functionArgs = [uintCV(numShares)];
  const [contractAddress, contractName] = propertyContract.split('.');

  await openContractCall({
    contractAddress,
    contractName,
    functionName: 'purchase-shares',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Transaction submitted:', data.txId);
    },
  });
};

export const claimPayout = async (
  propertyContract: string,
  roundId: number
) => {
  const functionArgs = [uintCV(roundId)];
  const [contractAddress, contractName] = propertyContract.split('.');

  await openContractCall({
    contractAddress,
    contractName,
    functionName: 'claim-payout',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Claim submitted:', data.txId);
    },
  });
};

export const getPropertyInfo = async (propertyContract: string) => {
  // This would use the Stacks API to read contract data
  // For now, returning a placeholder
  return {
    name: 'Property Name',
    symbol: 'PROP',
    totalShares: 1000,
    sharesSold: 0,
    sharePrice: 100000000, // micro-STX
  };
};
