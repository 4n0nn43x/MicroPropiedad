# MicroPropiedad BTC - Architecture Documentation

## 🏗 System Overview

MicroPropiedad is a decentralized platform for fractional real estate ownership built on Stacks blockchain, leveraging Bitcoin's security through sBTC.

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Investors  │  Property Owners  │  Oracles  │  Platform Admin│
└──────┬───────────────┬──────────────┬────────────────┬──────┘
       │               │              │                │
       v               v              v                v
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js dApp)                   │
│  - Wallet Integration (Xverse, Leather, Hiro)               │
│  - Property Marketplace                                      │
│  - Investor Dashboard                                        │
│  - i18n (EN/ES)                                             │
└──────┬──────────────────────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js API)                     │
│  - Event Indexing                                           │
│  - Oracle Service (Revenue Verification)                     │
│  - Off-chain Data (KYC, Documents)                          │
│  - Analytics & Reporting                                     │
└──────┬──────────────────────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────────────────────┐
│              STACKS BLOCKCHAIN LAYER                         │
│                                                              │
│  ┌──────────────────┐         ┌───────────────────┐        │
│  │ PropertyFactory  │◄────────┤  Property (1..N)  │        │
│  │                  │         │                   │        │
│  │  - Registry      │         │  - SIP-010 Token  │        │
│  │  - Metadata      │         │  - Fractional     │        │
│  │  - Statistics    │         │  - Payouts        │        │
│  └──────────────────┘         │  - Governance     │        │
│                                └───────────────────┘        │
│                                                              │
│  ┌──────────────────┐                                       │
│  │  sip010-ft-trait │ ◄── Standard Interface                │
│  └──────────────────┘                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Smart Contract Architecture

### 1. **sip010-ft-trait.clar**

**Purpose**: Defines the SIP-010 fungible token standard interface.

**Key Functions**:
- `transfer`: Transfer tokens between addresses
- `get-name`: Get token name
- `get-symbol`: Get token symbol
- `get-decimals`: Get number of decimals
- `get-balance`: Get balance for an account
- `get-total-supply`: Get total token supply
- `get-token-uri`: Get metadata URI

**Standard Compliance**: Based on [SIP-010 specification](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)

---

### 2. **property.clar**

**Purpose**: Core contract for individual tokenized properties. Each property has its own instance.

#### **Data Structures**

```clarity
;; Property Metadata
- property-name: string-ascii 32
- property-symbol: string-ascii 10
- property-uri: optional string-utf8 256
- property-address: string-utf8 256

;; Tokenomics
- total-shares: uint (total fractional tokens)
- shares-sold: uint (tokens sold so far)
- share-price-micro-stx: uint (price per share in micro-STX)
- min-purchase: uint (minimum shares per purchase)

;; Status
- sale-active: bool
- paused: bool (emergency circuit breaker)

;; Revenue Distribution
- payout-rounds: map (round => {total-amount, timestamp, total-shares-snapshot})
- claimed-payouts: map ({round, holder} => bool)
```

#### **Key Functions**

**Initialization**
```clarity
(initialize name symbol uri total price min-buy addr)
```
- Called once by deployer
- Sets property metadata and tokenomics
- Can only be called once (total-shares must be 0)

**Purchase Shares**
```clarity
(purchase-shares num-shares)
```
- Allows investors to buy fractional ownership
- Transfers STX from buyer to contract
- Mints property-share tokens to buyer
- Requires `sale-active = true`
- Checks remaining shares availability

**Distribute Payout** 🔑 (Oracle-only)
```clarity
(distribute-payout amount)
```
- Records a new revenue distribution round
- Only callable by authorized oracle
- Creates snapshot of total shares at time of distribution
- Emits event for frontend indexing

**Claim Payout** 🔑 (Pull Pattern)
```clarity
(claim-payout round-id)
```
- Investors claim their share of revenue for a specific round
- Calculates: `(holder-shares * total-round-amount) / total-shares-snapshot`
- Transfers STX from contract to claimer
- Prevents double-claiming via `claimed-payouts` map

