# 🧪 Testing Guide - MicroPropiedad

## Quick Start Testing

### Prerequisites
```bash
# 1. Start frontend
npm run dev:frontend
# Opens at http://localhost:3000

# 2. Have a Stacks wallet installed
# - Hiro Wallet: https://wallet.hiro.so
# - Leather: https://leather.io
# - Xverse: https://xverse.app
```

---

## Test Scenario 1: Property Owner Flow

### Step 1: Connect Wallet
1. Open http://localhost:3000
2. Click "Connect Wallet" (top right)
3. Select your wallet
4. Approve connection
5. ✅ **Expected:** Your address appears in navbar dropdown

### Step 2: Register a Property
1. Click your address → "Add Property"
   - Or navigate to `/add-property`
2. Fill in **Step 1 - Basic Info:**
   ```
   Property Name: Modern Loft Buenos Aires
   Description: Beautiful 2-bedroom loft in Palermo
   Location: Buenos Aires, Argentina
   Property Type: Residential
   ```
3. Click "Next Step"
4. Fill in **Step 2 - Financial Details:**
   ```
   Total Property Value: 500000 (USD)
   Total Shares: 1000
   Price per Share: 500 (auto-calculated)
   Expected Annual Return: 8 (%)
   ```
5. Click "Next Step" (skip step 3 for now)
6. Click "Next Step" (skip step 4 for now)
7. Click "Submit Property to Blockchain"
8. ✅ **Expected:** Wallet popup appears
9. Confirm transaction in wallet
10. ✅ **Expected:** Alert with transaction ID
11. ✅ **Expected:** Redirected to marketplace
12. Wait ~10 seconds for transaction confirmation

### Step 3: Verify Property Appears
1. Refresh marketplace page
2. ✅ **Expected:** Your property appears in the grid
3. Click on the property
4. ✅ **Expected:** Property details page loads
5. ✅ **Expected:** All data matches what you entered

**✅ Success Criteria:**
- Property visible in marketplace
- Correct name, location, shares, price
- "Purchase Shares" button available

---

## Test Scenario 2: Investor Flow

### Step 1: Browse Marketplace
1. Navigate to `/marketplace`
2. ✅ **Expected:** See all registered properties from blockchain
3. Try category filters (All, Residential, Commercial, etc.)
4. ✅ **Expected:** Properties update (currently all shown, filtering to be implemented)

### Step 2: View Property Details
1. Click on any property card
2. ✅ **Expected:** Property detail page loads
3. ✅ **Expected:** See property info, financials, funding progress
4. ✅ **Expected:** "Purchase Shares" button visible

### Step 3: Purchase Shares
1. Click "Purchase Shares"
2. ✅ **Expected:** Modal appears
3. Enter number of shares: `10`
4. ✅ **Expected:** Total cost calculates automatically
   - Example: 10 shares × 0.025 STX = 0.25 STX
5. ✅ **Expected:** Estimated monthly return shown
6. Click "Confirm Purchase"
7. ✅ **Expected:** Wallet popup appears
8. Confirm transaction
9. ✅ **Expected:** Success alert with TX ID
10. Wait ~10 seconds for confirmation

**✅ Success Criteria:**
- Transaction successful
- STX deducted from wallet
- Shares transferred to your address

---

## Test Scenario 3: View Portfolio

### Step 1: Navigate to Portfolio
1. Connect wallet (if not already)
2. Click address dropdown → "Portfolio"
   - Or navigate to `/portfolio`
3. ✅ **Expected:** Loading state appears briefly
4. ✅ **Expected:** Portfolio page loads with your investments

### Step 2: Verify Portfolio Data
1. Check **Stats Grid:**
   - ✅ Total Invested (sum of all purchases)
   - ✅ Current Value (with returns)
   - ✅ Total Returns (%)
   - ✅ Total Shares (across all properties)

2. Check **Investments List:**
   - ✅ All properties where you own shares
   - ✅ Shares owned (10 from previous purchase)
   - ✅ Invested amount (matches purchase)
   - ✅ Current value & returns

### Step 3: Empty State Test
1. Switch to a wallet with no investments
2. Navigate to `/portfolio`
3. ✅ **Expected:** "No Investments Yet" empty state
4. ✅ **Expected:** "Explore Properties" button

**✅ Success Criteria:**
- Portfolio shows accurate blockchain data
- Stats calculated correctly
- No mock/static data visible

---

## Test Scenario 4: Claim Payouts

### Prerequisites
**Property owner must distribute payout first.**

#### Option A: Using Clarinet Console (Testnet)
```clarity
;; As property owner
(contract-call? .property-1 distribute-payout u1 u1000000)
;; Distributes 1 STX (1000000 micro-STX) for round 1
```

#### Option B: Using Wallet (with contract call UI)
Skip this test for now if no payouts distributed yet.

---

