;; title: property-multi
;; version: 2.0.0
;; summary: Multi-Property Fractional Ownership Contract
;; description: Manages multiple tokenized properties with fractional ownership and automated revenue distribution

;; ============================================
;; CONSTANTS
;; ============================================

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-BALANCE (err u101))
(define-constant ERR-SALE-NOT-ACTIVE (err u102))
(define-constant ERR-INSUFFICIENT-SHARES (err u103))
(define-constant ERR-INVALID-AMOUNT (err u104))
(define-constant ERR-ALREADY-CLAIMED (err u105))
(define-constant ERR-NO-PAYOUT-AVAILABLE (err u106))
(define-constant ERR-TRANSFER-FAILED (err u107))
(define-constant ERR-PAYOUT-ROUND-EXISTS (err u109))
(define-constant ERR-PAUSED (err u110))
(define-constant ERR-PROPERTY-NOT-FOUND (err u111))
(define-constant ERR-PROPERTY-EXISTS (err u112))

;; Contract constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant DECIMALS u6)

;; ============================================
;; DATA VARIABLES
;; ============================================

(define-data-var property-counter uint u0)
(define-data-var paused bool false)

;; ============================================
;; DATA MAPS
;; ============================================

;; Property metadata
(define-map properties
  uint ;; property-id
  {
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
  }
)

;; Share balances: {property-id, holder} => balance
(define-map share-balances
  { property-id: uint, holder: principal }
  uint
)

;; Total supply per property
(define-map property-supply
  uint ;; property-id
  uint ;; total minted supply
)

;; Payout rounds: {property-id, round-id} => payout data
(define-map payout-rounds
  { property-id: uint, round: uint }
  {
    total-amount: uint,
    timestamp: uint,
    total-shares-snapshot: uint
  }
)

;; Current payout round per property
(define-map property-payout-round
  uint ;; property-id
  uint ;; current round
)

;; Claimed payouts: {property-id, round, holder} => claimed?
(define-map claimed-payouts
  { property-id: uint, round: uint, holder: principal }
  bool
)

;; ============================================
;; PUBLIC FUNCTIONS - Property Management
;; ============================================

;; Create a new property (called by factory or admin)
(define-public (create-property
  (name (string-ascii 32))
  (symbol (string-ascii 10))
  (uri (optional (string-utf8 256)))
  (total uint)
  (price-micro-stx uint)
  (min-buy uint)
  (addr (string-utf8 256))
  (owner principal)
)
  (let
    (
      (property-id (+ (var-get property-counter) u1))
    )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> total u0) ERR-INVALID-AMOUNT)
    (asserts! (> price-micro-stx u0) ERR-INVALID-AMOUNT)
    (asserts! (and (> min-buy u0) (<= min-buy total)) ERR-INVALID-AMOUNT)

    ;; Create property record
    (map-set properties property-id {
      name: name,
      symbol: symbol,
      uri: uri,
      address: addr,
      owner: owner,
      total-shares: total,
      shares-sold: u0,
      share-price-micro-stx: price-micro-stx,
      min-purchase: min-buy,
      sale-active: true,
      created-at: stacks-block-height
    })

    ;; Initialize supply
    (map-set property-supply property-id u0)

    ;; Initialize payout round
    (map-set property-payout-round property-id u0)

    ;; Increment counter
    (var-set property-counter property-id)

    (print {
      event: "property-created",
      property-id: property-id,
      name: name,
      symbol: symbol,
      total-shares: total,
      share-price: price-micro-stx,
      owner: owner
    })

    (ok property-id)
  )
)

;; Purchase shares in a property
(define-public (purchase-shares (property-id uint) (num-shares uint))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
      (buyer tx-sender)
      (price-per-share (get share-price-micro-stx property))
      (shares-sold (get shares-sold property))
      (total-shares (get total-shares property))
      (min-buy (get min-purchase property))
      (remaining-shares (- total-shares shares-sold))
      (cost (* num-shares price-per-share))
    )
    ;; Validations
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (get sale-active property) ERR-SALE-NOT-ACTIVE)
    (asserts! (> num-shares u0) ERR-INVALID-AMOUNT)
    (asserts! (>= num-shares min-buy) ERR-INVALID-AMOUNT)
    (asserts! (<= num-shares remaining-shares) ERR-INSUFFICIENT-SHARES)
    (asserts! (> cost u0) ERR-INVALID-AMOUNT)

    ;; Transfer STX from buyer to property owner
    (try! (stx-transfer? cost buyer (get owner property)))

    ;; Update buyer's balance
    (let
      (
        (current-balance (default-to u0 (map-get? share-balances { property-id: property-id, holder: buyer })))
      )
      (map-set share-balances
        { property-id: property-id, holder: buyer }
        (+ current-balance num-shares)
      )
    )

    ;; Update property stats
    (map-set properties property-id
      (merge property { shares-sold: (+ shares-sold num-shares) })
    )

    ;; Update supply
    (let
      (
        (current-supply (default-to u0 (map-get? property-supply property-id)))
      )
      (map-set property-supply property-id (+ current-supply num-shares))
    )

    (print {
      event: "purchase-shares",
      property-id: property-id,
      buyer: buyer,
      num-shares: num-shares,
      price-per-share: price-per-share,
      total-cost: cost,
      remaining-shares: (- remaining-shares num-shares)
    })

    (ok num-shares)
  )
)

