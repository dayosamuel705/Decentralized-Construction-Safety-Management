import { describe, it, expect, beforeEach } from "vitest"

describe("Contractor Verification Contract", () => {
  const contractState = {
    contractors: new Map(),
    contractorByAddress: new Map(),
    nextContractorId: 1,
    contractOwner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  }
  
  beforeEach(() => {
    contractState.contractors.clear()
    contractState.contractorByAddress.clear()
    contractState.nextContractorId = 1
  })
  
  // Mock contract functions
  const registerContractor = (caller, companyName, licenseNumber, expiryDate) => {
    if (contractState.contractorByAddress.has(caller)) {
      return { error: "already-exists" }
    }
    
    const contractorId = contractState.nextContractorId
    const contractorData = {
      address: caller,
      companyName,
      licenseNumber,
      verified: false,
      registrationDate: 100, // mock block height
      expiryDate,
    }
    
    contractState.contractors.set(contractorId, contractorData)
    contractState.contractorByAddress.set(caller, contractorId)
    contractState.nextContractorId += 1
    
    return { success: contractorId }
  }
  
  const verifyContractor = (caller, contractorId) => {
    if (caller !== contractState.contractOwner) {
      return { error: "owner-only" }
    }
    
    const contractor = contractState.contractors.get(contractorId)
    if (!contractor) {
      return { error: "not-found" }
    }
    
    contractor.verified = true
    contractState.contractors.set(contractorId, contractor)
    return { success: true }
  }
  
  const getContractor = (contractorId) => {
    return contractState.contractors.get(contractorId) || null
  }
  
  const isContractorVerified = (contractorId) => {
    const contractor = contractState.contractors.get(contractorId)
    return contractor ? contractor.verified : false
  }
  
  it("should register a new contractor", () => {
    const result = registerContractor("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", "ABC Construction", "LIC123456", 200)
    
    expect(result.success).toBe(1)
    expect(contractState.contractors.size).toBe(1)
    
    const contractor = getContractor(1)
    expect(contractor.companyName).toBe("ABC Construction")
    expect(contractor.verified).toBe(false)
  })
  
  it("should not allow duplicate contractor registration", () => {
    const address = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    
    registerContractor(address, "ABC Construction", "LIC123456", 200)
    const result = registerContractor(address, "XYZ Construction", "LIC789012", 300)
    
    expect(result.error).toBe("already-exists")
  })
  
  it("should verify contractor by owner", () => {
    registerContractor("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", "ABC Construction", "LIC123456", 200)
    
    const result = verifyContractor(contractState.contractOwner, 1)
    expect(result.success).toBe(true)
    expect(isContractorVerified(1)).toBe(true)
  })
  
  it("should not allow non-owner to verify contractor", () => {
    registerContractor("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", "ABC Construction", "LIC123456", 200)
    
    const result = verifyContractor("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", 1)
    expect(result.error).toBe("owner-only")
  })
  
  it("should return contractor details", () => {
    registerContractor("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", "ABC Construction", "LIC123456", 200)
    
    const contractor = getContractor(1)
    expect(contractor).toBeTruthy()
    expect(contractor.companyName).toBe("ABC Construction")
    expect(contractor.licenseNumber).toBe("LIC123456")
  })
})
