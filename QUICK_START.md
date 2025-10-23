# 🚀 Quick Start Guide - MicroPropiedad BTC

## ✅ What Has Been Fixed

1. ✅ **Language selector (ES/EN)** now visible in navbar
2. ✅ **Wallet connection** working properly
3. ✅ **Dropdown z-index** fixed - no longer hidden
4. ✅ **Marketplace cleaned** - removed NFT content, added real estate content
5. ✅ **Smart contract integration** - frontend fetches data from blockchain
6. ✅ **Backend created** - API server and Oracle service
7. ✅ **Tests working** - all 65 contract tests passing

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Clarinet 3.8.1+ (already installed)
- Stacks Wallet (Hiro, Leather, or Xverse)

## 🎯 Quick Commands Reference

### Test Smart Contracts ✅
```bash
# From project root
npm run test:contracts

# Or from contracts folder
cd contracts
npm test
```

**Expected output**: ✓ 65 tests passing

### Check Contract Syntax
```bash
npm run check:contracts
```

### Run Frontend
```bash
npm run dev:frontend
# Opens at http://localhost:3000
```

### Run Backend API
```bash
npm run dev:backend
# Runs at http://localhost:3001
```

### Run Everything
```bash
# Terminal 1: Frontend (REQUIRED)
npm run dev:frontend

# Terminal 2: Backend (OPTIONAL for MVP, REQUIRED for production)
npm run dev:backend
# See BACKEND_NECESSITY.md for when you need it

# Terminal 3: Contracts Devnet (optional, for local testing)
npm run dev:contracts
```
## 🔧 Initial Setup

### 1. Install All Dependencies
```bash
npm run install:all
```

This installs dependencies for:
- Root project
- Frontend
- Contracts
- Backend

### 2. Configure Environment Variables

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_FACTORY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.property-factory
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

#### Backend (.env)
```bash
cd ../backend
cp .env.example .env
```

## 🧪 Testing Locally

### 1. Start Local Devnet (Optional)
```bash
npm run dev:contracts
```

This starts a local Stacks blockchain for testing.

### 2. Deploy Contracts to Devnet
```bash
cd contracts
clarinet deployments apply --devnet
```

### 3. Test the dApp

1. Start frontend:
   ```bash
   npm run dev:frontend
   ```

2. Open http://localhost:3000

3. Connect your wallet

4. Test features:
   - ✅ Language switcher (ES/EN)
   - ✅ Wallet connection
   - ✅ Marketplace (real estate content)
   - ✅ Property listing (mock data until contracts deployed)

## 🌐 Deploying to Testnet

### 1. Generate Deployment Plan
```bash
cd contracts
clarinet deployments generate --testnet
```

This creates `deployments/default.testnet-plan.yaml`

### 2. Get Testnet STX

Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet

### 3. Deploy Contracts
```bash
clarinet deployments apply --testnet
```

### 4. Update Frontend Config

Copy the deployed contract addresses and update `frontend/.env.local`:

```env
NEXT_PUBLIC_FACTORY_CONTRACT=<YOUR_ADDRESS>.property-factory
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=<YOUR_ADDRESS>
```

### 5. Test on Testnet

1. Restart frontend: `npm run dev:frontend`
2. Connect wallet (use testnet network)
3. List a property
4. Buy shares
5. View portfolio

## 📁 Project Structure

```
MicroPropiedad/
├── contracts/           # Smart contracts (Clarity)
│   ├── contracts/       # .clar files
│   ├── tests/          # Contract tests (Vitest)
│   └── deployments/    # Deployment configs
│
├── frontend/           # Next.js dApp
│   ├── app/           # Pages (App Router)
│   ├── components/    # React components
│   ├── lib/          # Utilities, hooks
│   └── public/       # Static assets
│
├── backend/           # Node.js API & Oracle
│   ├── src/
│   │   ├── index.js       # API server
│   │   └── oracle/        # Oracle service
│   ├── api/              # Future API modules
│   └── oracle-service/   # Future oracle modules
│
└── docs/              # Documentation
```

## 🔍 Verifying Fixes

### 1. Language Selector
- Open http://localhost:3000
- Look at top-right of navbar
- You should see: `EN | ES`
- Click to switch languages

### 2. Wallet Connection
- Click "Connect Wallet" button
- Modal should appear
- Choose wallet and connect
- Dropdown menu should appear in top-right

### 3. Dropdown Z-Index
- After connecting wallet, click your address
- Dropdown menu should appear **above** marketplace cards
- Menu should be fully visible

### 4. Marketplace Content
- Navigate to Marketplace
- Should see "Invest in Real Estate with Bitcoin" (not NFT text)
- Properties should show:
  - Location (Buenos Aires, Mexico City, etc.)
  - Share Price in sBTC
  - Available shares
  - ROI percentage
- No emojis or NFT references

### 5. Smart Contract Integration
- If contracts are deployed, marketplace loads from blockchain
- If not deployed, shows mock data with message
- Loading state: "Loading properties from blockchain..."
- Empty state: "No Properties Yet" with CTA button

## 🐛 Troubleshooting

### Tests Fail
```bash
# Clear cache and reinstall
cd contracts
rm -rf node_modules package-lock.json
npm install
npm test
```

### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Backend Error
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Wallet Connection Issues
1. Clear browser cache
2. Disconnect wallet from all sites
3. Refresh page
4. Try different wallet (Hiro/Leather/Xverse)

## 📚 Next Steps

1. **Deploy to Testnet**: Follow testnet deployment steps above
2. **List Properties**: Use "Add Property" page
3. **Test Purchases**: Buy shares in properties
4. **Claim Payouts**: Test revenue distribution
5. **Read Documentation**: See `DEPLOYMENT_GUIDE.md` for more details

## 🎓 Learning Resources

- **Stacks Docs**: https://docs.stacks.co
- **Clarity Language**: https://book.clarity-lang.org
- **Hiro Docs**: https://docs.hiro.so
- **Testnet Explorer**: https://explorer.hiro.so/?chain=testnet

## ✨ All Working Commands

```bash
# Install everything
npm run install:all

# Test contracts (✅ 65 tests pass)
npm run test:contracts

# Check contract syntax
npm run check:contracts

# Watch tests (auto-run on changes)
npm run test:watch

# Run frontend
npm run dev:frontend

# Run backend
npm run dev:backend

# Run local blockchain
npm run dev:contracts

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet (when ready)
npm run deploy:mainnet

# Format code
npm run format
```

## 🎉 Success Criteria

You've successfully set up MicroPropiedad when:

- ✅ All 65 contract tests pass
- ✅ Frontend runs without errors
- ✅ Backend API responds at http://localhost:3001/health
- ✅ Language selector visible and working
- ✅ Wallet connection successful
- ✅ Dropdown menu appears correctly
- ✅ Marketplace shows real estate content (no NFTs)
- ✅ Smart contract integration ready

---

**Need Help?** Check the detailed `DEPLOYMENT_GUIDE.md` or open an issue!
