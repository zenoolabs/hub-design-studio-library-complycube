import { AMLScreeningService, ScreeningCheckRequest } from '../index';

/**
 * Example usage of the AML Screening Service
 *
 * This example demonstrates how to:
 * 1. Initialize the AML screening service
 * 2. Create different types of screening checks
 * 3. Retrieve screening results
 * 4. Analyze risk levels
 */

async function demonstrateAMLScreening() {
  // Initialize the service with your ComplyCube API key
  const amlService = new AMLScreeningService({
    apiKey: process.env.COMPLYCUBE_API_KEY || 'your-api-key-here',
    timeout: 30000 // AML checks may take longer than company lookups
  });

  console.log('🔍 ComplyCube AML Screening Examples\n');

  // Example 1: Standard screening check
  console.log('1. Creating standard screening check...');
  const standardScreeningRequest: ScreeningCheckRequest = {
    clientId: 'client-123',
    type: 'standard_screening_check',
    enableMonitoring: false,
    options: {
      screeningNameSearchMode: 'fuzzy',
      screeningClassification: {
        watchlists: ['sanctions', 'pep'],
        pepLevels: ['1', '2']
      }
    }
  };

  const standardResult = await amlService.createScreeningCheck(standardScreeningRequest);

  if (standardResult.data) {
    console.log('✅ Standard screening created:', {
      id: standardResult.data.id,
      outcome: standardResult.data.outcome,
      totalMatches: standardResult.data.breakdown.summary.totalMatches
    });

    // Analyze the risk level
    const riskAnalysis = AMLScreeningService.analyzeScreeningResult(standardResult.data);
    console.log('📊 Risk Analysis:', riskAnalysis);
  } else if (standardResult.error) {
    console.error('❌ Standard screening failed:', standardResult.error.message);
  }

  console.log('');

  // Example 2: Extensive screening check with monitoring
  console.log('2. Creating extensive screening check with monitoring...');
  const extensiveScreeningRequest: ScreeningCheckRequest = {
    clientId: 'client-456',
    type: 'extensive_screening_check',
    enableMonitoring: true,
    options: {
      screeningNameSearchMode: 'precise',
      screeningListsScope: {
        include: ['sanctions', 'pep', 'adverse-media'],
        exclude: ['low-risk-countries']
      },
      screeningClassification: {
        watchlists: ['sanctions', 'enforcement', 'regulatory'],
        pepLevels: ['1', '2', '3'],
        adverseMedia: ['corruption', 'money-laundering', 'terrorism']
      }
    }
  };

  const extensiveResult = await amlService.createScreeningCheck(extensiveScreeningRequest);

  if (extensiveResult.data) {
    console.log('✅ Extensive screening created:', {
      id: extensiveResult.data.id,
      outcome: extensiveResult.data.outcome,
      monitoring: extensiveResult.data.enableMonitoring,
      matches: {
        watchlist: extensiveResult.data.breakdown.summary.watchlistMatches,
        pep: extensiveResult.data.breakdown.summary.pepMatches,
        adverseMedia: extensiveResult.data.breakdown.summary.adverseMediaMatches
      }
    });

    // Show detailed matches if any
    if (extensiveResult.data.breakdown.matches.length > 0) {
      console.log('🚨 Matches found:');
      extensiveResult.data.breakdown.matches.slice(0, 3).forEach((match, index) => {
        console.log(`   ${index + 1}. ${match.name} (${match.confidence}% confidence)`);
        console.log(`      Category: ${match.category}`);
        if (match.listName) console.log(`      List: ${match.listName}`);
        if (match.pepLevel) console.log(`      PEP Level: ${match.pepLevel}`);
      });
    }

    // Analyze extensive screening risk
    const extensiveRiskAnalysis = AMLScreeningService.analyzeScreeningResult(extensiveResult.data);
    console.log('📊 Extensive Risk Analysis:', extensiveRiskAnalysis);
  } else if (extensiveResult.error) {
    console.error('❌ Extensive screening failed:', extensiveResult.error.message);
  }

  console.log('');

  // Example 3: Retrieve existing screening check
  console.log('3. Retrieving existing screening check...');
  if (standardResult.data?.id) {
    const retrievedResult = await amlService.getScreeningCheck(standardResult.data.id);

    if (retrievedResult.data) {
      console.log('✅ Retrieved screening check:', {
        id: retrievedResult.data.id,
        status: retrievedResult.data.outcome,
        createdAt: retrievedResult.data.createdAt,
        updatedAt: retrievedResult.data.updatedAt
      });
    } else if (retrievedResult.error) {
      console.error('❌ Failed to retrieve screening check:', retrievedResult.error.message);
    }
  }

  console.log('');

  // Example 4: List screening checks for a client
  console.log('4. Listing screening checks for client...');
  const listResult = await amlService.listScreeningChecks('client-123', 10);

  if (listResult.data && Array.isArray(listResult.data)) {
    console.log(`✅ Found ${listResult.data.length} screening checks for client-123`);
    listResult.data.forEach((check, index) => {
      console.log(`   ${index + 1}. ${check.id} - ${check.outcome} (${check.type})`);
    });
  } else if (listResult.error) {
    console.error('❌ Failed to list screening checks:', listResult.error.message);
  }

  console.log('');

  // Example 5: Error handling demonstration
  console.log('5. Demonstrating error handling...');
  const invalidRequest: ScreeningCheckRequest = {
    clientId: '', // Invalid: empty client ID
    type: 'standard_screening_check'
  };

  const errorResult = await amlService.createScreeningCheck(invalidRequest);
  if (errorResult.error) {
    console.log('✅ Proper error handling:', {
      code: errorResult.error.code,
      message: errorResult.error.message,
      status: errorResult.status
    });
  }

  console.log('\n🎉 AML Screening examples completed!');
}

// Risk assessment helper function
function assessOverallRisk(screeningResults: any[]): string {
  const criticalCount = screeningResults.filter(r =>
    AMLScreeningService.analyzeScreeningResult(r).riskLevel === 'CRITICAL'
  ).length;

  const highCount = screeningResults.filter(r =>
    AMLScreeningService.analyzeScreeningResult(r).riskLevel === 'HIGH'
  ).length;

  if (criticalCount > 0) return 'CRITICAL - Immediate review required';
  if (highCount > 0) return 'HIGH - Enhanced due diligence recommended';
  return 'ACCEPTABLE - Standard onboarding may proceed';
}

// Run the examples if this file is executed directly
if (require.main === module) {
  demonstrateAMLScreening().catch(console.error);
}

export { demonstrateAMLScreening, assessOverallRisk };