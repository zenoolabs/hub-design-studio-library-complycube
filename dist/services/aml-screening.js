"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMLScreeningService = void 0;
class AMLScreeningService {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://api.complycube.com/v1';
        this.timeout = config.timeout || 30000;
    }
    async createScreeningCheck(request) {
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
            const response = await this.makeRequest('POST', '/checks', request);
            return response;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getScreeningCheck(checkId) {
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
            const response = await this.makeRequest('GET', `/checks/${encodeURIComponent(checkId)}`);
            return response;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async listScreeningChecks(clientId, limit) {
        try {
            const queryParams = new URLSearchParams();
            if (clientId)
                queryParams.append('clientId', clientId);
            if (limit)
                queryParams.append('limit', limit.toString());
            const endpoint = `/checks?${queryParams.toString()}`;
            const response = await this.makeRequest('GET', endpoint);
            return response;
        }
        catch (error) {
            return this.handleListError(error);
        }
    }
    async makeRequest(method, endpoint, body) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const requestOptions = {
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
                data: responseData
            };
        }
        catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    validateScreeningRequest(request) {
        const errors = [];
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
    parseApiError(responseData, status) {
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
    handleError(error) {
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
    handleListError(error) {
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
    getErrorCodeFromStatus(status) {
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
    getDefaultErrorMessage(status) {
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
    static analyzeScreeningResult(result) {
        const { outcome, breakdown } = result;
        const { summary, matches } = breakdown;
        let riskLevel = 'LOW';
        const recommendations = [];
        if (outcome === 'clear') {
            riskLevel = 'LOW';
            recommendations.push('Client cleared for onboarding');
        }
        else if (outcome === 'attention') {
            const totalMatches = summary.totalMatches;
            const highConfidenceMatches = matches.filter(m => m.confidence > 0.8).length;
            if (summary.pepMatches > 0 || summary.watchlistMatches > 0) {
                if (highConfidenceMatches > 0) {
                    riskLevel = 'CRITICAL';
                    recommendations.push('Manual review required - high confidence matches found');
                    recommendations.push('Consider enhanced due diligence');
                }
                else {
                    riskLevel = 'HIGH';
                    recommendations.push('Manual review recommended');
                }
            }
            if (summary.adverseMediaMatches > 0) {
                if (riskLevel === 'LOW')
                    riskLevel = 'MEDIUM';
                recommendations.push('Review adverse media findings');
            }
            if (totalMatches > 10) {
                recommendations.push('Multiple matches found - prioritize high confidence results');
            }
        }
        else {
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
exports.AMLScreeningService = AMLScreeningService;
//# sourceMappingURL=aml-screening.js.map