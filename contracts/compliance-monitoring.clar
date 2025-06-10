;; Compliance Monitoring Contract
;; Monitors overall safety compliance across all contracts

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u500))
(define-constant err-not-found (err u501))
(define-constant err-unauthorized (err u502))

;; Data Variables
(define-data-var next-audit-id uint u1)

;; Data Maps
(define-map compliance-audits
  { audit-id: uint }
  {
    contractor-id: uint,
    auditor: principal,
    audit-date: uint,
    overall-score: uint,
    protocol-compliance: uint,
    training-compliance: uint,
    incident-count: uint,
    status: (string-ascii 20),
    notes: (string-ascii 500)
  }
)

(define-map contractor-compliance-status
  { contractor-id: uint }
  {
    last-audit-id: uint,
    compliance-level: (string-ascii 20),
    last-updated: uint,
    warnings-count: uint,
    violations-count: uint
  }
)

(define-map compliance-violations
  { contractor-id: uint, violation-id: uint }
  {
    violation-type: (string-ascii 50),
    severity: uint,
    description: (string-ascii 300),
    reported-at: uint,
    resolved: bool
  }
)

;; Public Functions

;; Conduct compliance audit
(define-public (conduct-audit (contractor-id uint) (protocol-compliance uint) (training-compliance uint) (incident-count uint) (notes (string-ascii 500)))
  (let
    (
      (audit-id (var-get next-audit-id))
      (overall-score (/ (+ protocol-compliance training-compliance) u2))
    )
    (map-set compliance-audits
      { audit-id: audit-id }
      {
        contractor-id: contractor-id,
        auditor: tx-sender,
        audit-date: block-height,
        overall-score: overall-score,
        protocol-compliance: protocol-compliance,
        training-compliance: training-compliance,
        incident-count: incident-count,
        status: "completed",
        notes: notes
      }
    )
    (map-set contractor-compliance-status
      { contractor-id: contractor-id }
      {
        last-audit-id: audit-id,
        compliance-level: (if (>= overall-score u80) "compliant"
                         (if (>= overall-score u60) "warning" "violation")),
        last-updated: block-height,
        warnings-count: (if (and (>= overall-score u60) (< overall-score u80)) u1 u0),
        violations-count: (if (< overall-score u60) u1 u0)
      }
    )
    (var-set next-audit-id (+ audit-id u1))
    (ok audit-id)
  )
)

;; Report compliance violation
(define-public (report-violation (contractor-id uint) (violation-id uint) (violation-type (string-ascii 50)) (severity uint) (description (string-ascii 300)))
  (begin
    (map-set compliance-violations
      { contractor-id: contractor-id, violation-id: violation-id }
      {
        violation-type: violation-type,
        severity: severity,
        description: description,
        reported-at: block-height,
        resolved: false
      }
    )
    ;; Update violation count
    (match (map-get? contractor-compliance-status { contractor-id: contractor-id })
      status-data
      (map-set contractor-compliance-status
        { contractor-id: contractor-id }
        (merge status-data {
          violations-count: (+ (get violations-count status-data) u1),
          compliance-level: "violation"
        })
      )
      ;; Create new status if doesn't exist
      (map-set contractor-compliance-status
        { contractor-id: contractor-id }
        {
          last-audit-id: u0,
          compliance-level: "violation",
          last-updated: block-height,
          warnings-count: u0,
          violations-count: u1
        }
      )
    )
    (ok true)
  )
)

;; Resolve violation
(define-public (resolve-violation (contractor-id uint) (violation-id uint))
  (match (map-get? compliance-violations { contractor-id: contractor-id, violation-id: violation-id })
    violation-data
    (begin
      (map-set compliance-violations
        { contractor-id: contractor-id, violation-id: violation-id }
        (merge violation-data { resolved: true })
      )
      (ok true)
    )
    err-not-found
  )
)

;; Read-only Functions

;; Get audit details
(define-read-only (get-audit (audit-id uint))
  (map-get? compliance-audits { audit-id: audit-id })
)

;; Get contractor compliance status
(define-read-only (get-compliance-status (contractor-id uint))
  (map-get? contractor-compliance-status { contractor-id: contractor-id })
)

;; Get violation details
(define-read-only (get-violation (contractor-id uint) (violation-id uint))
  (map-get? compliance-violations { contractor-id: contractor-id, violation-id: violation-id })
)

;; Check if contractor is compliant
(define-read-only (is-contractor-compliant (contractor-id uint))
  (match (map-get? contractor-compliance-status { contractor-id: contractor-id })
    status-data
    (is-eq (get compliance-level status-data) "compliant")
    false
  )
)
