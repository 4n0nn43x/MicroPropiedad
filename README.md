# 🏗 MicroPropiedad BTC

**Plateforme de micro-propriété immobilière tokenisée en sBTC sur Stacks**

[![Stacks](https://img.shields.io/badge/Stacks-Blockchain-purple)](https://www.stacks.co/)
[![sBTC](https://img.shields.io/badge/sBTC-Enabled-orange)](https://www.stacks.co/sbtc)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🎯 Vision

Démocratiser l'investissement immobilier en LATAM grâce à la tokenisation fractionnée sur Bitcoin Layer 2 (Stacks).

**Permettre à n'importe qui d'acheter des fractions d'un bien immobilier en sBTC et de recevoir automatiquement une part des loyers/rendements.**

---

## 🔑 Problème

- L'immobilier est **inaccessible** (capital initial énorme)
- Inflation locale détruit l'épargne en LATAM
- Pas d'accès aux investissements "premium"
- Systèmes de co-propriété opaques
- Procédures légales compliquées pour investir à l'étranger

---

## ✅ Solution

### Tokenisation fractionnée on-chain
- **1 bien = 1000 tokens** (0.1% par token)
- Achat avec **sBTC ou STX**
- Distribution automatique des loyers **proportionnelle aux parts**
- **Liquidité** via marketplace secondaire
- **Gouvernance décentralisée** (DAO)

---

## 🏗 Architecture

### Smart Contracts (Clarity)
- `property-factory.clar` - Déploie de nouveaux contrats de propriété
- `property.clar` - Gère tokenisation, vente, distribution, gouvernance
- `marketplace.clar` - Trading secondaire (optionnel)

### Backend (Node.js)
- API REST pour indexation
- **Oracle service** pour vérification des loyers (Proof of Revenue)
- KYC/AML compliance

### Frontend (Next.js + React)
- Interface multilingue (EN/ES)
- Connexion wallet (Xverse, Leather, Hiro)
- Dashboard investisseur & promoteur
- Marketplace & gouvernance

---

## 🚀 Technologies

### Blockchain
- **Stacks** (Bitcoin Layer 2)
- **sBTC** (1:1 BTC pegged)
- **Clarity** (Smart contracts)
- **SIP-010** (Fungible token standard)

### Frontend
- Next.js 14
- React 18
- TailwindCSS
- Stacks.js / @stacks/connect
- Sats-connect (Xverse)
- i18n (EN/ES)

### Backend
- Node.js / Express
- PostgreSQL
- Prisma ORM
- Web3 oracles
- IPFS (metadata)

---

## 📊 Market Insights

### Global RWA Market
- **$25B** on-chain actuellement
- **$10T** projeté en 2030
- Tokenisation immobilière = **top trend 2025**

### LATAM Adoption
- 🇧🇷 **Brésil**: Leader (centaines de propriétés tokenisées)
- 🇨🇴 **Colombie**: Proactif (El Dorado building à Bogotá)
- 🇦🇷 **Argentine**: Haute adoption crypto
- 🇲🇽 **Mexique**: Fintech Law 2018

---

## 🔒 Sécurité & Compliance

### Smart Contract Security
- ✅ Pull-based payout pattern (évite loops coûteux)
- ✅ Circuit breakers (pause en cas d'urgence)
- ✅ Multi-signature pour fonds
- ✅ Audits réguliers

### Legal Framework
- KYC/AML embedded
- SPV (Special Purpose Vehicle) pour détenir l'actif réel
- Conformité réglementaire LATAM
- Documents juridiques on-chain (IPFS)

---

## 🛠 Installation & Setup

### Prérequis
```bash
node >= 18.x
clarinet >= 2.x
postgresql >= 14.x
```

### Clone & Install
```bash
git clone https://github.com/yourusername/micropropiedad-btc.git
cd micropropiedad-btc

# Install dependencies
npm install

# Setup contracts
cd contracts
clarinet integrate

# Setup frontend
cd ../frontend
npm install

# Setup backend
cd ../backend
npm install
cp .env.example .env
```

### Development
```bash
# Start local Stacks node
clarinet devnet start

# Deploy contracts
npm run deploy:local

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

---

## 📖 Documentation

- [Architecture Overview](docs/architecture/README.md)
- [Smart Contract Specification](docs/architecture/smart-contracts.md)
- [API Documentation](docs/architecture/api.md)
- [Security Audit](docs/architecture/security.md)
- [Legal Framework](docs/legal/compliance.md)

---

## 🎯 Roadmap

### Phase 1: MVP (Hackathon)
- ✅ Research & Architecture
- ⏳ Smart contracts (Factory + Property)
- ⏳ Frontend dApp (MVP)
- ⏳ Oracle service (simulé)
- ⏳ Demo sur testnet

### Phase 2: Production (Post-Hackathon)
- Audits smart contracts
- KYC/AML intégration
- SPV création
- Partnership LATAM
- Mainnet deployment

### Phase 3: Scale
- Marketplace liquide
- DeFi integration (collatéral)
- Multi-asset (hotels, co-working)
- DAO gouvernance avancée

---

## 💰 Business Model

| Revenue Stream | Fee |
|---------------|-----|
| Tokenisation fee | 2-5% montant levé |
| Transaction fee | 1% achat/revente |
| Performance fee | 2% revenus |
| Premium services | Variable |

---

## 👥 Team

- **Blockchain Architect** - Smart contracts & infrastructure
- **Frontend Developer** - dApp interface
- **Backend Developer** - API & oracles
- **Legal Advisor** - Compliance LATAM

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [Website](https://micropropiedad.btc)
- [Documentation](https://docs.micropropiedad.btc)
- [Twitter](https://twitter.com/micropropiedad)
- [Discord](https://discord.gg/micropropiedad)

---

**🏆 Built for Stacks Hackathon 2025**

*Democratizing real estate investment in LATAM through Bitcoin-backed fractional ownership.*
