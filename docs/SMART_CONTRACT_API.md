# Smart Contract API Documentation

## Overview

MicroPropiedad uses two main smart contracts deployed on Stacks testnet:

- **property-multi.clar**: Multi-property management contract
- **property-factory-v2.clar**: Property creation and registration

**Deployed Address**: `STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ`

---

## property-multi.clar

### Public Functions

#### create-property

Creates a new property in the system.

**Signature:**
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

**Parameters:**
- `name`: Property name (max 32 characters)
- `symbol`: Token symbol (max 10 characters)
- `uri`: Optional IPFS metadata URI
- `total`: Total number of shares
- `price-micro-stx`: Price per share in micro-STX (1 STX = 1,000,000 micro-STX)
- `min-buy`: Minimum shares per purchase
- `addr`: Physical property address
- `owner`: Property owner principal

**Returns:** `(ok property-id)`

**Authorization:** Only CONTRACT-OWNER

---

#### purchase-shares

Purchase shares in a property using STX.

**Signature:**
```clarity
(define-public (purchase-shares
  (property-id uint)
  (num-shares uint)
))
```

**Parameters:**
- `property-id`: Unique property identifier
- `num-shares`: Number of shares to purchase

**Returns:** `(ok num-shares)`

**Validations:**
- Contract not paused
- Sale active for property
- `num-shares` >= minimum purchase
- `num-shares` <= remaining shares
- Sufficient STX balance

**STX Transfer:** `num-shares * share-price-micro-stx` from buyer to property owner

---

#### purchase-shares-sbtc

Purchase shares in a property using sBTC.

**Signature:**
```clarity
(define-public (purchase-shares-sbtc
  (property-id uint)
  (num-shares uint)
))
```

**Parameters:**
- `property-id`: Unique property identifier
- `num-shares`: Number of shares to purchase

**Returns:** `(ok num-shares)`

**Validations:** Same as `purchase-shares`

**sBTC Transfer:** `num-shares * share-price-micro-stx` equivalent in sBTC from buyer to property owner

---

#### distribute-payout

Distribute rental income to shareholders (owner only).

**Signature:**
```clarity
(define-public (distribute-payout
  (property-id uint)
  (amount uint)
))
```

**Parameters:**
- `property-id`: Property to distribute payout for
- `amount`: Total payout amount in micro-STX

**Returns:** `(ok round-id)`

**Authorization:** Property owner only

**Effect:** Creates a new payout round that shareholders can claim from

---

#### claim-payout

Claim proportional payout for a specific round.

**Signature:**
```clarity
(define-public (claim-payout
  (property-id uint)
  (round-id uint)
))
```

**Parameters:**
- `property-id`: Property ID
- `round-id`: Payout round to claim from

**Returns:** `(ok amount-claimed)`

**Validations:**
- User holds shares
- Round exists
- Not already claimed
- Claimable amount > 0

**Calculation:** `(user-shares / total-shares) * round-amount`

---

#### transfer-shares

Transfer shares to another principal.

**Signature:**
```clarity
(define-public (transfer-shares
  (property-id uint)
  (amount uint)
  (sender principal)
  (recipient principal)
))
```

**Parameters:**
- `property-id`: Property ID
- `amount`: Number of shares to transfer
- `sender`: Sender principal (must be tx-sender)
- `recipient`: Recipient principal

**Returns:** `(ok true)`

---

#### set-sale-active

Enable/disable property sale (owner only).

**Signature:**
```clarity
(define-public (set-sale-active
  (property-id uint)
  (active bool)
))
```

**Parameters:**
- `property-id`: Property ID
- `active`: true to enable sales, false to disable

**Returns:** `(ok true)`

**Authorization:** Property owner only

---

### Read-Only Functions

#### get-property

Get property details.

**Signature:**
```clarity
(define-read-only (get-property (property-id uint)))
```

**Returns:**
```clarity
(optional {
  name: (string-ascii 32),
  symbol: (string-ascii 10),
  uri: (optional (string-utf8 256)),
  address: (string-utf8 256),
  owner: principal,
  total-shares: uint,
  shares-sold: uint,
  share-price-micro-stx: uint,
  min-purchase: uint,
  sale-active: bool,
  created-at: uint
})
```

---

#### get-balance

Get share balance for a holder.

**Signature:**
```clarity
(define-read-only (get-balance
  (property-id uint)
  (holder principal)
))
```

**Returns:** `(ok uint)` - number of shares held

---

#### get-total-supply

Get total minted supply for a property.

**Signature:**
```clarity
(define-read-only (get-total-supply (property-id uint)))
```

**Returns:** `(ok uint)`

---

#### get-shares-sold

Get number of shares sold for a property.

**Signature:**
```clarity
(define-read-only (get-shares-sold (property-id uint)))
```

**Returns:** `(ok uint)`

---

#### get-current-round

Get current payout round for a property.

**Signature:**
```clarity
(define-read-only (get-current-round (property-id uint)))
```

**Returns:** `(ok uint)` - round ID (0 if no payouts yet)

---

#### calculate-claimable

Calculate claimable amount for a holder in a specific round.

**Signature:**
```clarity
(define-read-only (calculate-claimable
  (property-id uint)
  (round-id uint)
  (holder principal)
))
```

**Returns:**
```clarity
(ok {
  shares: uint,
  claimable: uint,
  already-claimed: bool
})
```

---

#### get-property-count

Get total number of properties created.

**Signature:**
```clarity
(define-read-only (get-property-count))
```

**Returns:** `(ok uint)`

---

## property-factory-v2.clar

### Public Functions

#### register-property

Register a new property (calls property-multi.create-property).

**Signature:**
```clarity
(define-public (register-property
  (name (string-ascii 32))
  (symbol (string-ascii 10))
  (total-shares uint)
  (share-price uint)
  (min-purchase uint)
  (location (string-utf8 256))
  (metadata-uri (string-utf8 256))
))
```

**Parameters:**
- `name`: Property name
- `symbol`: Token symbol
- `total-shares`: Total shares to create
- `share-price`: Price per share in micro-STX
- `min-purchase`: Minimum shares per purchase
- `location`: Property location
- `metadata-uri`: IPFS URI with full metadata

**Returns:** `(ok property-id)`

**Effect:**
1. Calls `property-multi.create-property`
2. Registers property in factory
3. Stores metadata URI mapping

---

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| 100 | ERR-NOT-AUTHORIZED | Caller not authorized |
| 101 | ERR-INSUFFICIENT-BALANCE | Insufficient share balance |
| 102 | ERR-SALE-NOT-ACTIVE | Sale not active |
| 103 | ERR-INSUFFICIENT-SHARES | Not enough shares available |
| 104 | ERR-INVALID-AMOUNT | Invalid amount specified |
| 105 | ERR-ALREADY-CLAIMED | Payout already claimed |
| 106 | ERR-NO-PAYOUT-AVAILABLE | No payout for round |
| 109 | ERR-PAYOUT-ROUND-EXISTS | Round already exists |
| 110 | ERR-PAUSED | Contract paused |
| 111 | ERR-PROPERTY-NOT-FOUND | Property doesn't exist |
| 112 | ERR-PROPERTY-EXISTS | Property already exists |

---

## Events

All functions emit print events for indexing:

### property-created
```clarity
{
  event: "property-created",
  property-id: uint,
  name: (string-ascii 32),
  symbol: (string-ascii 10),
  total-shares: uint,
  share-price: uint,
  owner: principal
}
```

### purchase-shares
```clarity
{
  event: "purchase-shares",
  property-id: uint,
  buyer: principal,
  num-shares: uint,
  price-per-share: uint,
  total-cost: uint,
  remaining-shares: uint
}
```

### payout-distributed
```clarity
{
  event: "payout-distributed",
  property-id: uint,
  round: uint,
  amount: uint,
  total-shares: uint
}
```

### payout-claimed
```clarity
{
  event: "payout-claimed",
  property-id: uint,
  round: uint,
  claimer: principal,
  amount: uint,
  shares: uint
}
```

---

## Usage Examples

### Frontend Integration (TypeScript)

```typescript
import { openContractCall, uintCV } from '@stacks/connect';

// Purchase shares
const purchaseShares = async (propertyId: number, numShares: number) => {
  await openContractCall({
    contractAddress: 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ',
    contractName: 'property-multi',
    functionName: 'purchase-shares',
    functionArgs: [uintCV(propertyId), uintCV(numShares)],
    network: testnet,
    onFinish: (data) => console.log(data.txId),
  });
};

// Claim payout
const claimPayout = async (propertyId: number, roundId: number) => {
  await openContractCall({
    contractAddress: 'STHB9AQQT64FPZ88FT18HKNGV2TK0EM4JDT111SQ',
    contractName: 'property-multi',
    functionName: 'claim-payout',
    functionArgs: [uintCV(propertyId), uintCV(roundId)],
    network: testnet,
    onFinish: (data) => console.log('Claimed:', data.txId),
  });
};
```

---

## Gas Costs (Testnet Estimates)

| Function | Estimated Gas |
|----------|---------------|
| create-property | ~15,000 |
| purchase-shares | ~8,000 |
| distribute-payout | ~10,000 |
| claim-payout | ~7,000 |
| transfer-shares | ~6,000 |

---

## Testing

```bash
cd contracts
clarinet test
```

See `contracts/tests/` for comprehensive test suite.
