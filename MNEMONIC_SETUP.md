# 🔑 Mnemonic Setup for Testnet Deployment

## Option 1: Use Existing Wallet (Recommended)

If you already have a Stacks wallet with testnet STX:

### 1. Export Your Secret Key (Mnemonic)

#### Hiro Wallet:
1. Open Hiro Wallet extension
2. Click Settings (⚙️)
3. Click "View Secret Key"
4. Enter your password
5. Copy the 12 or 24-word phrase

#### Leather Wallet:
1. Open Leather extension
2. Click Settings
3. Click "Backup Secret Key"
4. Enter password
5. Copy the 12 or 24-word phrase

### 2. Update Testnet.toml

```bash
# Edit the file
nano contracts/settings/Testnet.toml
```

Replace:
```toml
mnemonic = "<YOUR PRIVATE TESTNET MNEMONIC HERE>"
```

With your actual mnemonic:
```toml
mnemonic = "your twelve or twenty four word mnemonic phrase goes here in quotes"
```

**⚠️ IMPORTANT:** Never commit this file to Git! It contains your private key.

---

## Option 2: Generate New Testnet Wallet

If you don't have a wallet or want a fresh one:

### Using Clarinet CLI

```bash
# Generate a new mnemonic
clarinet integrate

# This creates a new wallet and shows the mnemonic
# Copy the mnemonic phrase
```

### Using Online Tool (Testnet Only!)

🔗 https://iancoleman.io/bip39/

1. Select "12 words" or "24 words"
2. Click "Generate"
3. Copy the mnemonic phrase
4. Paste into `contracts/settings/Testnet.toml`

**⚠️ WARNING:** Only use generated mnemonics for TESTNET! Never for mainnet with real funds.

---

## After Setting Mnemonic

### 1. Get Your Testnet Address

```bash
cd contracts
clarinet deployments generate --testnet
```

This shows your deployer address.

### 2. Fund Your Address

Get free testnet STX:
👉 https://explorer.hiro.so/sandbox/faucet?chain=testnet

1. Paste your deployer address
2. Click "Request STX"
3. Wait 1-2 minutes

### 3. Verify Balance

Check your balance:
👉 https://explorer.hiro.so/address/[YOUR_ADDRESS]?chain=testnet

You should see 500+ STX for testnet.

### 4. Deploy!

```bash
npm run deploy:testnet
```

---

## Security Best Practices

### ✅ DO:
- Use different mnemonics for testnet vs mainnet
- Keep your mainnet mnemonic extremely secure
- Add `Testnet.toml` to `.gitignore`
- Use hardware wallet for mainnet

### ❌ DON'T:
- Never commit mnemonics to Git
- Never share your mnemonic
- Never use testnet mnemonic for mainnet
- Never use same mnemonic across projects

---

## Troubleshooting

### "Invalid mnemonic" error
- Check word count (must be 12, 15, 18, 21, or 24)
- Check for typos
- Ensure quotes around mnemonic
- No extra spaces

### "Insufficient funds" error
- Get testnet STX from faucet
- Wait 1-2 minutes after faucet request
- Verify balance in explorer

### "Nonce error"
- Wait a few minutes
- Try again
- Check if previous deployment is still pending

---

## Quick Setup Script

```bash
# 1. Check if you have testnet STX
echo "Your deployer address will be shown when you run:"
cd contracts && clarinet deployments generate --testnet

# 2. Get testnet STX from faucet
# Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet

# 3. Update mnemonic in contracts/settings/Testnet.toml

# 4. Deploy
npm run deploy:testnet
```

---

## Example Testnet.toml (Correct Format)

```toml
[network]
name = "testnet"
stacks_node_rpc_address = "https://api.testnet.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
# ⚠️ This is a well-known test mnemonic - DO NOT USE for real funds!
```

---

## Need Help?

If you're still having issues:
1. Check mnemonic word count
2. Ensure proper quotes
3. Verify testnet STX balance
4. Check Clarinet version: `clarinet --version` (should be 3.8.1+)