### Step 1: Check for Claimable Payouts
1. Navigate to `/portfolio`
2. Look for green "Claimable Payout" amounts
3. ✅ **Expected:** If payout distributed, amount > 0 STX

### Step 2: Claim Payout
1. Click "Claim X.XXXX STX" button
2. ✅ **Expected:** Wallet popup appears
3. Confirm transaction
4. ✅ **Expected:** Success alert with TX ID
5. Wait ~10 seconds
6. Refresh page
7. ✅ **Expected:** Claimable amount now 0
8. ✅ **Expected:** STX balance increased in wallet

**✅ Success Criteria:**
- Payout claimed successfully
- STX received in wallet
- Claimable resets to 0

---

## Test Scenario 5: Error Handling

### Test 1: Wallet Not Connected
1. Disconnect wallet
2. Try to navigate to `/add-property`
3. Click "Submit Property to Blockchain"
4. ✅ **Expected:** "Connect Wallet First" button disabled

### Test 2: Insufficient Funds
1. Try to purchase shares worth more STX than you have
2. ✅ **Expected:** Wallet shows insufficient balance error
3. ✅ **Expected:** Transaction fails gracefully

### Test 3: Property Not Found
1. Navigate to `/marketplace/999999`
2. ✅ **Expected:** "Property not found" message
3. ✅ **Expected:** "Return to marketplace" link

### Test 4: No Properties Registered
1. Use fresh testnet deployment (no properties)
2. Navigate to `/marketplace`
3. ✅ **Expected:** Empty state with building icon
4. ✅ **Expected:** "No Properties Yet" message
5. ✅ **Expected:** "List Your Property" CTA button

---

## Browser Console Checks

### Check for Errors
Open browser DevTools (F12) → Console

✅ **Should see:**
```
Loading properties from blockchain...
Property count: 1
Fetched property: {...}
```

❌ **Should NOT see:**
```
Error: Cannot read property 'value' of undefined
Failed to fetch properties
TypeError: ...
```

### Check Network Calls
DevTools → Network tab

✅ **Should see calls to:**
```
https://api.testnet.hiro.so/v2/contracts/call-read/...
https://api.testnet.hiro.so/v2/info
```

---

## Testing Checklist

### Frontend ✅
- [x] Wallet connection works
- [x] Language switcher (EN/ES) visible
- [x] Dropdown menu appears above cards (z-index fixed)
- [x] No mock/static data anywhere
- [x] Loading states show correctly
- [x] Empty states show correctly

### Smart Contract Integration ✅
- [x] Properties load from blockchain
- [x] Register property calls smart contract
- [x] Purchase shares calls smart contract
- [x] Portfolio shows real holdings
- [x] Claim payout calls smart contract
- [x] All transactions require wallet approval

### Data Accuracy ✅
- [x] Property count matches blockchain
- [x] Share prices accurate
- [x] Available shares calculated correctly
- [x] Portfolio stats match on-chain data
- [x] Claimable amounts accurate

### User Experience ✅
- [x] All buttons functional
- [x] Modals open/close properly
- [x] Forms validate input
- [x] Success/error messages appear
- [x] Redirects work correctly

---

## Common Issues & Solutions

### Issue: "Property not found" for just-registered property
**Solution:** Wait 10-30 seconds for blockchain confirmation, then refresh

### Issue: Wallet popup doesn't appear
**Solution:**
1. Check wallet extension is unlocked
2. Clear browser cache
3. Try different wallet
4. Check browser console for errors

### Issue: "Loading properties..." never finishes
**Solution:**
1. Check `.env.local` has correct contract address
2. Verify testnet API is accessible
3. Check network tab for failed requests
4. Ensure contracts are deployed

### Issue: Portfolio shows "No Investments" but I purchased shares
**Solution:**
1. Wait for transaction confirmation (~10-30 seconds)
2. Refresh the page
3. Check wallet address is correct
4. Verify transaction succeeded on explorer

---

## Testnet Faucet

Need testnet STX?
👉 https://explorer.hiro.so/sandbox/faucet?chain=testnet

- Free testnet STX for testing
- No real value
- Unlimited requests

---

## Blockchain Explorers

### View Transactions
- **Testnet:** https://explorer.hiro.so/?chain=testnet
- Paste your transaction ID to see status

### View Contract State
```
https://explorer.hiro.so/txid/<YOUR_TX_ID>?chain=testnet
```

---

## Success! 🎉

If all tests pass, your MicroPropiedad dApp is:
- ✅ Fully blockchain-integrated
- ✅ Free of mock/static data
- ✅ Ready for testnet deployment
- ✅ Production-ready (with backend for payouts)

---

## Next: Deploy to Testnet

See `DEPLOYMENT_GUIDE.md` for step-by-step testnet deployment.

```bash
# Quick deploy
npm run deploy:testnet
# Follow prompts, get contract addresses
# Update .env.local with addresses
# Restart frontend
# Start testing!
```
