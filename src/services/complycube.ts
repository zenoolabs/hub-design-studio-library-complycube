import {
  ComplyCubeCompany,
  ComplyCubeApiResponse,
  ComplyCubeConfig,
  ComplyCubeApiError
} from '../types/complycube';

export class ComplyCubeService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: ComplyCubeConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.complycube.com/v1';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Get company details by ID
   * @param companyId - The unique identifier for the company
   * @returns Promise resolving to company details or error
   */
  async getCompanyDetails(companyId: string): Promise<ComplyCubeApiResponse<ComplyCubeCompany>> {
    if (!companyId || typeof companyId !== 'string') {
      return {
        status: 400,
        error: {
          code: 'INVALID_COMPANY_ID',
          message: 'Company ID is required and must be a string'
        }
      };
    }

    try {
      const response = await this.makeRequest(`/lookup/companies/${encodeURIComponent(companyId)}`);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make HTTP request to ComplyCube API
   */
  private async makeRequest(endpoint: string): Promise<ComplyCubeApiResponse<ComplyCubeCompany>> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'Design-Studio/1.0'
        },
        signal: controller.signal
      });

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
        data: responseData as ComplyCubeCompany
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Parse API error response
   */
  private parseApiError(responseData: any, status: number): ComplyCubeApiError['error'] {
    // Check if error follows ComplyCube's error format
    if (responseData?.error) {
      return {
        code: responseData.error.code || 'API_ERROR',
        message: responseData.error.message || 'An API error occurred',
        details: responseData.error.details
      };
    }

    // Fallback for non-standard error responses
    return {
      code: this.getErrorCodeFromStatus(status),
      message: responseData?.message || this.getDefaultErrorMessage(status),
      details: responseData
    };
  }

  /**
   * Handle network and other errors
   */
  private handleError(error: any): ComplyCubeApiResponse<ComplyCubeCompany> {
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
      case 404: return 'COMPANY_NOT_FOUND';
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
      case 404: return 'Company not found';
      case 429: return 'Rate limit exceeded';
      case 500: return 'Internal server error';
      case 502: return 'Bad gateway';
      case 503: return 'Service temporarily unavailable';
      default: return `HTTP error ${status}`;
    }
  }

  /**
   * Validate company data completeness
   */
  static validateCompanyData(company: ComplyCubeCompany): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missingFields: string[] = [];
    const warnings: string[] = [];

    // Required fields check
    if (!company.id) missingFields.push('id');
    if (!company.name) missingFields.push('name');

    // Important optional fields check
    if (!company.registrationNumber) warnings.push('registrationNumber');
    if (!company.incorporationCountry) warnings.push('incorporationCountry');
    if (company.active === undefined) warnings.push('active status');

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }
}