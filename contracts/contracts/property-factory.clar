;; title: property-factory
;; version: 1.0.0
;; summary: Property Registry and Factory Contract
;; description: Central registry for all tokenized properties on MicroPropiedad platform

;; ============================================
;; CONSTANTS
;; ============================================

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-PROPERTY-EXISTS (err u201))
(define-constant ERR-PROPERTY-NOT-FOUND (err u202))
(define-constant ERR-INVALID-DATA (err u203))
(define-constant ERR-PAUSED (err u204))

;; Contract admin
(define-constant CONTRACT-ADMIN tx-sender)

;; Platform fee (in basis points, e.g., 250 = 2.5%)
(define-constant PLATFORM-FEE-BP u250)

;; ============================================
;; DATA VARIABLES
;; ============================================

(define-data-var property-counter uint u0)
(define-data-var paused bool false)
(define-data-var platform-treasury principal CONTRACT-ADMIN)

;; ============================================
;; DATA MAPS
;; ============================================

;; Property registry: property-id => property details
(define-map properties
  uint
  {
    contract-address: principal,
    name: (string-ascii 32),
    symbol: (string-ascii 10),
    owner: principal,
    total-shares: uint,
    created-at: uint,
    status: (string-ascii 20),  ;; "active", "sold-out", "paused"
    location: (string-utf8 256)
  }
)

;; Contract address to property ID mapping
(define-map contract-to-id
  principal
  uint
)

;; Owner's properties: owner => list of property IDs (simplified with counter)
(define-map owner-properties
  principal
  (list 100 uint)
)

;; Property metadata URIs (IPFS/Arweave)
(define-map property-metadata-uris
  uint
  (string-utf8 256)
)

;; Property statistics
(define-map property-stats
  uint
  {
    total-raised: uint,
    total-investors: uint,
    last-payout: uint
  }
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

;; Register a new property contract
(define-public (register-property
  (contract-addr principal)
  (name (string-ascii 32))
  (symbol (string-ascii 10))
  (total-shares uint)
  (location (string-utf8 256))
  (metadata-uri (string-utf8 256))
)
  (let
    (
      (property-id (+ (var-get property-counter) u1))
      (owner tx-sender)
    )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (is-none (map-get? contract-to-id contract-addr)) ERR-PROPERTY-EXISTS)
    (asserts! (> total-shares u0) ERR-INVALID-DATA)

    ;; Register property
    (map-set properties property-id {
      contract-address: contract-addr,
      name: name,
      symbol: symbol,
      owner: owner,
      total-shares: total-shares,
      created-at: stacks-block-height,
      status: "active",
      location: location
    })

    ;; Set contract mapping
    (map-set contract-to-id contract-addr property-id)

    ;; Set metadata URI
    (map-set property-metadata-uris property-id metadata-uri)

    ;; Initialize stats
    (map-set property-stats property-id {
      total-raised: u0,
      total-investors: u0,
      last-payout: u0
    })

    ;; Add to owner's properties list
    (let
      (
        (current-list (default-to (list) (map-get? owner-properties owner)))
      )
      (map-set owner-properties owner (unwrap-panic (as-max-len? (append current-list property-id) u100)))
    )

    ;; Increment counter
    (var-set property-counter property-id)

    (print {
      event: "property-registered",
      property-id: property-id,
      contract: contract-addr,
      owner: owner,
      name: name
    })

    (ok property-id)
  )
)

;; Update property status
(define-public (update-property-status (property-id uint) (new-status (string-ascii 20)))
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get owner property)) ERR-NOT-AUTHORIZED)

    (map-set properties property-id
      (merge property { status: new-status })
    )

    (print {
      event: "property-status-updated",
      property-id: property-id,
      status: new-status
    })

    (ok true)
  )
)

;; Update property statistics
(define-public (update-property-stats
  (property-id uint)
  (total-raised uint)
  (total-investors uint)
  (last-payout uint)
)
  (let
    (
      (property (unwrap! (map-get? properties property-id) ERR-PROPERTY-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get owner property)) ERR-NOT-AUTHORIZED)

    (map-set property-stats property-id {
      total-raised: total-raised,
      total-investors: total-investors,
      last-payout: last-payout
    })

    (ok true)
  )
)

;; ============================================
;; ADMIN FUNCTIONS
;; ============================================

;; Pause/unpause the factory
(define-public (set-paused (pause bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-ADMIN) ERR-NOT-AUTHORIZED)
    (var-set paused pause)
    (print { event: "factory-pause-changed", paused: pause })
    (ok true)
  )
)

;; Update platform treasury
(define-public (set-treasury (new-treasury principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-ADMIN) ERR-NOT-AUTHORIZED)
    (var-set platform-treasury new-treasury)
    (print { event: "treasury-updated", treasury: new-treasury })
    (ok true)
  )
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

;; Get property details by ID
(define-read-only (get-property (property-id uint))
  (ok (map-get? properties property-id))
)

;; Get property ID by contract address
(define-read-only (get-property-id-by-contract (contract-addr principal))
  (ok (map-get? contract-to-id contract-addr))
)

;; Get property metadata URI
(define-read-only (get-property-metadata (property-id uint))
  (ok (map-get? property-metadata-uris property-id))
)

;; Get property statistics
(define-read-only (get-property-stats (property-id uint))
  (ok (map-get? property-stats property-id))
)

;; Get properties owned by a principal
(define-read-only (get-owner-properties (owner principal))
  (ok (map-get? owner-properties owner))
)

;; Get total number of registered properties
(define-read-only (get-property-count)
  (ok (var-get property-counter))
)

;; Get platform treasury
(define-read-only (get-treasury)
  (ok (var-get platform-treasury))
)

;; Get platform fee in basis points
(define-read-only (get-platform-fee)
  (ok PLATFORM-FEE-BP)
)

;; Check if factory is paused
(define-read-only (is-paused)
  (ok (var-get paused))
)

;; Get contract admin
(define-read-only (get-admin)
  (ok CONTRACT-ADMIN)
)

;; Get multiple properties (batch query for frontend)
(define-read-only (get-properties-batch (ids (list 20 uint)))
  (ok (map get-property-internal ids))
)

;; ============================================
;; PRIVATE FUNCTIONS
;; ============================================

(define-private (get-property-internal (property-id uint))
  (map-get? properties property-id)
)
