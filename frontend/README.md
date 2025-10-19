# MicroPropiedad Frontend

A Next.js 14 dApp for fractional real estate ownership on Stacks blockchain.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ TailwindCSS for styling
- ✅ Stacks.js wallet integration (Xverse, Leather, Hiro)
- ✅ Internationalization (EN/ES) with next-intl
- ✅ Responsive design
- ✅ Landing page with building imagery
- ✅ Wallet connection page
- ✅ Marketplace (placeholder)
- ✅ Dashboard (placeholder)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file (already created):

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_FACTORY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory
```

## Project Structure

```
frontend/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── layout.tsx      # Root layout with i18n
│   │   ├── page.tsx        # Landing page
│   │   ├── login/          # Wallet connection
│   │   ├── marketplace/    # Property listings
│   │   └── dashboard/      # Investor dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── landing/            # Landing page components
│   │   ├── Hero.tsx        # Hero with building image
│   │   ├── Features.tsx    # Feature showcase
│   │   ├── HowItWorks.tsx  # Process explanation
│   │   └── FAQ.tsx         # FAQ accordion
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Navigation + wallet button
│   │   └── Footer.tsx      # Footer links
│   └── wallet/             # Wallet integration
│       ├── WalletConnect.tsx   # Wallet selection
│       └── WalletButton.tsx    # Connect/disconnect button
├── lib/
│   └── stacks/             # Stacks.js utilities
│       ├── wallet.ts       # Wallet connection logic
│       └── contracts.ts    # Contract interactions
├── locales/                # Translations
│   ├── en.json             # English (200+ keys)
│   └── es.json             # Spanish (200+ keys)
├── i18n/
│   └── request.ts          # i18n configuration
├── public/
│   ├── images/
│   │   ├── buildings/      # Property images
│   │   └── IMAGE_GUIDE.md  # Image download guide
│   └── logo.svg            # MicroPropiedad logo
└── types/                  # TypeScript types

## Adding Building Images

The app requires building images for the hero section and property listings.

### Quick Download (Recommended)

See `/public/images/IMAGE_GUIDE.md` for detailed instructions, or:

```bash
cd public/images/buildings

# Download hero image (Unsplash)
curl -L "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920" -o hero-building.jpg

# Download property images
curl -L "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" -o building-1.jpg
curl -L "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" -o building-2.jpg
curl -L "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800" -o building-3.jpg
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Note: Build may fail due to static rendering requirements
# For MVP, use `npm run dev` for testing
```

## Wallet Integration

The app integrates with Stacks wallets:

1. **Xverse** - Most popular Stacks wallet
2. **Leather** - Open-source wallet (formerly Hiro Wallet)
3. **Hiro** - Developer-friendly wallet

### Connecting a Wallet

1. Go to `/login` page
2. Select your wallet
3. Approve connection in wallet popup
4. You'll be redirected to marketplace

## Pages

### Landing Page (`/`)
- Hero section with building background
- Features showcase (Accessibility, Passive Income, Liquidity)
- "How It Works" 4-step process
- FAQ accordion

### Login Page (`/login`)
- Wallet selection (Xverse, Leather, Hiro)
- Security features showcase
- New to Stacks? information

### Marketplace (`/marketplace`)
- Placeholder for property grid
- Will display tokenized properties

### Dashboard (`/dashboard`)
- Placeholder for investor portfolio
- Will show holdings, returns, claimable payouts

## Internationalization

The app supports English (EN) and Spanish (ES).

### Switching Languages

- Use language switcher in header (EN | ES)
- Or navigate to `/en` or `/es` directly

### Adding Translations

Edit `locales/en.json` or `locales/es.json`:

```json
{
  "landing": {
    "hero": {
      "title": "Your Title",
      "subtitle": "Your Subtitle"
    }
  }
}
```

Use in components:

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('landing.hero');
return <h1>{t('title')}</h1>;
```

## Styling

### TailwindCSS

The app uses TailwindCSS with custom theme:

```tsx
// Primary colors
className="bg-primary-500 text-white"

// Buttons
className="btn btn-primary"

// Cards
className="card p-6"
```

### Custom Classes

See `app/globals.css` for global styles and utility classes.

## Known Issues

### Build Errors

The production build may fail due to next-intl static rendering requirements. This is expected for an MVP with dynamic wallet integration.

**Solution**: Use `npm run dev` for development and testing.

### Hydration Warnings

You may see hydration warnings in development. These are suppressed in the layout with `suppressHydrationWarning`.

## Next Steps

### Immediate
- [ ] Add real building images
- [ ] Test wallet connection on Stacks testnet
- [ ] Implement property listing component

### Short-term
- [ ] Connect to deployed smart contracts
- [ ] Implement property detail page
- [ ] Add purchase shares functionality
- [ ] Implement claim payout functionality

### Long-term
- [ ] Backend API for event indexing
- [ ] Oracle service for revenue distribution
- [ ] KYC/AML integration
- [ ] Deploy to Vercel

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_NETWORK=testnet
# NEXT_PUBLIC_FACTORY_CONTRACT=your_contract_address
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3
- **Blockchain**: Stacks.js (@stacks/connect, @stacks/transactions)
- **i18n**: next-intl
- **State**: Zustand (installed but not yet used)
- **Icons**: Lucide React
- **Charts**: Recharts (for future dashboard)

## Contributing

This is an MVP built for the Stacks Hackathon 2025. Contributions welcome!

## License

MIT

## Support

For issues or questions:
- Check `/docs/architecture/` for technical documentation
- Review smart contracts in `/contracts/`
- See `PROJECT_SUMMARY.md` for complete project overview

---

**Built with ❤️ for Stacks Hackathon 2025**
**Powered by Bitcoin** 🧡
