;; title: sip010-ft-trait
;; version: 1.0.0
;; summary: SIP-010 Fungible Token Standard Trait
;; description: Standard trait for fungible tokens on Stacks blockchain
;; Based on: https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md

;; SIP-010 Fungible Token Trait
;; Defines the standard interface for fungible tokens on Stacks

(define-trait sip010-ft-trait
  (
    ;; Transfer tokens from sender to recipient
    ;; @param amount: number of tokens to transfer
    ;; @param sender: principal sending the tokens
    ;; @param recipient: principal receiving the tokens
    ;; @param memo: optional buffer for additional transfer data
    ;; @returns (response bool uint) - success or error code
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; Get the human-readable name of the token
    ;; @returns (response (string-ascii 32) uint)
    (get-name () (response (string-ascii 32) uint))

    ;; Get the token symbol (ticker)
    ;; @returns (response (string-ascii 10) uint)
    (get-symbol () (response (string-ascii 10) uint))

    ;; Get the number of decimals for token display
    ;; @returns (response uint uint)
    (get-decimals () (response uint uint))

    ;; Get the token balance of a principal
    ;; @param who: principal to check balance for
    ;; @returns (response uint uint)
    (get-balance (principal) (response uint uint))

    ;; Get the total supply of tokens in existence
    ;; @returns (response uint uint)
    (get-total-supply () (response uint uint))

    ;; Get the URI containing token metadata
    ;; @returns (response (optional (string-utf8 256)) uint)
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

