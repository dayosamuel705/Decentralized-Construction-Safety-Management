;; Contractor Verification Contract
;; Manages contractor registration and verification status

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-unauthorized (err u103))

;; Data Variables
(define-data-var next-contractor-id uint u1)

;; Data Maps
(define-map contractors
  { contractor-id: uint }
  {
    address: principal,
    company-name: (string-ascii 100),
    license-number: (string-ascii 50),
    verified: bool,
    registration-date: uint,
    expiry-date: uint
  }
)

(define-map contractor-by-address
  { address: principal }
  { contractor-id: uint }
)

;; Public Functions

;; Register a new contractor
(define-public (register-contractor (company-name (string-ascii 100)) (license-number (string-ascii 50)) (expiry-date uint))
  (let
    (
      (contractor-id (var-get next-contractor-id))
      (caller tx-sender)
    )
    (asserts! (is-none (map-get? contractor-by-address { address: caller })) err-already-exists)
    (map-set contractors
      { contractor-id: contractor-id }
      {
        address: caller,
        company-name: company-name,
        license-number: license-number,
        verified: false,
        registration-date: block-height,
        expiry-date: expiry-date
      }
    )
    (map-set contractor-by-address { address: caller } { contractor-id: contractor-id })
    (var-set next-contractor-id (+ contractor-id u1))
    (ok contractor-id)
  )
)

;; Verify a contractor (owner only)
(define-public (verify-contractor (contractor-id uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (match (map-get? contractors { contractor-id: contractor-id })
      contractor-data
      (begin
        (map-set contractors
          { contractor-id: contractor-id }
          (merge contractor-data { verified: true })
        )
        (ok true)
      )
      err-not-found
    )
  )
)

;; Read-only Functions

;; Get contractor details
(define-read-only (get-contractor (contractor-id uint))
  (map-get? contractors { contractor-id: contractor-id })
)

;; Get contractor by address
(define-read-only (get-contractor-by-address (address principal))
  (match (map-get? contractor-by-address { address: address })
    contractor-ref
    (map-get? contractors { contractor-id: (get contractor-id contractor-ref) })
    none
  )
)

;; Check if contractor is verified
(define-read-only (is-contractor-verified (contractor-id uint))
  (match (map-get? contractors { contractor-id: contractor-id })
    contractor-data
    (get verified contractor-data)
    false
  )
)
