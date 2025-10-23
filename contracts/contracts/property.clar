;; title: property
;; version: 1.0.0
;; summary: Fractional Property Ownership Token Contract
;; description: Manages fractional ownership of real estate properties with automated revenue distribution

;; ============================================
;; TRAITS
;; ============================================

(impl-trait .sip010-ft-trait.sip010-ft-trait)

;; ============================================
;; TOKEN DEFINITIONS
;; ============================================

(define-fungible-token property-share)

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
(define-constant ERR-INVALID-ORACLE (err u108))
(define-constant ERR-PAYOUT-ROUND-EXISTS (err u109))
(define-constant ERR-PAUSED (err u110))

;; Contract constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant DECIMALS u6) ;; 6 decimals for micro-units

;; ============================================
;; DATA VARIABLES
;; ============================================

;; Property metadata
(define-data-var property-name (string-ascii 32) "")
(define-data-var property-symbol (string-ascii 10) "")
(define-data-var property-uri (optional (string-utf8 256)) none)
(define-data-var property-address (string-utf8 256) u"")

;; Tokenomics
(define-data-var total-shares uint u0)
(define-data-var shares-sold uint u0)
(define-data-var share-price-micro-stx uint u0) ;; Price per share in micro-STX
(define-data-var min-purchase uint u1) ;; Minimum shares per purchase

;; Sale status
(define-data-var sale-active bool false)
(define-data-var paused bool false)

;; Oracle management
(define-data-var authorized-oracle principal CONTRACT-OWNER)

;; Revenue distribution
(define-data-var current-payout-round uint u0)

;; ============================================
;; DATA MAPS
;; ============================================

;; Payout rounds: round-id => total amount available for that round
(define-map payout-rounds
  uint
  {
    total-amount: uint,
    timestamp: uint,
    total-shares-snapshot: uint
  }
)

;; Claimed status: (round-id, principal) => bool
(define-map claimed-payouts
  { round: uint, holder: principal }
  bool
)

;; ============================================
;; SIP-010 IMPLEMENTATION
;; ============================================

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (try! (ft-transfer? property-share amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; Get token name
(define-read-only (get-name)
  (ok (var-get property-name))
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok (var-get property-symbol))
)

;; Get decimals
(define-read-only (get-decimals)
  (ok DECIMALS)
)

;; Get balance of a principal
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance property-share account))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply property-share))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get property-uri))
)

;; ============================================
;; PROPERTY-SPECIFIC PUBLIC FUNCTIONS
;; ============================================

;; Initialize property (called once by factory or owner)
(define-public (initialize
  (name (string-ascii 32))
  (symbol (string-ascii 10))
  (uri (optional (string-utf8 256)))
  (total uint)
  (price-micro-stx uint)
  (min-buy uint)
  (addr (string-utf8 256))
)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (var-get total-shares) u0) ERR-NOT-AUTHORIZED) ;; Can only init once
    (asserts! (> total u0) ERR-INVALID-AMOUNT)
    (asserts! (> price-micro-stx u0) ERR-INVALID-AMOUNT)
    (asserts! (and (> min-buy u0) (<= min-buy total)) ERR-INVALID-AMOUNT) ;; min-buy must be 1+ and <= total

    (var-set property-name name)
    (var-set property-symbol symbol)
    (var-set property-uri uri)
    (var-set total-shares total)
    (var-set share-price-micro-stx price-micro-stx)
    (var-set min-purchase min-buy)
    (var-set property-address addr)

    (print {
      event: "property-initialized",
      name: name,
      symbol: symbol,
      total-shares: total,
      share-price: price-micro-stx,
      min-purchase: min-buy
    })

    (ok true)
  )
)

;; Purchase shares during initial sale
(define-public (purchase-shares (num-shares uint))
  (let
    (
      (buyer tx-sender)
      (price-per-share (var-get share-price-micro-stx))
      (remaining-shares (- (var-get total-shares) (var-get shares-sold)))
      (min-buy (var-get min-purchase))
      (cost (* num-shares price-per-share))
    )
    ;; Validations
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (var-get sale-active) ERR-SALE-NOT-ACTIVE)
    (asserts! (> num-shares u0) ERR-INVALID-AMOUNT)
    (asserts! (>= num-shares min-buy) ERR-INVALID-AMOUNT) ;; Respect minimum purchase
    (asserts! (<= num-shares remaining-shares) ERR-INSUFFICIENT-SHARES)
    (asserts! (> cost u0) ERR-INVALID-AMOUNT) ;; Ensure cost is positive

    ;; Transfer STX from buyer to contract
    (try! (stx-transfer? cost buyer (as-contract tx-sender)))

    ;; Mint shares to buyer
    (try! (ft-mint? property-share num-shares buyer))

    ;; Update shares sold
    (var-set shares-sold (+ (var-get shares-sold) num-shares))

    (print {
      event: "purchase-shares",
      buyer: buyer,
      num-shares: num-shares,
      price-per-share: price-per-share,
      total-cost: cost,
      remaining-shares: (- remaining-shares num-shares)
    })

    (ok num-shares)
  )
)

;; Distribute revenue (called by authorized oracle)
;; Records a new payout round with total amount
(define-public (distribute-payout (amount uint))
  (let
    (
      (round-id (+ (var-get current-payout-round) u1))
      (supply (ft-get-supply property-share))
    )
    (asserts! (is-eq tx-sender (var-get authorized-oracle)) ERR-INVALID-ORACLE)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (is-none (map-get? payout-rounds round-id)) ERR-PAYOUT-ROUND-EXISTS)

    ;; Record the payout round
    (map-set payout-rounds round-id {
      total-amount: amount,
      timestamp: stacks-block-height,
      total-shares-snapshot: supply
    })

    (var-set current-payout-round round-id)

    (print {
      event: "payout-distributed",
      round: round-id,
      total-amount: amount,
      total-shares: supply
    })

    (ok round-id)
  )
)