**Admin Functions**
- `set-sale-active`: Enable/disable share sales
- `set-paused`: Emergency pause (stops transfers & claims)
- `set-authorized-oracle`: Update oracle principal
- `withdraw-stx`: Emergency STX withdrawal

**Read-Only Functions**
- `get-property-info`: All metadata + status
- `get-payout-round`: Details of a payout round
- `has-claimed`: Check if user claimed a round
- `calculate-claimable`: Calculate claimable amount for holder in round
- `get-current-round`: Current payout round number

#### **Security Features**

✅ **Pull-over-Push Pattern**: Claims avoid gas-expensive loops
✅ **Circuit Breaker**: Pause functionality for emergencies
✅ **Oracle Whitelist**: Only authorized oracle can distribute payouts
✅ **Single Initialization**: Prevents re-initialization attacks
✅ **Snapshot Mechanism**: Fair distribution based on holdings at payout time

---

### 3. **property-factory.clar**

**Purpose**: Central registry for all tokenized properties on the platform.

#### **Data Structures**

```clarity
;; Property Registry
properties: map (property-id => {
  contract-address: principal,
  name: string-ascii 32,
  symbol: string-ascii 10,
  owner: principal,
  total-shares: uint,
  created-at: uint,
  status: string-ascii 20,
  location: string-utf8 256
})

;; Reverse Lookup
contract-to-id: map (principal => property-id)

;; Owner Tracking
owner-properties: map (principal => list of property-ids)

;; Metadata & Stats
property-metadata-uris: map (property-id => IPFS URI)
property-stats: map (property-id => {total-raised, total-investors, last-payout})
```

#### **Key Functions**

**Register Property**
```clarity
(register-property contract-addr name symbol total-shares location metadata-uri)
```
- Registers a deployed property contract
- Assigns unique property-id
- Stores metadata and creates mappings
- Emits registration event

**Update Property Status**
```clarity
(update-property-status property-id new-status)
```
- Updates status: "active", "sold-out", "paused"
- Only property owner can update

**Update Property Stats**
```clarity
(update-property-stats property-id total-raised total-investors last-payout)
```
- Updates aggregated statistics
- Used by backend/oracle

**Read-Only Functions**
- `get-property`: Get property details by ID
- `get-property-id-by-contract`: Reverse lookup
- `get-property-metadata`: Get IPFS URI
- `get-property-stats`: Get statistics
- `get-owner-properties`: List properties by owner
- `get-property-count`: Total registered properties
- `get-properties-batch`: Batch query (up to 20)

---

## 🔄 System Flows

### Flow 1: Property Tokenization

```
1. Property Owner deploys Property contract
   ├─> Calls property.initialize(...)
   └─> Sets metadata, total shares, price

2. Owner registers property in Factory
   ├─> Calls factory.register-property(...)
   └─> Gets property-id

3. Owner activates sale
   └─> Calls property.set-sale-active(true)

4. Property appears in marketplace
   └─> Frontend queries factory.get-properties-batch()
```

### Flow 2: Investment (Share Purchase)

```
1. Investor browses marketplace
   └─> Frontend reads property data

2. Investor decides to invest
   ├─> Connects wallet (Xverse/Leather/Hiro)
   └─> Selects num-shares to buy

3. Frontend prepares transaction
   └─> Calls property.purchase-shares(num-shares)

4. Transaction execution
   ├─> STX transferred: investor → property contract
   ├─> Tokens minted: property-share → investor
   └─> Event emitted: "purchase-shares"

5. Backend indexes event
   └─> Updates property stats in factory
```

### Flow 3: Revenue Distribution (Pull Pattern) 🔑

```
1. Real-world rent collected
   └─> Landlord deposits to multisig wallet

2. Oracle verifies deposit
   ├─> Checks multisig transaction
   ├─> Validates amount
   └─> Signs attestation

3. Oracle calls distribute-payout
   ├─> property.distribute-payout(amount)
   ├─> Creates payout round
   ├─> Snapshots total shares
   └─> Event emitted: "payout-distributed"

4. Frontend notifies investors
   └─> "You have claimable revenue!"

5. Investor claims payout
   ├─> property.claim-payout(round-id)
   ├─> Contract calculates share: (holder-shares * amount) / total-shares
   ├─> STX transferred: property contract → investor
   └─> Event emitted: "payout-claimed"

6. Backend indexes claims
   └─> Updates stats & analytics
```