;; Purchase shares in a property using sBTC
(define-public (purchase-shares-sbtc (property-id uint) (num-shares uint))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
      (buyer tx-sender)
      (price-per-share (get share-price-micro-stx property))
      (shares-sold (get shares-sold property))
      (total-shares (get total-shares property))
      (min-buy (get min-purchase property))
      (remaining-shares (- total-shares shares-sold))
      (cost (* num-shares price-per-share))
    )
    ;; Validations
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (get sale-active property) ERR-SALE-NOT-ACTIVE)
    (asserts! (> num-shares u0) ERR-INVALID-AMOUNT)
    (asserts! (>= num-shares min-buy) ERR-INVALID-AMOUNT)
    (asserts! (<= num-shares remaining-shares) ERR-INSUFFICIENT-SHARES)
    (asserts! (> cost u0) ERR-INVALID-AMOUNT)

    ;; Transfer sBTC from buyer to property owner using contract-call
    ;; Note: sBTC contract address on testnet needs to be configured
    ;; For now, using a placeholder - replace with actual sBTC contract
    (try! (contract-call?
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token
      transfer
      cost
      buyer
      (get owner property)
      none
    ))

    ;; Update buyer's balance
    (let
      (
        (current-balance (default-to u0 (map-get? share-balances { property-id: property-id, holder: buyer })))
      )
      (map-set share-balances
        { property-id: property-id, holder: buyer }
        (+ current-balance num-shares)
      )
    )

    ;; Update property stats
    (map-set properties property-id
      (merge property { shares-sold: (+ shares-sold num-shares) })
    )

    ;; Update supply
    (let
      (
        (current-supply (default-to u0 (map-get? property-supply property-id)))
      )
      (map-set property-supply property-id (+ current-supply num-shares))
    )

    (print {
      event: "purchase-shares-sbtc",
      property-id: property-id,
      buyer: buyer,
      num-shares: num-shares,
      price-per-share: price-per-share,
      total-cost: cost,
      currency: "sBTC",
      remaining-shares: (- remaining-shares num-shares)
    })

    (ok num-shares)
  )
)

;; Distribute payout to shareholders (owner only)
(define-public (distribute-payout (property-id uint) (amount uint))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
      (current-round (default-to u0 (map-get? property-payout-round property-id)))
      (new-round (+ current-round u1))
      (total-supply (default-to u0 (map-get? property-supply property-id)))
    )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-eq tx-sender (get owner property)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (> total-supply u0) ERR-INVALID-AMOUNT)

    ;; Create payout round
    (map-set payout-rounds
      { property-id: property-id, round: new-round }
      {
        total-amount: amount,
        timestamp: stacks-block-height,
        total-shares-snapshot: total-supply
      }
    )

    ;; Update current round
    (map-set property-payout-round property-id new-round)

    ;; Transfer STX from caller to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

    (print {
      event: "payout-distributed",
      property-id: property-id,
      round: new-round,
      amount: amount,
      total-shares: total-supply
    })

    (ok new-round)
  )
)

;; Claim payout for a specific round
(define-public (claim-payout (property-id uint) (round-id uint))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
      (claimer tx-sender)
      (holder-shares (default-to u0 (map-get? share-balances { property-id: property-id, holder: claimer })))
      (round-data (unwrap! (map-get? payout-rounds { property-id: property-id, round: round-id }) ERR-NO-PAYOUT-AVAILABLE))
      (total-round-amount (get total-amount round-data))
      (total-shares-snapshot (get total-shares-snapshot round-data))
      (claimer-portion (/ (* holder-shares total-round-amount) total-shares-snapshot))
    )
    ;; Validations
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> holder-shares u0) ERR-INSUFFICIENT-BALANCE)
    (asserts! (> total-shares-snapshot u0) ERR-INVALID-AMOUNT)
    (asserts! (is-none (map-get? claimed-payouts { property-id: property-id, round: round-id, holder: claimer })) ERR-ALREADY-CLAIMED)
    (asserts! (> claimer-portion u0) ERR-INVALID-AMOUNT)

    ;; Mark as claimed
    (map-set claimed-payouts
      { property-id: property-id, round: round-id, holder: claimer }
      true
    )

    ;; Transfer STX from contract to claimer
    (try! (as-contract (stx-transfer? claimer-portion tx-sender claimer)))

    (print {
      event: "payout-claimed",
      property-id: property-id,
      round: round-id,
      claimer: claimer,
      amount: claimer-portion,
      shares: holder-shares
    })

    (ok claimer-portion)
  )
)

