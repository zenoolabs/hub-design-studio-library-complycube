/**
 * Design Studio - ComplyCube Integration
 *
 * This module provides a complete integration with ComplyCube's company lookup API
 * and AML screening functionality for use within Design Studio applications.
 */

// Export main service classes
export { ComplyCubeService } from './services/complycube';
export { AMLScreeningService } from './services/aml-screening';

// Export company lookup types
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

// Export AML screening types
export {
  ScreeningCheckType,
  ScreeningOutcome,
  ScreeningNameSearchMode,
  ScreeningClassification,
  ScreeningListsScope,
  ScreeningOptions,
  ScreeningCheckRequest,
  ScreeningMatch,
  ScreeningSummary,
  ScreeningBreakdown,
  ScreeningCheckResult,
  AMLScreeningApiResponse
} from './types/complycube';

// Examples available in examples/ directory for reference

// Re-export for convenience
export * from './services/complycube';
export * from './services/aml-screening';
export * from './types/complycube';