### Flow 4: Secondary Market (Future)

```
1. Holder lists shares for sale
   └─> marketplace.create-order(property-id, num-shares, price)

2. Buyer purchases shares
   ├─> marketplace.execute-order(order-id)
   ├─> STX transferred: buyer → seller
   └─> Shares transferred: property.transfer(...)

3. Transaction recorded
   └─> Events indexed by backend
```

---

## 🔐 Security Model

### Smart Contract Security

1. **Access Control**
   - Owner-only functions (pause, oracle update)
   - Oracle-only functions (distribute-payout)
   - Proper authorization checks

2. **Pull-over-Push Pattern**
   - Investors claim payouts (avoids reentrancy)
   - Scalable to thousands of holders

3. **Circuit Breakers**
   - Emergency pause functionality
   - Stops critical operations if compromised

4. **Input Validation**
   - Amount checks (> 0)
   - Share availability checks
   - Double-claim prevention

5. **Snapshot Mechanism**
   - Fair distribution based on holdings at payout time
   - Prevents gaming via quick transfers

### Oracle Security

1. **Whitelisting**
   - Only authorized oracle can distribute
   - Owner can rotate oracle key

2. **Off-chain Verification**
   - Oracle verifies real tx-id
   - Multisig wallet for transparency

3. **Attestation Signing**
   - Cryptographic proof of revenue
   - Prevents unauthorized distributions

---

## 💾 Data Flow

### On-Chain Data
- Property ownership (balances)
- Revenue distribution rounds
- Claimed status
- Property metadata (references)
- Registry information

### Off-Chain Data (Backend)
- Full property documents (PDFs, images)
- KYC/AML information (encrypted)
- Transaction history (indexed from events)
- Analytics & reporting
- User profiles

### IPFS/Arweave
- Property metadata JSON
- Legal documents
- Property images
- Audit reports

---

## 🎯 MVP vs Production

### MVP (Hackathon)
- ✅ Single property demo
- ✅ Simulated payout distribution
- ✅ Basic frontend (read + purchase)
- ✅ Testnet deployment
- ✅ Centralized oracle (demo)

### Production Ready
- 🔲 Multi-property marketplace
- 🔲 Real multisig wallet integration
- 🔲 Decentralized oracle network
- 🔲 KYC/AML integration
- 🔲 Legal SPV structure
- 🔲 Security audits
- 🔲 Mainnet deployment
- 🔲 Secondary market (AMM or orderbook)

---

## 📊 Technical Specifications

### Token Economics
- **Total Shares per Property**: 1000 (configurable)
- **Min Purchase**: 1 share (configurable)
- **Decimals**: 6 (micro-units)
- **Currency**: STX (sBTC integration in v2)

### Network
- **Blockchain**: Stacks (Bitcoin L2)
- **Standard**: SIP-010 (Fungible Token)
- **Network**: Testnet (MVP) → Mainnet (Production)
- **Clarity Version**: 3

### Platform Fees
- **Tokenization Fee**: 2.5% (250 basis points)
- **Transaction Fee**: 1% (future)
- **Performance Fee**: 2% of revenue (future)

---

## 🔗 Contract Interactions

```
Frontend
   │
   ├──► factory.get-properties-batch() [read]
   │
   ├──► property.get-property-info() [read]
   │
   ├──► property.purchase-shares() [write]
   │
   └──► property.claim-payout() [write]

Oracle
   │
   └──► property.distribute-payout() [write]

Backend
   │
   ├──► Index Events [listen]
   │
   └──► factory.update-property-stats() [write]
```

---

## 📚 Further Reading

- [SIP-010 Specification](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://book.clarity-lang.org)
- [sBTC Documentation](https://docs.stacks.co/concepts/sbtc)

---

## 🆘 Support

For questions or issues:
- [GitHub Issues](https://github.com/yourusername/micropropiedad-btc/issues)
- [Discord Community](#)
- [Documentation](https://docs.micropropiedad.btc)
