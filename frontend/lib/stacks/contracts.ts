import {
  makeContractCall,
  bufferCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  principalCV,
  PostConditionMode,
  AnchorMode
} from '@stacks/transactions';
import { network, userSession } from './wallet';

const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory';

export const purchaseShares = async (
  propertyContract: string,
  numShares: number
) => {
  const functionArgs = [uintCV(numShares)];

  const txOptions = {
    contractAddress: propertyContract.split('.')[0],
    contractName: propertyContract.split('.')[1],
    functionName: 'purchase-shares',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data.txId);
      return data;
    },
  };

  return await makeContractCall(txOptions);
};

export const claimPayout = async (
  propertyContract: string,
  roundId: number
) => {
  const functionArgs = [uintCV(roundId)];

  const txOptions = {
    contractAddress: propertyContract.split('.')[0],
    contractName: propertyContract.split('.')[1],
    functionName: 'claim-payout',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data: any) => {
      console.log('Claim submitted:', data.txId);
      return data;
    },
  };

  return await makeContractCall(txOptions);
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
