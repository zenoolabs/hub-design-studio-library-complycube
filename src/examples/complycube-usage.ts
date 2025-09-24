import { ComplyCubeService } from '../services/complycube';
import { ComplyCubeConfig } from '../types/complycube';

/**
 * Example usage of the ComplyCube service integration
 */

// Configuration
const config: ComplyCubeConfig = {
  apiKey: (typeof process !== 'undefined' ? process.env.COMPLYCUBE_API_KEY : undefined) || 'your-api-key-here',
  baseUrl: 'https://api.complycube.com/v1', // Optional: defaults to this
  timeout: 15000 // Optional: 15 seconds timeout
};

// Initialize service
const complyCubeService = new ComplyCubeService(config);

/**
 * Example 1: Basic company lookup
 */
async function lookupCompany(companyId: string) {
  console.log(`Looking up company: ${companyId}`);

  const result = await complyCubeService.getCompanyDetails(companyId);

  if (result.error) {
    console.error('Error occurred:', {
      code: result.error.code,
      message: result.error.message,
      status: result.status
    });
    return null;
  }

  if (result.data) {
    console.log('Company found:', {
      name: result.data.name,
      registrationNumber: result.data.registrationNumber,
      country: result.data.incorporationCountry,
      active: result.data.active
    });

    // Validate data completeness
    const validation = ComplyCubeService.validateCompanyData(result.data);
    if (!validation.isValid) {
      console.warn('Missing required fields:', validation.missingFields);
    }
    if (validation.warnings.length > 0) {
      console.warn('Missing optional fields:', validation.warnings);
    }

    return result.data;
  }

  return null;
}

/**
 * Example 2: Batch company lookup with error handling
 */
async function lookupMultipleCompanies(companyIds: string[]) {
  console.log(`Looking up ${companyIds.length} companies...`);

  const results = await Promise.allSettled(
    companyIds.map(id => complyCubeService.getCompanyDetails(id))
  );

  const successful: any[] = [];
  const failed: any[] = [];

  results.forEach((result, index) => {
    const companyId = companyIds[index];

    if (result.status === 'fulfilled' && !result.value.error) {
      successful.push({
        companyId,
        data: result.value.data
      });
    } else {
      const error = result.status === 'fulfilled'
        ? result.value.error
        : { code: 'REQUEST_FAILED', message: (result as any).reason?.message };

      failed.push({
        companyId,
        error
      });
    }
  });

  console.log(`Successfully retrieved: ${successful.length}`);
  console.log(`Failed to retrieve: ${failed.length}`);

  return { successful, failed };
}

/**
 * Example 3: Integration with Design Studio workflow
 */
async function integrateWithDesignStudio(companyId: string) {
  try {
    // Step 1: Lookup company
    const result = await complyCubeService.getCompanyDetails(companyId);

    if (result.error) {
      // Handle specific error cases
      switch (result.error.code) {
        case 'COMPANY_NOT_FOUND':
          return { status: 'not_found', message: 'Company not found in database' };
        case 'UNAUTHORIZED':
          return { status: 'auth_error', message: 'Please check your API credentials' };
        case 'RATE_LIMITED':
          return { status: 'rate_limited', message: 'Please retry after some time' };
        default:
          return { status: 'error', message: result.error.message };
      }
    }

    if (!result.data) {
      return { status: 'error', message: 'No data returned' };
    }

    // Step 2: Transform data for Design Studio format
    const designStudioFormat = {
      companyInfo: {
        id: result.data.id,
        name: result.data.name,
        registrationNumber: result.data.registrationNumber,
        country: result.data.incorporationCountry,
        incorporationDate: result.data.incorporationDate,
        isActive: result.data.active ?? true,
        type: result.data.incorporationType
      },
      address: result.data.address ? {
        street: result.data.address.street,
        city: result.data.address.city,
        state: result.data.address.state,
        postalCode: result.data.address.postalCode,
        country: result.data.address.country
      } : null,
      stakeholders: {
        owners: result.data.owners?.map(owner => ({
          name: owner.name,
          shareholding: owner.shareholding,
          appointmentDate: owner.appointmentDate
        })) || [],
        officers: result.data.officers?.map(officer => ({
          name: officer.name,
          role: officer.role,
          appointmentDate: officer.appointmentDate
        })) || []
      },
      compliance: {
        sourceUrl: result.data.sourceUrl,
        lastUpdated: result.data.updatedAt,
        dataQuality: ComplyCubeService.validateCompanyData(result.data)
      }
    };

    return {
      status: 'success',
      data: designStudioFormat,
      rawData: result.data // Keep original for reference
    };

  } catch (error) {
    console.error('Integration error:', error);
    return {
      status: 'error',
      message: 'Unexpected error during integration',
      details: error
    };
  }
}

// Export examples for use
export {
  lookupCompany,
  lookupMultipleCompanies,
  integrateWithDesignStudio,
  complyCubeService
};

// Example usage (uncomment to test):
/*
async function runExamples() {
  // Single company lookup
  await lookupCompany('example-company-id');

  // Multiple companies
  await lookupMultipleCompanies(['id1', 'id2', 'id3']);

  // Design Studio integration
  const result = await integrateWithDesignStudio('example-company-id');
  console.log('Design Studio result:', result);
}

runExamples().catch(console.error);
*/