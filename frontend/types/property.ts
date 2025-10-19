export interface Property {
  id: string;
  name: string;
  location: string;
  image: string;
  sharePrice: number;
  totalShares: number;
  soldShares: number;
  roi: number;
  status: 'active' | 'sold-out' | 'upcoming';
  description: string;
  propertyType: string;
  yearBuilt: number;
  totalValue: number;
  minPurchase: number;
  contractAddress: string;
  features: string[];
  documents: {
    title: string;
    url: string;
    type: string;
  }[];
  stats: {
    totalRaised: number;
    totalInvestors: number;
    lastPayout: string;
    nextPayout: string;
  };
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  type: 'purchase' | 'claim' | 'transfer';
  amount: number;
  shares?: number;
  date: string;
  txId: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Holding {
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  shares: number;
  totalShares: number;
  currentValue: number;
  invested: number;
  returns: number;
  roi: number;
  claimableAmount: number;
}

export interface PayoutRound {
  id: number;
  propertyId: string;
  propertyName: string;
  totalAmount: number;
  yourShare: number;
  claimed: boolean;
  date: string;
}
