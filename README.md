# Decentralized Construction Safety Management System

A comprehensive blockchain-based solution for managing construction safety protocols, contractor verification, incident reporting, training certification, and compliance monitoring using Clarity smart contracts on the Stacks blockchain.

## Overview

This system provides a decentralized approach to construction safety management, ensuring transparency, immutability, and accountability across all safety-related activities in construction projects.

## Features

### 🏗️ Contractor Verification
- Register and verify construction contractors
- Manage contractor licenses and certifications
- Track contractor verification status and expiry dates
- Owner-controlled verification process

### 📋 Safety Protocol Management
- Create and manage safety protocols
- Track protocol compliance by contractors
- Categorize protocols by type and severity
- Monitor protocol adherence across projects

### 🚨 Incident Reporting
- Report safety incidents with detailed information
- Track incident severity and resolution status
- Add updates and notes to incidents
- Maintain comprehensive incident history

### 🎓 Training Verification
- Create safety training programs
- Issue and manage certifications
- Track certification validity and expiration
- Verify contractor training compliance

### 📊 Compliance Monitoring
- Conduct comprehensive compliance audits
- Monitor overall contractor compliance levels
- Report and track safety violations
- Generate compliance scores and ratings

## Smart Contracts

### 1. Contractor Verification Contract (`contractor-verification.clar`)
Manages contractor registration, verification, and status tracking.

**Key Functions:**
- `register-contractor`: Register a new contractor
- `verify-contractor`: Verify contractor (owner only)
- `get-contractor`: Retrieve contractor details
- `is-contractor-verified`: Check verification status

### 2. Safety Protocol Contract (`safety-protocol.clar`)
Handles safety protocols and compliance tracking.

**Key Functions:**
- `create-protocol`: Create new safety protocol
- `update-compliance`: Update contractor compliance status
- `get-protocol`: Retrieve protocol details
- `is-protocol-active`: Check if protocol is active

### 3. Incident Reporting Contract (`incident-reporting.clar`)
Manages safety incident reporting and tracking.

**Key Functions:**
- `report-incident`: Report a new safety incident
- `resolve-incident`: Mark incident as resolved
- `add-incident-update`: Add updates to incidents
- `get-incident`: Retrieve incident details

### 4. Training Verification Contract (`training-verification.clar`)
Handles training programs and certification management.

**Key Functions:**
- `create-training-program`: Create new training program
- `issue-certification`: Issue training certification
- `revoke-certification`: Revoke certification
- `is-certification-valid`: Check certification validity

### 5. Compliance Monitoring Contract (`compliance-monitoring.clar`)
Monitors overall compliance and conducts audits.

**Key Functions:**
- `conduct-audit`: Perform compliance audit
- `report-violation`: Report compliance violation
- `resolve-violation`: Resolve reported violation
- `is-contractor-compliant`: Check contractor compliance

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd construction-safety-dapp
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

## Usage

### Deploying Contracts

Deploy the contracts to the Stacks blockchain using Clarinet:

\`\`\`bash
clarinet deploy
\`\`\`

### Interacting with Contracts

#### Register a Contractor
\`\`\`clarity
(contract-call? .contractor-verification register-contractor
"ABC Construction"
"LIC123456"
u1000)
\`\`\`

#### Create Safety Protocol
\`\`\`clarity
(contract-call? .safety-protocol create-protocol
"Hard Hat Requirement"
"All workers must wear approved hard hats"
"PPE"
u3)
\`\`\`

#### Report Incident
\`\`\`clarity
(contract-call? .incident-reporting report-incident
u1
"Fall"
u4
"Worker fell from scaffolding"
"Building A, Floor 3")
\`\`\`

## Testing

The project includes comprehensive tests for all contracts using Vitest:

\`\`\`bash
npm test
\`\`\`

Test files are located in the `tests/` directory and cover:
- Contract function behavior
- Error handling
- Edge cases
- State management

## Data Models

### Contractor
- `contractor-id`: Unique identifier
- `address`: Contractor's blockchain address
- `company-name`: Company name
- `license-number`: License identifier
- `verified`: Verification status
- `registration-date`: Registration block height
- `expiry-date`: License expiry block height

### Safety Protocol
- `protocol-id`: Unique identifier
- `title`: Protocol title
- `description`: Detailed description
- `category`: Protocol category
- `severity-level`: Severity rating (1-5)
- `created-by`: Creator's address
- `status`: Active/inactive status

### Incident
- `incident-id`: Unique identifier
- `reporter`: Reporter's address
- `contractor-id`: Associated contractor
- `incident-type`: Type of incident
- `severity`: Severity rating (1-5)
- `description`: Incident description
- `location`: Incident location
- `status`: Open/resolved status

### Training Certification
- `certification-id`: Unique identifier
- `contractor-id`: Certified contractor
- `training-id`: Training program
- `issued-at`: Issue block height
- `expires-at`: Expiry block height
- `score`: Training score
- `status`: Valid/revoked status

### Compliance Audit
- `audit-id`: Unique identifier
- `contractor-id`: Audited contractor
- `overall-score`: Compliance score
- `protocol-compliance`: Protocol compliance score
- `training-compliance`: Training compliance score
- `incident-count`: Number of incidents
- `status`: Audit status

## Security Considerations

- **Access Control**: Owner-only functions for critical operations
- **Data Validation**: Input validation for all parameters
- **State Consistency**: Proper state management across contracts
- **Error Handling**: Comprehensive error codes and messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.
\`\`\`

Finally, let's create the PR details file:
