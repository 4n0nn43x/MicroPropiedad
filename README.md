# 🏠 MicroPropiedad - Fractional Real Estate Ownership on Stacks Blockchain

> **Stacks Latam Hackathon 2025** | Category: Real World Asset (RWA) Tokenization

[![Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF)](https://www.stacks.co/)
[![STX](https://img.shields.io/badge/Powered%20by-STX-5546FF)](https://www.stacks.co/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Problem Statement

**Access to real estate investment in Latin America is broken:**

- 🚫 High entry barriers: minimum investments of $50,000+
- 📉 Illiquid assets: impossible to sell partial ownership
- 🏦 Opaque processes: hidden fees and complex legal structures
- 💼 Limited opportunities: only wealthy investors can participate
- 🌎 Geographic barriers: can't invest in properties outside your city

**Result**: 90% of Latin Americans are excluded from real estate investment opportunities.

## 💡 Solution

**MicroPropiedad** democratizes real estate investment through fractional ownership on Stacks blockchain:

✅ **Invest from $10**: Buy fractional shares of properties using **STX**
✅ **Instant liquidity**: Trade shares 24/7 on secondary marketplace
✅ **Transparent**: All transactions recorded on blockchain with Bitcoin-level security
✅ **Automated payouts**: Receive rental income proportionally via smart contracts
✅ **Global access**: Invest in LATAM properties from anywhere

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Bitcoin L1    │ ← Security Layer
└────────┬────────┘
         │
┌────────▼────────┐
│   Stacks L2     │ ← Smart Contracts (Clarity)
│                 │
│  ┌────────────┐ │
│  │ Property   │ │ ← Fractional ownership tokens
│  │   Multi    │ │
│  └────────────┘ │
│                 │
│  ┌────────────┐ │
│  │  Factory   │ │ ← Property creation
│  │    V2      │ │
│  └────────────┘ │
└─────────────────┘
         │
┌────────▼────────┐
│   Frontend      │ ← React/Next.js dApp
│   - Marketplace │
│   - Portfolio   │
│   - Claim       │
└─────────────────┘
```

### Key Components

1. **Smart Contracts** (Clarity on Stacks Testnet):
   - `property-multi.clar`: Manages multiple properties with unique IDs
   - `property-factory-v2.clar`: Creates and registers new properties
   - Deployed on: `STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ`

2. **Frontend** (Next.js 14 + React):
   - Property marketplace
   - Purchase shares (STX)
   - Portfolio dashboard
   - Dividend claiming system
   - Admin property creation

3. **IPFS Storage** (Pinata):
   - Property metadata (images, documents, descriptions)
   - Decentralized and immutable

---

## ✨ Key Features

### For Investors

- 🛒 **Buy Fractional Shares**: Purchase as little as 1 share of a property
- 💰 **Earn Passive Income**: Receive proportional rental payouts in STX
- 📊 **Track Portfolio**: Real-time dashboard of your investments
- 🔄 **Trade Anytime**: Secondary marketplace for liquidity
- 🔐 **Secure**: Non-custodial, you control your keys

### For Property Owners

- 🏢 **Tokenize Property**: Convert real estate into fractional shares
- 💵 **Raise Capital**: Access to global pool of investors
- 🤖 **Automated Payouts**: Smart contract handles dividend distribution
- 📈 **Set Parameters**: Flexible min purchase, price per share, total shares
- 📄 **IPFS Documentation**: Upload property docs, images, legal papers

### Technical Highlights

- ✅ **STX Payments**: Native Stacks token for all transactions
- ✅ **Pull Pattern**: Gas-efficient payout claiming system
- ✅ **Multi-Property**: Single contract manages unlimited properties
- ✅ **Property-ID Based**: Each property has unique on-chain identifier
- ✅ **Metadata Rich**: Full property details on IPFS
- ✅ **Real-time Updates**: Event-driven architecture

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- Clarinet CLI
- Hiro Wallet or Leather Wallet
- Testnet STX tokens (get from [faucet](https://explorer.hiro.so/sandbox/faucet))

### Quick Start

```bash
# Clone repository
git clone https://github.com/4n0nn43x/MicroPropiedad.git
cd MicroPropiedad

# Install dependencies (frontend)
cd frontend
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Pinata JWT and contract addresses

# Run frontend
npm run dev
# Open http://localhost:3000
```

### Deploy Contracts (Optional)

```bash
cd contracts

# Check contracts
clarinet check

# Deploy to testnet
clarinet deployments apply -p deployments/default.testnet-plan-v2.yaml
```

Full setup guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 💎 Smart Contract API

### Property Creation

```clarity
(define-public (create-property
  (name (string-ascii 32))
  (symbol (string-ascii 10))
  (uri (optional (string-utf8 256)))
  (total uint)
  (price-micro-stx uint)
  (min-buy uint)
  (addr (string-utf8 256))
  (owner principal)
))
```

### Purchase Shares (STX)

```clarity
(define-public (purchase-shares
  (property-id uint)
  (num-shares uint)
))
```

### Claim Payouts

```clarity
(define-public (claim-payout
  (property-id uint)
  (round-id uint)
))
```

---

## 📊 Business Model

### Revenue Streams

1. **Property Listing Fee**: 2% of total property value (one-time)
2. **Transaction Fees**: 1.5% on marketplace trades
3. **Payout Distribution Fee**: 0.5% on rental distributions

### Projections (Year 1)

- **50 properties** tokenized
- **$2M total** property value
- **1,000 investors**
- **$40,000 revenue**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Blockchain** | Stacks (Bitcoin-secured L2) |
| **Smart Contracts** | Clarity |
| **Payments** | STX (Stacks native token) |
| **Frontend** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS |
| **Wallet** | Hiro Wallet, Leather |
| **Storage** | IPFS (Pinata) |
| **API** | Hiro Stacks API |
| **i18n** | next-intl (EN/ES) |

---

## 🎯 Roadmap

### ✅ Phase 1: MVP (Current - Hackathon)
- [x] Multi-property smart contract architecture
- [x] Property creation & marketplace
- [x] Share purchase (STX)
- [x] Payout distribution & claiming
- [x] IPFS metadata storage
- [x] Responsive frontend

### 🔄 Phase 2: Post-Hackathon (Q4 2025)
- [ ] Legal framework (SPV structure)
- [ ] KYC/AML integration
- [ ] Smart contract audit
- [ ] Mainnet deployment
- [ ] First real property tokenization

### 🚀 Phase 3: Scale (2026)
- [ ] Partnership with real estate agencies in LATAM
- [ ] Mobile app (iOS/Android)
- [ ] Advanced governance (DAO voting)
- [ ] Cross-chain bridges

---

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Start](./QUICK_START.md)
- [Smart Contract API](./docs/SMART_CONTRACT_API.md)
- [Architecture](./docs/architecture/README.md)
- [Business Model](./docs/BUSINESS_MODEL.md)

---

## 🔐 Security

- ✅ Non-custodial: Users control private keys
- ✅ Pull payment pattern (reentrancy protection)
- ✅ Owner authorization checks
- ✅ Pausable emergency circuit breaker

---

## 📄 License

MIT License

---

## 🚀 Built for Stacks Latam Hackathon 2025

**Category**: Real World Asset (RWA) Tokenization
**Technologies**: Stacks, STX, Clarity, Bitcoin-secured blockchain
**Impact**: Democratizing real estate investment in Latin America

---

<div align="center">

**🏠 Making Real Estate Investment Accessible to Everyone 🌎**

[Documentation](./docs/) • [Smart Contracts](./contracts/)

</div>
