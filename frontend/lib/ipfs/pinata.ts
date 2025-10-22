import { PinataSDK } from 'pinata-web3';

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
});

export interface UploadResult {
  IpfsHash: string;
  url: string;
}

/**
 * Upload an image file to IPFS via Pinata
 */
export async function uploadImageToIPFS(file: File): Promise<UploadResult> {
  try {
    const upload = await pinata.upload.file(file);

    return {
      IpfsHash: upload.IpfsHash,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${upload.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

/**
 * Upload multiple images to IPFS
 */
export async function uploadImagesToIPFS(files: File[]): Promise<UploadResult[]> {
  const uploads = await Promise.all(
    files.map(file => uploadImageToIPFS(file))
  );
  return uploads;
}

/**
 * Upload property metadata to IPFS
 */
export async function uploadPropertyMetadata(metadata: any): Promise<UploadResult> {
  try {
    const upload = await pinata.upload.json(metadata);

    return {
      IpfsHash: upload.IpfsHash,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${upload.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Upload a document to IPFS
 */
export async function uploadDocumentToIPFS(file: File): Promise<UploadResult> {
  try {
    const upload = await pinata.upload.file(file);

    return {
      IpfsHash: upload.IpfsHash,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${upload.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading document to IPFS:', error);
    throw new Error('Failed to upload document to IPFS');
  }
}

export default pinata;
