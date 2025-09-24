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

// Examples available in examples/ directory for reference

// Re-export for convenience
export * from './services/complycube';
export * from './types/complycube';