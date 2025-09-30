# Hub Design Studio Library - ComplyCube

A complete Design Studio library for ComplyCube integration providing visual workflow components for proof of address verification, company lookup, and AML screening.

## Features

- **Complete Design Studio Integration**: Three visual interactions for ComplyCube services
- **Proof of Address Verification**: Document verification with address extraction
- **Company Lookup**: Detailed company information retrieval
- **AML Screening**: Anti-Money Laundering and PEP screening
- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Visual Workflows**: Drag-and-drop components for Design Studio
- **Error handling**: Robust error handling with proper visual connectors

## Interactions

This library provides three visual interactions for Design Studio workflows:

### 1. Proof of Address Check
- **Purpose**: Verify proof of address documents
- **Inputs**: Client ID, Document ID
- **Outputs**: Verified (green), Needs Review (orange), Failed (red), Error (red)
- **Hub Plugin**: `proof-of-address-check@complycube`

### 2. Company Lookup
- **Purpose**: Retrieve detailed company information
- **Inputs**: Company ID
- **Outputs**: Found (green), Not Found (orange), Error (red)
- **Hub Plugin**: `get-company-details@complycube`

### 3. AML Screening
- **Purpose**: Perform AML and PEP screening
- **Inputs**: Client ID, Screening Type, Search Mode
- **Outputs**: Clear (green), Needs Attention (orange), Not Processed (orange), Error (red)
- **Hub Plugin**: `create-screening-check@complycube`

## Configuration

The library requires ComplyCube API configuration:

```json
{
  "apiKey": "your_complycube_api_key",
  "baseUrl": "https://api.complycube.com/v1"
}
```

## Installation in Design Studio

1. Install the library in your Design Studio environment
2. Configure ComplyCube API credentials
3. Use the visual interactions in your workflows

## Hub Plugin Dependency

This library depends on the ComplyCube Hub plugin:
- **Repository**: `zenoolabs/hub-plugin-complycube-proof-of-address`
- **Version**: `0.1.0`
- **Functions**: `proof-of-address-check`, `get-company-details`, `create-screening-check`

## API Response Structure

The ComplyCube API returns company data with the following structure:

```typescript
interface ComplyCubeCompany {
  id: string;                    // Unique company identifier
  name: string;                  // Registered company name
  registrationNumber?: string;   // Company registration number
  incorporationCountry?: string; // Country of incorporation
  incorporationDate?: string;    // Date of incorporation (YYYY-MM-DD)
  incorporationType?: string;    // Type of company incorporation
  address?: CompanyAddress;      // Structured company address
  active?: boolean;             // Company status
  sourceUrl?: string;           // Source of company data
  owners?: CompanyOwner[];      // List of company owners
  officers?: CompanyOfficer[];  // List of company officers
  filings?: CompanyFiling[];    // Company filing records
  industryCodes?: IndustryCode[]; // Industry classification codes
  createdAt?: string;           // Record creation timestamp
  updatedAt?: string;           // Record last update timestamp
}
```

## Error Handling

The service provides comprehensive error handling:

- **Network errors**: Connection issues, timeouts
- **API errors**: Invalid requests, authentication issues
- **Data validation**: Missing required fields, data completeness
- **Rate limiting**: Automatic handling of rate limit responses

```typescript
const result = await complyCube.getCompanyDetails('invalid-id');

if (result.error) {
  switch (result.error.code) {
    case 'COMPANY_NOT_FOUND':
      // Handle company not found
      break;
    case 'UNAUTHORIZED':
      // Handle authentication error
      break;
    case 'RATE_LIMITED':
      // Handle rate limiting
      break;
    default:
      // Handle other errors
      console.error(result.error.message);
  }
}
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Compile in watch mode
- `npm run dev` - Run the usage examples
- `npm run type-check` - Check TypeScript types without compilation

## Recommendations

### Input Validation
- Always validate company IDs before making API calls
- Consider implementing client-side caching for frequently accessed companies
- Use batch processing for multiple company lookups

### Response Handling
- Check the `active` field to determine if a company is still operating
- Validate data completeness using the built-in `validateCompanyData` method
- Store both transformed and raw data for audit purposes

### Error Recovery
- Implement retry logic for network errors
- Cache successful responses to reduce API calls
- Provide fallback options for critical workflows

### Security
- Never commit API keys to version control
- Use environment variables for configuration
- Implement request timeouts to prevent hanging requests

## License

MIT