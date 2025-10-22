# 🏗 MicroPropiedad BTC

> **Fractional Real Estate Tokenization Platform on Stacks & sBTC**

Invest in real estate with Bitcoin. Own fractions of properties, earn passive income, and trade shares — all on the blockchain.

[![Tests](https://img.shields.io/badge/tests-65%20passing-brightgreen)]()
[![Stacks](https://img.shields.io/badge/Stacks-Testnet-purple)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 🎯 The Problem (LATAM & Global)

- 🚫 Real estate is the safest investment but **inaccessible** (huge capital required)
- 💸 Inflation destroys savings (especially in Argentina, Venezuela, etc.)
- 🔒 No access to premium investments for young people / freelancers
- 📊 No transparent co-ownership systems
- 🌍 Investing abroad = complicated legal procedures

## ✨ The Solution

**MicroPropiedad BTC** allows anyone to:

1. 🏠 **Buy fractions** of real estate with sBTC
2. 💰 **Earn passive income** from rental revenue (automatic distribution)
3. 📈 **Trade shares** on secondary marketplace (instant liquidity)
4. 🗳️ **Participate in governance** (DAO-like property decisions)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Test smart contracts (65 tests)
npm run test:contracts

# 3. Run frontend
npm run dev:frontend

# 4. Run backend (optional)
npm run dev:backend
```

**See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.**

## 📋 Recent Fixes & Features

✅ **Language Selector (ES/EN)** - Visible in navbar
✅ **Wallet Connection** - Working properly with Stacks wallets
✅ **UI/UX Fixes** - Dropdown z-index, responsive design
✅ **Marketplace** - Real estate content (removed NFT placeholders)
✅ **Smart Contract Integration** - Frontend fetches from blockchain
✅ **Backend API** - Express server + Oracle service
✅ **All Tests Passing** - 65/65 contract tests ✓

## 🏗 Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js + React + Stacks.js
│   (dApp)        │  - Marketplace, Portfolio, Governance
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────────┐
│ Smart Contracts │ │ Backend API    │
│ (Clarity)       │ │ + Oracle       │
│ - PropertyFactory│ │ - API Server   │
│ - Property (FT) │ │ - Payout Oracle│
└─────────────────┘ └────────────────┘
         │
┌────────▼────────┐
│ Stacks Testnet  │
│ (Bitcoin L2)    │
└─────────────────┘
```

## 💻 Tech Stack

### Smart Contracts
- **Clarity** - Bitcoin-secured smart contracts
- **Stacks** - Bitcoin Layer 2
- **sBTC** - 1:1 Bitcoin-backed asset
- **Clarinet** - Development & testing

### Frontend
- **Next.js 14** - App Router
- **React** - UI components
- **TypeScript** - Type safety
- **Stacks.js** - Blockchain integration
- **TailwindCSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - API server
- **Oracle Service** - Off-chain data verification

## 📁 Project Structure

```
MicroPropiedad/
├── contracts/              # Smart contracts (Clarity)
│   ├── contracts/
│   │   ├── property-factory.clar   # Registry & factory
│   │   ├── property.clar           # Fractional token (SIP-010)
│   │   └── sip010-ft-trait.clar   # Token standard
│   ├── tests/              # 65 passing tests
│   └── deployments/        # Testnet/Mainnet configs
│
├── frontend/               # Next.js dApp
│   ├── app/               # Pages (locale-based routing)
│   ├── components/        # React components
│   │   ├── wallet/       # Wallet connection
│   │   ├── layout/       # Navbar, sidebar
│   │   └── property/     # Property cards
│   ├── lib/
│   │   ├── hooks/        # useProperties, useWallet
│   │   └── stacks/       # Smart contract integration
│   └── public/
│
├── backend/               # API & Oracle
│   ├── src/
│   │   ├── index.js      # Express API
│   │   └── oracle/       # Revenue distribution oracle
│   └── api/              # Future modules
│
└── docs/                 # Documentation
    ├── QUICK_START.md    # Get started quickly
    └── DEPLOYMENT_GUIDE.md  # Detailed deployment
```

## 🎮 How It Works

### For Investors

1. **Connect Wallet** (Hiro, Leather, Xverse)
2. **Browse Properties** on marketplace
3. **Purchase Shares** with sBTC or STX
4. **Earn Revenue** from rental income (auto-distributed)
5. **Trade Shares** on secondary marketplace
6. **Vote** on property decisions (renovations, sales, etc.)

### For Property Owners

1. **List Property** with details
2. **Tokenize** into fractional shares
3. **Raise Funds** from investors
4. **Submit Revenue** proofs monthly
5. **Automatic Distribution** to shareholders

### Smart Contract Flow

```
PropertyFactory.register-property()
    ↓
Creates Property Contract (SIP-010 FT)
    ↓
Investors purchase-shares()
    ↓
Owner submits revenue proof
    ↓
Oracle verifies → distribute-payout()
    ↓
Shareholders claim-payout()
```

## 🧪 Testing

### Run All Tests
```bash
npm run test:contracts
```

**Expected output:**
```
✓ tests/property-factory.test.ts (23 tests)
✓ tests/property.test.ts (41 tests)
✓ tests/sip010-ft-trait.test.ts (1 test)

Test Files  3 passed (3)
Tests  65 passed (65)
```

### Test Coverage
- ✅ Property registration
- ✅ Share purchases
- ✅ Revenue distribution
- ✅ Payout claims
- ✅ Governance votes
- ✅ Access control
- ✅ SIP-010 compliance

## 🌐 Deployment

### Testnet (Current)
```bash
npm run deploy:testnet
```

### Mainnet (Production)
```bash
npm run deploy:mainnet
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔐 Security

⚠️ **This is a hackathon prototype**

For production deployment:
- [ ] Professional security audit
- [ ] Legal compliance (tokenization laws)
- [ ] KYC/AML integration
- [ ] Insurance mechanisms
- [ ] Multi-sig wallets
- [ ] Emergency pause functionality

## 🚧 Roadmap

### Phase 1 (Current - MVP)
- [x] Smart contracts (Factory + Property)
- [x] Frontend dApp
- [x] Wallet integration
- [x] Marketplace UI
- [x] Backend API structure

### Phase 2 (Next)
- [ ] Deploy to testnet
- [ ] Real property tokenization
- [ ] KYC integration
- [ ] Legal structure (SPV)
- [ ] Oracle automation

### Phase 3 (Future)
- [ ] Mainnet deployment
- [ ] Secondary marketplace
- [ ] Governance DAO
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Integration with DeFi protocols

## 💡 Use Cases

1. **Residential Properties** - Apartments, houses
2. **Commercial Real Estate** - Offices, retail
3. **Vacation Rentals** - Airbnb, hotels
4. **Land Development** - Pre-construction investment
5. **Co-working Spaces** - Shared office ownership

## 🌍 Target Markets

- 🇦🇷 Argentina (high inflation, real estate demand)
- 🇲🇽 Mexico (growing crypto adoption)
- 🇨🇴 Colombia (emerging market)
- 🇨🇱 Chile (stable economy)
- 🇺🇾 Uruguay (crypto-friendly regulations)

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get up and running
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy to testnet/mainnet
- [Backend README](./backend/README.md) - API & Oracle docs
- [Stacks Documentation](https://docs.stacks.co)

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🙏 Acknowledgments

- **Stacks Foundation** - For the amazing Bitcoin L2
- **Hiro** - Development tools (Clarinet, API)
- **Bitcoin** - The foundation of everything

## 📞 Support

- **Documentation**: [QUICK_START.md](./QUICK_START.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/micropropiedad-btc/issues)
- **Stacks Discord**: [Join Here](https://discord.gg/stacks)

---

**Built with ❤️ for the Stacks x Bitcoin Hackathon**

🚀 **[Get Started](./QUICK_START.md)** | 📖 **[Read Docs](./DEPLOYMENT_GUIDE.md)** | 🌐 **[Live Demo](#)** (Coming Soon)