;; Transfer shares (like SIP-010 transfer)
(define-public (transfer-shares (property-id uint) (amount uint) (sender principal) (recipient principal))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
      (sender-balance (default-to u0 (map-get? share-balances { property-id: property-id, holder: sender })))
      (recipient-balance (default-to u0 (map-get? share-balances { property-id: property-id, holder: recipient })))
    )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (>= sender-balance amount) ERR-INSUFFICIENT-BALANCE)

    ;; Update balances
    (map-set share-balances
      { property-id: property-id, holder: sender }
      (- sender-balance amount)
    )
    (map-set share-balances
      { property-id: property-id, holder: recipient }
      (+ recipient-balance amount)
    )

    (print {
      event: "shares-transferred",
      property-id: property-id,
      from: sender,
      to: recipient,
      amount: amount
    })

    (ok true)
  )
)

;; Update sale status (owner only)
(define-public (set-sale-active (property-id uint) (active bool))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get owner property)) ERR-NOT-AUTHORIZED)

    (map-set properties property-id
      (merge property { sale-active: active })
    )

    (print { event: "sale-status-changed", property-id: property-id, active: active })
    (ok true)
  )
)

;; ============================================
;; ADMIN FUNCTIONS
;; ============================================

(define-public (set-paused (pause bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set paused pause)
    (print { event: "contract-paused", paused: pause })
    (ok true)
  )
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

;; Get property details
(define-read-only (get-property (property-id uint))
  (ok (map-get? properties property-id))
)

;; Get share balance
(define-read-only (get-balance (property-id uint) (holder principal))
  (ok (default-to u0 (map-get? share-balances { property-id: property-id, holder: holder })))
)

;; Get total supply for a property
(define-read-only (get-total-supply (property-id uint))
  (ok (default-to u0 (map-get? property-supply property-id)))
)

;; Get shares sold for a property
(define-read-only (get-shares-sold (property-id uint))
  (match (map-get? properties property-id)
    property (ok (get shares-sold property))
    (ok u0)
  )
)

;; Get share price
(define-read-only (get-share-price (property-id uint))
  (match (map-get? properties property-id)
    property (ok (get share-price-micro-stx property))
    (ok u0)
  )
)

;; Get current payout round
(define-read-only (get-current-round (property-id uint))
  (ok (default-to u0 (map-get? property-payout-round property-id)))
)

;; Get payout round data
(define-read-only (get-payout-round (property-id uint) (round-id uint))
  (ok (map-get? payout-rounds { property-id: property-id, round: round-id }))
)

;; Check if payout was claimed
(define-read-only (has-claimed (property-id uint) (round-id uint) (holder principal))
  (ok (default-to false (map-get? claimed-payouts { property-id: property-id, round: round-id, holder: holder })))
)

;; Calculate claimable amount
(define-read-only (calculate-claimable (property-id uint) (round-id uint) (holder principal))
  (let
    (
      (holder-shares (default-to u0 (map-get? share-balances { property-id: property-id, holder: holder })))
      (already-claimed (default-to false (map-get? claimed-payouts { property-id: property-id, round: round-id, holder: holder })))
    )
    (match (map-get? payout-rounds { property-id: property-id, round: round-id })
      round-data
        (let
          (
            (total-amount (get total-amount round-data))
            (total-shares (get total-shares-snapshot round-data))
            (claimable (if (and (> holder-shares u0) (> total-shares u0))
              (/ (* holder-shares total-amount) total-shares)
              u0
            ))
          )
          (ok {
            shares: holder-shares,
            claimable: claimable,
            already-claimed: already-claimed
          })
        )
      (ok {
        shares: u0,
        claimable: u0,
        already-claimed: false
      })
    )
  )
)

;; Get property count
(define-read-only (get-property-count)
  (ok (var-get property-counter))
)

;; Get property info (comprehensive)
(define-read-only (get-property-info (property-id uint))
  (map-get? properties property-id)
)