;; Claim payout for a specific round (pull pattern)
(define-public (claim-payout (round-id uint))
  (let
    (
      (claimer tx-sender)
      (holder-shares (ft-get-balance property-share claimer))
      (round-data (unwrap! (map-get? payout-rounds round-id) ERR-NO-PAYOUT-AVAILABLE))
      (total-round-amount (get total-amount round-data))
      (total-shares-snapshot (get total-shares-snapshot round-data))
      ;; Precise proportional calculation: (shares * amount) / total_shares
      (claimer-portion (/ (* holder-shares total-round-amount) total-shares-snapshot))
    )
    ;; Validations
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> holder-shares u0) ERR-INSUFFICIENT-BALANCE)
    (asserts! (> total-shares-snapshot u0) ERR-INVALID-AMOUNT) ;; Prevent division by zero
    (asserts! (is-none (map-get? claimed-payouts { round: round-id, holder: claimer })) ERR-ALREADY-CLAIMED)
    (asserts! (> claimer-portion u0) ERR-INVALID-AMOUNT) ;; Ensure claimable amount > 0

    ;; Mark as claimed BEFORE transfer (checks-effects-interactions pattern)
    (map-set claimed-payouts { round: round-id, holder: claimer } true)

    ;; Transfer STX from contract to claimer
    (try! (as-contract (stx-transfer? claimer-portion tx-sender claimer)))

    (print {
      event: "payout-claimed",
      round: round-id,
      claimer: claimer,
      amount: claimer-portion,
      shares: holder-shares,
      total-shares: total-shares-snapshot,
      percentage: (/ (* holder-shares u10000) total-shares-snapshot) ;; Basis points
    })

    (ok claimer-portion)
  )
)

;; ============================================
;; ADMIN FUNCTIONS
;; ============================================

;; Activate/deactivate sale
(define-public (set-sale-active (active bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set sale-active active)
    (print { event: "sale-status-changed", active: active })
    (ok true)
  )
)

;; Update minimum purchase amount (owner can adjust dynamically)
(define-public (set-min-purchase (new-min uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> new-min u0) ERR-INVALID-AMOUNT)
    (asserts! (<= new-min (var-get total-shares)) ERR-INVALID-AMOUNT)
    (var-set min-purchase new-min)
    (print { event: "min-purchase-updated", min-purchase: new-min })
    (ok true)
  )
)

;; Pause/unpause contract (emergency)
(define-public (set-paused (pause bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set paused pause)
    (print { event: "pause-status-changed", paused: pause })
    (ok true)
  )
)

;; Update authorized oracle
(define-public (set-authorized-oracle (new-oracle principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set authorized-oracle new-oracle)
    (print { event: "oracle-updated", oracle: new-oracle })
    (ok true)
  )
)

;; Withdraw STX from contract (only unsold shares value or for emergencies)
(define-public (withdraw-stx (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (print { event: "stx-withdrawn", amount: amount, recipient: recipient })
    (ok true)
  )
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

;; Get property metadata
(define-read-only (get-property-info)
  (ok {
    name: (var-get property-name),
    symbol: (var-get property-symbol),
    uri: (var-get property-uri),
    address: (var-get property-address),
    total-shares: (var-get total-shares),
    shares-sold: (var-get shares-sold),
    share-price: (var-get share-price-micro-stx),
    min-purchase: (var-get min-purchase),
    sale-active: (var-get sale-active),
    paused: (var-get paused)
  })
)

;; Get payout round info
(define-read-only (get-payout-round (round-id uint))
  (ok (map-get? payout-rounds round-id))
)

;; Check if user has claimed a specific round
(define-read-only (has-claimed (round-id uint) (holder principal))
  (ok (default-to false (map-get? claimed-payouts { round: round-id, holder: holder })))
)

;; Calculate claimable amount for a holder in a round
(define-read-only (calculate-claimable (round-id uint) (holder principal))
  (let
    (
      (holder-shares (ft-get-balance property-share holder))
      (round-data (map-get? payout-rounds round-id))
    )
    (match round-data
      round-info
        (let
          (
            (total-amount (get total-amount round-info))
            (total-shares-in-round (get total-shares-snapshot round-info))
            (portion (/ (* holder-shares total-amount) total-shares-in-round))
          )
          (ok {
            claimable: portion,
            shares: holder-shares,
            already-claimed: (default-to false (map-get? claimed-payouts { round: round-id, holder: holder }))
          })
        )
      (ok { claimable: u0, shares: u0, already-claimed: false })
    )
  )
)

;; Get current payout round
(define-read-only (get-current-round)
  (ok (var-get current-payout-round))
)

;; Get contract owner
(define-read-only (get-owner)
  (ok CONTRACT-OWNER)
)

;; Get authorized oracle
(define-read-only (get-oracle)
  (ok (var-get authorized-oracle))
)

;; ============================================
;; INITIALIZATION (for testing/demo)
;; ============================================

;; Auto-initialize with demo values (remove in production)
;; Uncomment for quick testing
;; (initialize
;;   "Buenos Aires Apartment 1"
;;   "BAA1"
;;   (some u"ipfs://QmPropertyMetadata123")
;;   u1000
;;   u100000
;;   u1
;;   u"Av. Corrientes 1234, Buenos Aires, Argentina"
;; )
