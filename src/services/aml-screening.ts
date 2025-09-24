import {
  ComplyCubeConfig,
  ComplyCubeApiError,
  ScreeningCheckRequest,
  ScreeningCheckResult,
  AMLScreeningApiResponse
} from '../types/complycube';

export class AMLScreeningService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ComplyCubeConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.complycube.com/v1';
    this.timeout = config.timeout || 30000; // AML checks may take longer
  }

  /**
   * Create an AML screening check
   * @param request - The screening check request parameters
   * @returns Promise resolving to screening check result or error
   */
  async createScreeningCheck(request: ScreeningCheckRequest): Promise<AMLScreeningApiResponse<ScreeningCheckResult>> {
    const validationResult = this.validateScreeningRequest(request);
    if (!validationResult.isValid) {
      return {
        status: 400,
        error: {
          code: 'INVALID_REQUEST',
          message: `Invalid screening request: ${validationResult.errors.join(', ')}`
        }
      };
    }

    try {
      const response = await this.makeRequest<ScreeningCheckResult>('POST', '/checks', request);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get screening check result by ID
   * @param checkId - The unique identifier for the screening check
   * @returns Promise resolving to screening check result or error
   */
  async getScreeningCheck(checkId: string): Promise<AMLScreeningApiResponse<ScreeningCheckResult>> {
    if (!checkId || typeof checkId !== 'string') {
      return {
        status: 400,
        error: {
          code: 'INVALID_CHECK_ID',
          message: 'Check ID is required and must be a string'
        }
      };
    }

    try {
      const response = await this.makeRequest<ScreeningCheckResult>('GET', `/checks/${encodeURIComponent(checkId)}`);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * List screening checks for a client
   * @param clientId - The client ID to filter checks
   * @param limit - Maximum number of results to return (optional)
   * @returns Promise resolving to list of screening checks or error
   */
  async listScreeningChecks(clientId?: string, limit?: number): Promise<AMLScreeningApiResponse<ScreeningCheckResult[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (clientId) queryParams.append('clientId', clientId);
      if (limit) queryParams.append('limit', limit.toString());

      const endpoint = `/checks?${queryParams.toString()}`;
      const response = await this.makeRequest<ScreeningCheckResult[]>('GET', endpoint);
      return response;
    } catch (error) {
      return this.handleListError(error);
    }
  }

  /**
   * Make HTTP request to ComplyCube API
   */
  private async makeRequest<T = ScreeningCheckResult>(
    method: 'GET' | 'POST',
    endpoint: string,
    body?: any
  ): Promise<AMLScreeningApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'Design-Studio-AML/1.0'
        },
        signal: controller.signal
      };

      if (body && method === 'POST') {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        return {
          status: response.status,
          error: this.parseApiError(responseData, response.status)
        };
      }

      return {
        status: response.status,
        data: responseData as T
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Validate screening request
   */
  private validateScreeningRequest(request: ScreeningCheckRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.clientId || typeof request.clientId !== 'string') {
      errors.push('clientId is required and must be a string');
    }

    if (!request.type || !['standard_screening_check', 'extensive_screening_check'].includes(request.type)) {
      errors.push('type must be either "standard_screening_check" or "extensive_screening_check"');
    }

    if (request.options?.screeningNameSearchMode &&
        !['fuzzy', 'precise'].includes(request.options.screeningNameSearchMode)) {
      errors.push('screeningNameSearchMode must be either "fuzzy" or "precise"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Parse API error response
   */
  private parseApiError(responseData: any, status: number): ComplyCubeApiError['error'] {
    if (responseData?.error) {
      return {
        code: responseData.error.code || 'API_ERROR',
        message: responseData.error.message || 'An API error occurred',
        details: responseData.error.details
      };
    }

    return {
      code: this.getErrorCodeFromStatus(status),
      message: responseData?.message || this.getDefaultErrorMessage(status),
      details: responseData
    };
  }

  /**
   * Handle network and other errors for single screening check
   */
  private handleError(error: any): AMLScreeningApiResponse<ScreeningCheckResult> {
    if (error.name === 'AbortError') {
      return {
        status: 408,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: `Request timed out after ${this.timeout}ms`
        }
      };
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        status: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection.'
        }
      };
    }

    return {
      status: 500,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: { originalError: error.toString() }
      }
    };
  }

  /**
   * Handle network and other errors for screening check lists
   */
  private handleListError(error: any): AMLScreeningApiResponse<ScreeningCheckResult[]> {
    if (error.name === 'AbortError') {
      return {
        status: 408,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: `Request timed out after ${this.timeout}ms`
        }
      };
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        status: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection.'
        }
      };
    }

    return {
      status: 500,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: { originalError: error.toString() }
      }
    };
  }

  /**
   * Get error code based on HTTP status
   */
  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'CHECK_NOT_FOUND';
      case 429: return 'RATE_LIMITED';
      case 500: return 'INTERNAL_SERVER_ERROR';
      case 502: return 'BAD_GATEWAY';
      case 503: return 'SERVICE_UNAVAILABLE';
      default: return 'HTTP_ERROR';
    }
  }

  /**
   * Get default error message based on HTTP status
   */
  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400: return 'Invalid request parameters';
      case 401: return 'Invalid or missing API key';
      case 403: return 'Access forbidden';
      case 404: return 'Screening check not found';
      case 429: return 'Rate limit exceeded';
      case 500: return 'Internal server error';
      case 502: return 'Bad gateway';
      case 503: return 'Service temporarily unavailable';
      default: return `HTTP error ${status}`;
    }
  }

  /**
   * Analyze screening result for risk assessment
   */
  static analyzeScreeningResult(result: ScreeningCheckResult): {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendations: string[];
    summary: string;
  } {
    const { outcome, breakdown } = result;
    const { summary, matches } = breakdown;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const recommendations: string[] = [];

    if (outcome === 'clear') {
      riskLevel = 'LOW';
      recommendations.push('Client cleared for onboarding');
    } else if (outcome === 'attention') {
      const totalMatches = summary.totalMatches;
      const highConfidenceMatches = matches.filter(m => m.confidence > 0.8).length;

      if (summary.pepMatches > 0 || summary.watchlistMatches > 0) {
        if (highConfidenceMatches > 0) {
          riskLevel = 'CRITICAL';
          recommendations.push('Manual review required - high confidence matches found');
          recommendations.push('Consider enhanced due diligence');
        } else {
          riskLevel = 'HIGH';
          recommendations.push('Manual review recommended');
        }
      }

      if (summary.adverseMediaMatches > 0) {
        if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
        recommendations.push('Review adverse media findings');
      }

      if (totalMatches > 10) {
        recommendations.push('Multiple matches found - prioritize high confidence results');
      }
    } else {
      riskLevel = 'MEDIUM';
      recommendations.push('Screening could not be processed - retry recommended');
    }

    const summaryText = `${outcome.toUpperCase()} result with ${summary.totalMatches} total matches (${summary.pepMatches} PEP, ${summary.watchlistMatches} watchlist, ${summary.adverseMediaMatches} adverse media)`;

    return {
      riskLevel,
      recommendations,
      summary: summaryText
    };
  }
}