import { Property, Transaction, Holding, PayoutRound } from '@/types/property';

export const demoProperties: Property[] = [
  {
    id: '1',
    name: 'Modern Apartment Building - São Paulo',
    location: 'São Paulo, Brazil',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 100,
    totalShares: 1000,
    soldShares: 750,
    roi: 8.5,
    status: 'active',
    description: 'Prime location in São Paulo\'s financial district. Modern 20-story building with 80 residential units. High occupancy rate and strong rental demand.',
    propertyType: 'Residential',
    yearBuilt: 2020,
    totalValue: 100000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE123.property-sao-paulo',
    features: [
      '80 residential units',
      'Gym and pool',
      '24/7 security',
      'Underground parking',
      'Commercial ground floor'
    ],
    documents: [
      { title: 'Property Title', url: '#', type: 'pdf' },
      { title: 'Legal Structure', url: '#', type: 'pdf' },
      { title: 'Financial Report Q4 2024', url: '#', type: 'pdf' },
      { title: 'Inspection Report', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 75000,
      totalInvestors: 145,
      lastPayout: '2025-09-15',
      nextPayout: '2025-10-15'
    }
  },
  {
    id: '2',
    name: 'Commercial Plaza - Bogotá',
    location: 'Bogotá, Colombia',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 150,
    totalShares: 1000,
    soldShares: 920,
    roi: 10.2,
    status: 'active',
    description: 'Premium commercial plaza in Bogotá\'s business district. Mixed-use building with office spaces and retail on ground floor. Long-term corporate tenants.',
    propertyType: 'Commercial',
    yearBuilt: 2019,
    totalValue: 150000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE456.property-bogota',
    features: [
      '15,000 sqm office space',
      'Retail ground floor',
      'Conference facilities',
      'Parking for 200 vehicles',
      'LEED certified'
    ],
    documents: [
      { title: 'Property Title', url: '#', type: 'pdf' },
      { title: 'Tenant Agreements', url: '#', type: 'pdf' },
      { title: 'Financial Report Q4 2024', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 138000,
      totalInvestors: 89,
      lastPayout: '2025-09-20',
      nextPayout: '2025-10-20'
    }
  },
  {
    id: '3',
    name: 'Luxury Condos - Buenos Aires',
    location: 'Buenos Aires, Argentina',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 80,
    totalShares: 1000,
    soldShares: 450,
    roi: 7.8,
    status: 'active',
    description: 'Elegant residential building in Palermo neighborhood. 50 luxury condominiums with modern amenities. Strong rental market for expatriates and executives.',
    propertyType: 'Residential',
    yearBuilt: 2021,
    totalValue: 80000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE789.property-buenos-aires',
    features: [
      '50 luxury units',
      'Rooftop terrace',
      'Concierge service',
      'Smart home features',
      'Pet-friendly'
    ],
    documents: [
      { title: 'Property Title', url: '#', type: 'pdf' },
      { title: 'Building Plans', url: '#', type: 'pdf' },
      { title: 'Financial Projections', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 36000,
      totalInvestors: 67,
      lastPayout: '2025-09-10',
      nextPayout: '2025-10-10'
    }
  },
  {
    id: '4',
    name: 'Tech Hub - Mexico City',
    location: 'Mexico City, Mexico',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 120,
    totalShares: 1000,
    soldShares: 1000,
    roi: 9.5,
    status: 'sold-out',
    description: 'Modern tech-focused office building in Santa Fe district. Co-working spaces and tech startup offices. High-growth area with strong demand.',
    propertyType: 'Commercial',
    yearBuilt: 2022,
    totalValue: 120000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE012.property-mexico-city',
    features: [
      'Co-working spaces',
      'High-speed internet',
      'Event spaces',
      'Cafeteria',
      'EV charging stations'
    ],
    documents: [
      { title: 'Property Title', url: '#', type: 'pdf' },
      { title: 'Occupancy Report', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 120000,
      totalInvestors: 234,
      lastPayout: '2025-09-25',
      nextPayout: '2025-10-25'
    }
  },
  {
    id: '5',
    name: 'Beach Resort - Cancún',
    location: 'Cancún, Mexico',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 200,
    totalShares: 1000,
    soldShares: 0,
    roi: 12.0,
    status: 'upcoming',
    description: 'Beachfront resort property with vacation rentals. Tourism hotspot with year-round demand. Launching soon - reserve your shares!',
    propertyType: 'Hospitality',
    yearBuilt: 2023,
    totalValue: 200000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE345.property-cancun',
    features: [
      'Beachfront location',
      '100 vacation units',
      'Pool and spa',
      'Restaurant and bar',
      'Water sports facilities'
    ],
    documents: [
      { title: 'Project Prospectus', url: '#', type: 'pdf' },
      { title: 'Market Analysis', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 0,
      totalInvestors: 0,
      lastPayout: 'N/A',
      nextPayout: 'TBD'
    }
  },
  {
    id: '6',
    name: 'Student Housing - Santiago',
    location: 'Santiago, Chile',
    image: '/images/buildings/building-1.jpg',
    sharePrice: 90,
    totalShares: 1000,
    soldShares: 650,
    roi: 8.0,
    status: 'active',
    description: 'Purpose-built student accommodation near major universities. 120 studio apartments with study areas and common spaces. Stable long-term rental income.',
    propertyType: 'Residential',
    yearBuilt: 2021,
    totalValue: 90000,
    minPurchase: 1,
    contractAddress: 'SP1EXAMPLE678.property-santiago',
    features: [
      '120 studio apartments',
      'Study lounges',
      'Laundry facilities',
      'Bike storage',
      'High-speed WiFi'
    ],
    documents: [
      { title: 'Property Title', url: '#', type: 'pdf' },
      { title: 'Occupancy Statistics', url: '#', type: 'pdf' }
    ],
    stats: {
      totalRaised: 58500,
      totalInvestors: 98,
      lastPayout: '2025-09-12',
      nextPayout: '2025-10-12'
    }
  }
];

export const demoHoldings: Holding[] = [
  {
    propertyId: '1',
    propertyName: 'Modern Apartment Building - São Paulo',
    propertyImage: '/images/buildings/building-1.jpg',
    shares: 50,
    totalShares: 1000,
    currentValue: 5250,
    invested: 5000,
    returns: 250,
    roi: 5.0,
    claimableAmount: 42.50
  },
  {
    propertyId: '2',
    propertyName: 'Commercial Plaza - Bogotá',
    propertyImage: '/images/buildings/building-1.jpg',
    shares: 30,
    totalShares: 1000,
    currentValue: 4650,
    invested: 4500,
    returns: 150,
    roi: 3.33,
    claimableAmount: 30.60
  }
];

export const demoTransactions: Transaction[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Modern Apartment Building - São Paulo',
    type: 'purchase',
    amount: 5000,
    shares: 50,
    date: '2025-08-15T10:30:00Z',
    txId: '0x1234...5678',
    status: 'completed'
  },
  {
    id: '2',
    propertyId: '1',
    propertyName: 'Modern Apartment Building - São Paulo',
    type: 'claim',
    amount: 42.50,
    date: '2025-09-15T14:20:00Z',
    txId: '0x2345...6789',
    status: 'completed'
  },
  {
    id: '3',
    propertyId: '2',
    propertyName: 'Commercial Plaza - Bogotá',
    type: 'purchase',
    amount: 4500,
    shares: 30,
    date: '2025-07-20T09:15:00Z',
    txId: '0x3456...7890',
    status: 'completed'
  },
  {
    id: '4',
    propertyId: '2',
    propertyName: 'Commercial Plaza - Bogotá',
    type: 'claim',
    amount: 30.60,
    date: '2025-09-20T16:45:00Z',
    txId: '0x4567...8901',
    status: 'pending'
  }
];

export const demoPayoutRounds: PayoutRound[] = [
  {
    id: 1,
    propertyId: '1',
    propertyName: 'Modern Apartment Building - São Paulo',
    totalAmount: 850,
    yourShare: 42.50,
    claimed: true,
    date: '2025-09-15'
  },
  {
    id: 2,
    propertyId: '1',
    propertyName: 'Modern Apartment Building - São Paulo',
    totalAmount: 850,
    yourShare: 42.50,
    claimed: false,
    date: '2025-10-15'
  },
  {
    id: 1,
    propertyId: '2',
    propertyName: 'Commercial Plaza - Bogotá',
    totalAmount: 1020,
    yourShare: 30.60,
    claimed: false,
    date: '2025-10-20'
  }
];
