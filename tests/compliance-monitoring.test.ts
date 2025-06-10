import { describe, it, expect, beforeEach } from "vitest"

describe("Compliance Monitoring Contract", () => {
  const contractState = {
    audits: new Map(),
    complianceStatus: new Map(),
    violations: new Map(),
    nextAuditId: 1,
  }
  
  beforeEach(() => {
    contractState.audits.clear()
    contractState.complianceStatus.clear()
    contractState.violations.clear()
    contractState.nextAuditId = 1
  })
  
  const conductAudit = (contractorId, protocolCompliance, trainingCompliance, incidentCount, notes) => {
    const auditId = contractState.nextAuditId
    const overallScore = Math.floor((protocolCompliance + trainingCompliance) / 2)
    
    const auditData = {
      contractorId,
      auditor: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      auditDate: 100,
      overallScore,
      protocolCompliance,
      trainingCompliance,
      incidentCount,
      status: "completed",
      notes,
    }
    
    contractState.audits.set(auditId, auditData)
    
    let complianceLevel = "violation"
    if (overallScore >= 80) complianceLevel = "compliant"
    else if (overallScore >= 60) complianceLevel = "warning"
    
    contractState.complianceStatus.set(contractorId, {
      lastAuditId: auditId,
      complianceLevel,
      lastUpdated: 100,
      warningsCount: complianceLevel === "warning" ? 1 : 0,
      violationsCount: complianceLevel === "violation" ? 1 : 0,
    })
    
    contractState.nextAuditId += 1
    return { success: auditId }
  }
  
  const reportViolation = (contractorId, violationId, violationType, severity, description) => {
    contractState.violations.set(`${contractorId}-${violationId}`, {
      violationType,
      severity,
      description,
      reportedAt: 100,
      resolved: false,
    })
    
    // Update compliance status
    const currentStatus = contractState.complianceStatus.get(contractorId) || {
      lastAuditId: 0,
      complianceLevel: "violation",
      lastUpdated: 100,
      warningsCount: 0,
      violationsCount: 0,
    }
    
    currentStatus.violationsCount += 1
    currentStatus.complianceLevel = "violation"
    contractState.complianceStatus.set(contractorId, currentStatus)
    
    return { success: true }
  }
  
  const isContractorCompliant = (contractorId) => {
    const status = contractState.complianceStatus.get(contractorId)
    return status ? status.complianceLevel === "compliant" : false
  }
  
  it("should conduct compliance audit", () => {
    const result = conductAudit(1, 85, 90, 2, "Good overall compliance")
    expect(result.success).toBe(1)
    
    const audit = contractState.audits.get(1)
    expect(audit.overallScore).toBe(87)
    expect(audit.status).toBe("completed")
    
    const status = contractState.complianceStatus.get(1)
    expect(status.complianceLevel).toBe("compliant")
  })
  
  it("should set warning level for medium scores", () => {
    conductAudit(1, 65, 70, 3, "Needs improvement")
    
    const status = contractState.complianceStatus.get(1)
    expect(status.complianceLevel).toBe("warning")
    expect(status.warningsCount).toBe(1)
  })
  
  it("should set violation level for low scores", () => {
    conductAudit(1, 40, 50, 5, "Poor compliance")
    
    const status = contractState.complianceStatus.get(1)
    expect(status.complianceLevel).toBe("violation")
    expect(status.violationsCount).toBe(1)
  })
  
  it("should report violations", () => {
    const result = reportViolation(1, 1, "Safety Equipment", 4, "Missing hard hats")
    expect(result.success).toBe(true)
    
    const violation = contractState.violations.get("1-1")
    expect(violation.violationType).toBe("Safety Equipment")
    expect(violation.resolved).toBe(false)
    
    const status = contractState.complianceStatus.get(1)
    expect(status.complianceLevel).toBe("violation")
  })
  
  it("should check contractor compliance status", () => {
    conductAudit(1, 85, 90, 2, "Good compliance")
    expect(isContractorCompliant(1)).toBe(true)
    
    conductAudit(2, 40, 50, 5, "Poor compliance")
    expect(isContractorCompliant(2)).toBe(false)
  })
})
