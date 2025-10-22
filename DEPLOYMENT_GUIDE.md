# MicroPropiedad BTC - Deployment & Testing Guide

## Prerequisites

1. **Clarinet** - Stacks smart contract development tool
2. **Node.js** (v18+) and npm
3. **Stacks Wallet** - Hiro Wallet, Leather, or Xverse
4. **Testnet STX** - Get from [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

## Smart Contract Deployment

### Step 1: Install Clarinet

```bash
# Download and install Clarinet
wget -nv https://github.com/hirosystems/clarinet/releases/download/v2.10.1/clarinet-linux-x64-glibc.tar.gz -O /tmp/clarinet-linux-x64.tar.gz
tar -xzf /tmp/clarinet-linux-x64.tar.gz -C /tmp
sudo mv /tmp/clarinet /usr/local/bin/
clarinet --version
```

### Step 2: Test Smart Contracts Locally

```bash
cd contracts/

# Check contracts for errors
clarinet check

# Run unit tests
clarinet test

# Start local devnet
clarinet integrate
```

### Step 3: Deploy to Testnet

```bash
# Configure your testnet account
clarinet deployments generate --testnet

# Deploy contracts to testnet
clarinet deployments apply --testnet
```

After deployment, note the contract addresses from the output. You'll need to update these in the frontend `.env.local` file.

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend/
npm install
```

### Step 2: Configure Environment Variables

Create or update `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your deployed contract addresses:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_FACTORY_CONTRACT=<YOUR_ADDRESS>.property-factory
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=<YOUR_ADDRESS>
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Application

### 1. Connect Wallet

1. Click "Connect Wallet" in the top right
2. Choose your wallet (Hiro, Leather, or Xverse)
3. Approve the connection

### 2. List a Property (Owner)

1. Navigate to "Add Property" (requires wallet connection)
2. Fill in property details:
   - Name
   - Location
   - Description
   - Image URL
   - Total Shares
   - Share Price (in STX)
   - Property Value
   - Expected ROI
3. Click "Submit" and approve the transaction
4. Wait for transaction confirmation (~10 minutes on testnet)

### 3. Purchase Shares (Investor)

1. Go to Marketplace
2. Click on a property card
3. Enter number of shares to purchase
4. Click "Buy Shares"
5. Approve the transaction in your wallet
6. Wait for confirmation

### 4. View Portfolio

1. Navigate to "My Portfolio"
2. See all your property investments
3. View claimable payouts
4. Claim dividends from property revenue

## Smart Contract Functions

### Property Factory Contract

**Public Functions:**
- `register-property` - Register a new property (admin only)
- `update-property-status` - Update property status
- `update-property-stats` - Update statistics

**Read-Only Functions:**
- `get-property` - Get property details by ID
- `get-property-count` - Get total registered properties
- `get-owner-properties` - Get properties owned by address

### Property Contract

**Public Functions:**
- `initialize` - Initialize property (one-time)
- `purchase-shares` - Buy property shares
- `claim-payout` - Claim revenue distribution
- `distribute-payout` - Distribute revenue (oracle/owner)
- `transfer` - Transfer shares (SIP-010)

**Read-Only Functions:**
- `get-property-info` - Get property metadata
- `get-balance` - Get user's share balance
- `get-payout-round` - Get payout round info
- `calculate-claimable` - Calculate claimable amount

## Testnet Resources

- **Stacks Explorer**: https://explorer.hiro.so/?chain=testnet
- **Testnet Faucet**: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **API Docs**: https://docs.hiro.so/api
- **Clarity Docs**: https://docs.stacks.co/clarity

## Troubleshooting

### "Insufficient funds" error
- Get testnet STX from the faucet
- Wait a few minutes for the transaction to confirm

### "Contract not found"
- Verify contract addresses in `.env.local`
- Check deployment status in Stacks Explorer

### Wallet connection fails
- Clear browser cache
- Try a different wallet
- Refresh the page

### Properties not loading
- Check browser console for errors
- Verify testnet API is accessible
- Ensure contracts are deployed correctly

## Production Deployment

### Smart Contracts

1. Thoroughly test on testnet
2. Get professional security audit
3. Deploy to mainnet using Clarinet
4. Update frontend environment variables

### Frontend

1. Update `.env.production`:
   ```env
   NEXT_PUBLIC_NETWORK=mainnet
   NEXT_PUBLIC_FACTORY_CONTRACT=<MAINNET_ADDRESS>.property-factory
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm start
   # or deploy to Vercel/Netlify
   ```

## Security Considerations

⚠️ **This is a prototype for hackathon purposes**

For production:
- Professional security audit required
- Legal compliance (property tokenization laws)
- KYC/AML integration
- Insurance mechanisms
- Multi-sig wallet for funds
- Emergency pause functionality
- Upgrade mechanisms

## Support

- **Documentation**: [Stacks Docs](https://docs.stacks.co)
- **Discord**: [Stacks Discord](https://discord.gg/stacks)
- **Forum**: [Stacks Forum](https://forum.stacks.org)
