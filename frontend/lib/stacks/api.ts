import { cvToJSON, hexToCV, serializeCV, ClarityValue } from '@stacks/transactions';
import { network } from './wallet';

const API_URL = network.isMainnet()
  ? 'https://api.mainnet.hiro.so'
  : 'https://api.testnet.hiro.so';

/**
 * Call a read-only contract function
 */
export async function callReadOnlyFunction(
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: ClarityValue[] = [],
  senderAddress?: string
) {
  const url = `${API_URL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;

  // Convert ClarityValues to hex strings
  const argsHex = functionArgs.map((arg) => {
    const serialized = serializeCV(arg);
    const hexString = Buffer.from(serialized).toString('hex');
    return `0x${hexString}`;
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: senderAddress || contractAddress,
      arguments: argsHex,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to call read-only function: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.okay) {
    throw new Error(`Contract call failed: ${data.cause}`);
  }

  // Parse the hex result
  const resultCV = hexToCV(data.result);
  return cvToJSON(resultCV);
}

/**
 * Get contract data map entry
 */
export async function getDataMapEntry(
  contractAddress: string,
  contractName: string,
  mapName: string,
  key: any
) {
  const url = `${API_URL}/v2/map_entry/${contractAddress}/${contractName}/${mapName}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(key),
  });

  if (!response.ok) {
    throw new Error(`Failed to get map entry: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.data) {
    const resultCV = hexToCV(data.data);
    return cvToJSON(resultCV);
  }

  return null;
}

/**
 * Get contract info
 */
export async function getContractInfo(contractAddress: string, contractName: string) {
  const url = `${API_URL}/v2/contracts/interface/${contractAddress}/${contractName}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get contract info: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get account STX balance
 */
export async function getAccountBalance(address: string) {
  const url = `${API_URL}/v2/accounts/${address}?proof=0`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get account balance: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    stx: BigInt(data.stx.balance),
    locked: BigInt(data.stx.locked),
    unlock_height: data.stx.unlock_height,
  };
}

/**
 * Get transaction status
 */
export async function getTransaction(txId: string) {
  const url = `${API_URL}/extended/v1/tx/${txId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get transaction: ${response.statusText}`);
  }

  return response.json();
}
