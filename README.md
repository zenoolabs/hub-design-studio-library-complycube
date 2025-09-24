# Design Studio - ComplyCube Integration

A TypeScript integration for ComplyCube's company lookup API, designed for use with Design Studio.

## Features

- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Error handling**: Robust error handling with detailed error codes and messages
- **Configurable**: Flexible configuration options with environment variable support
- **Validated responses**: Built-in data validation and completeness checking
- **Design Studio ready**: Pre-configured transformations for Design Studio workflows

## Installation

```bash
npm install
```

## Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Add your ComplyCube API key:
```env
COMPLYCUBE_API_KEY=your_actual_api_key_here
```

## Usage

### Basic Usage

```typescript
import { ComplyCubeService, ComplyCubeConfig } from './src';

const config: ComplyCubeConfig = {
  apiKey: process.env.COMPLYCUBE_API_KEY!,
  timeout: 15000 // Optional: 15 second timeout
};

const complyCube = new ComplyCubeService(config);

// Lookup a company
const result = await complyCube.getCompanyDetails('company-id');

if (result.error) {
  console.error('Error:', result.error.message);
} else {
  console.log('Company:', result.data?.name);
}
```

### Design Studio Integration

```typescript
import { integrateWithDesignStudio } from './src/examples/complycube-usage';

const result = await integrateWithDesignStudio('company-id');

if (result.status === 'success') {
  // Use result.data in your Design Studio workflow
  console.log('Company info:', result.data.companyInfo);
  console.log('Address:', result.data.address);
  console.log('Stakeholders:', result.data.stakeholders);
}
```

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