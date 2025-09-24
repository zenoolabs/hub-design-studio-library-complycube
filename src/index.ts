/**
 * Design Studio - ComplyCube Integration
 *
 * This module provides a complete integration with ComplyCube's company lookup API
 * for use within Design Studio applications.
 */

// Export main service class
export { ComplyCubeService } from './services/complycube';

// Export types
export {
  ComplyCubeCompany,
  ComplyCubeConfig,
  ComplyCubeApiResponse,
  ComplyCubeApiError,
  CompanyAddress,
  CompanyOwner,
  CompanyOfficer,
  CompanyFiling,
  IndustryCode
} from './types/complycube';

// Export examples for reference
export {
  lookupCompany,
  lookupMultipleCompanies,
  integrateWithDesignStudio,
  complyCubeService
} from './examples/complycube-usage';

// Re-export for convenience
export * from './services/complycube';
export * from './types/complycube';