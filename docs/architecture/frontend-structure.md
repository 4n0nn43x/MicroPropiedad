# Frontend Structure - MicroPropiedad BTC

## 📁 Directory Structure

```
frontend/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Root layout with i18n
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   │   └── page.tsx          # Login/Connect wallet page
│   │   ├── marketplace/
│   │   │   ├── page.tsx          # Properties marketplace
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Property detail page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Investor dashboard
│   │   └── owner/
│   │       └── page.tsx          # Property owner dashboard
│   ├── api/                      # API routes (if needed)
│   └── globals.css               # Global styles
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Main navigation
│   │   ├── Footer.tsx            # Footer
│   │   └── Sidebar.tsx           # Dashboard sidebar
│   │
│   ├── landing/
│   │   ├── Hero.tsx              # Hero section with building images
│   │   ├── Features.tsx          # Features showcase
│   │   ├── HowItWorks.tsx        # Step-by-step explanation
│   │   ├── PropertyShowcase.tsx  # Featured properties
│   │   └── FAQ.tsx               # Frequently asked questions
│   │
│   ├── wallet/
│   │   ├── WalletConnect.tsx     # Wallet connection modal
│   │   ├── WalletButton.tsx      # Connect wallet button
│   │   └── WalletInfo.tsx        # Connected wallet display
│   │
│   ├── property/
│   │   ├── PropertyCard.tsx      # Property card component
│   │   ├── PropertyGrid.tsx      # Grid of properties
│   │   ├── PropertyFilters.tsx   # Filter sidebar
│   │   ├── PropertyDetail.tsx    # Full property details
│   │   ├── PurchaseModal.tsx     # Share purchase modal
│   │   └── ClaimPayout.tsx       # Claim revenue component
│   │
│   ├── dashboard/
│   │   ├── PortfolioSummary.tsx  # Portfolio overview
│   │   ├── HoldingsList.tsx      # List of holdings
│   │   ├── RevenueChart.tsx      # Revenue analytics
│   │   └── ActivityFeed.tsx      # Recent transactions
│   │
│   └── ui/
│       ├── Button.tsx            # Reusable button
│       ├── Card.tsx              # Card component
│       ├── Input.tsx             # Form input
│       ├── Modal.tsx             # Modal dialog
│       ├── Badge.tsx             # Status badge
│       ├── Spinner.tsx           # Loading spinner
│       └── Stats.tsx             # Statistics display
│
├── lib/
│   ├── stacks/
│   │   ├── config.ts             # Stacks network config
│   │   ├── contracts.ts          # Contract interactions
│   │   └── wallet.ts             # Wallet utilities
│   │
│   ├── hooks/
│   │   ├── useWallet.ts          # Wallet connection hook
│   │   ├── useProperty.ts        # Property data hook
│   │   ├── usePortfolio.ts       # Portfolio data hook
│   │   └── useTransaction.ts     # Transaction hook
│   │
│   └── utils/
│       ├── format.ts             # Number/date formatting
│       ├── validation.ts         # Form validation
│       └── constants.ts          # App constants
│
├── locales/
│   ├── en.json                   # English translations
│   └── es.json                   # Spanish translations
│
├── public/
│   ├── images/
│   │   ├── buildings/            # Building images
│   │   ├── icons/                # Icons
│   │   └── logo.svg              # Logo
│   └── fonts/                    # Custom fonts
│
├── types/
│   ├── property.ts               # Property type definitions
│   ├── wallet.ts                 # Wallet types
│   └── index.ts                  # Exported types
│
├── middleware.ts                 # i18n middleware
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (#0066CC) - Trust, stability
- **Secondary**: Gold (#FFB800) - Premium, investment
- **Success**: Green (#00CC66) - Positive returns
- **Danger**: Red (#CC0033) - Risks, alerts
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter (Sans-serif, modern)
- **Body**: Inter (Readable, clean)
- **Mono**: Fira Code (For numbers, addresses)

---

## 📄 Key Pages

### 1. Landing Page (`/`)
**Sections**:
- Hero with building background image
- Value proposition (3 key benefits)
- How it works (4 steps)
- Featured properties
- Statistics (total properties, investors, volume)
- Testimonials
- FAQ
- CTA to sign up

### 2. Login/Connect (`/login`)
**Features**:
- Wallet connection options (Xverse, Leather, Hiro)
- Visual wallet cards
- Security information
- "New to Stacks?" help section

### 3. Marketplace (`/marketplace`)
**Features**:
- Property grid with cards
- Filters: location, price, ROI, status
- Sort: newest, price, ROI
- Search by name/location
- Pagination

### 4. Property Detail (`/marketplace/[id]`)
**Features**:
- Image gallery
- Property information
- Financial metrics (ROI, price per share, total raised)
- Purchase interface
- Revenue history chart
- Documents (legal, reports)
- Owner information
- Similar properties

### 5. Investor Dashboard (`/dashboard`)
**Features**:
- Portfolio summary
- Holdings list with live values
- Revenue history
- Claimable payouts
- Transaction history
- Analytics charts

### 6. Owner Dashboard (`/owner`)
**Features**:
- Create new property listing
- Manage existing properties
- View investors
- Distribute payouts
- Analytics

---

## 🔌 Stacks.js Integration

### Wallet Providers
```typescript
- Xverse: @leather.io/stacks
- Leather: @leather.io/stacks
- Hiro: @stacks/connect
```

### Key Functions
- `connectWallet(provider)`
- `callContract(contractAddress, functionName, args)`
- `getBalance(address)`
- `getTransactionStatus(txId)`
- `signTransaction(tx)`

---

## 🌐 i18n Configuration

### Supported Languages
- English (en) - Default
- Spanish (es) - LATAM focus

### Translation Keys Structure
```json
{
  "common": { "buttons", "labels", "errors" },
  "landing": { "hero", "features", "cta" },
  "marketplace": { "filters", "cards" },
  "dashboard": { "portfolio", "holdings" },
  "wallet": { "connect", "status" }
}
```

---

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: React Query for data fetching
- **SEO**: Metadata, sitemap, structured data
- **Analytics**: Plausible or PostHog (privacy-focused)

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🔐 Security

- **Environment Variables**: API keys, contract addresses
- **Input Validation**: All user inputs sanitized
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: Next.js built-in
- **Wallet Security**: Non-custodial, user controls keys

---

## 📦 Key Dependencies

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^3.x",
  "@stacks/connect": "^7.x",
  "@stacks/transactions": "^6.x",
  "next-intl": "^3.x",
  "react-query": "^5.x",
  "zustand": "^4.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x"
}
```

---

## 🎯 Development Workflow

1. **Setup**: Install dependencies
2. **Configure**: Set env variables
3. **Develop**: Run `npm run dev`
4. **Test**: Component tests with Vitest
5. **Build**: `npm run build`
6. **Deploy**: Vercel (recommended)

---

This structure ensures a professional, scalable, and maintainable frontend for MicroPropiedad BTC.
