import { ComplyCubeConfig, ScreeningCheckRequest, ScreeningCheckResult, AMLScreeningApiResponse } from '../types/complycube';
export declare class AMLScreeningService {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeout;
    constructor(config: ComplyCubeConfig);
    createScreeningCheck(request: ScreeningCheckRequest): Promise<AMLScreeningApiResponse<ScreeningCheckResult>>;
    getScreeningCheck(checkId: string): Promise<AMLScreeningApiResponse<ScreeningCheckResult>>;
    listScreeningChecks(clientId?: string, limit?: number): Promise<AMLScreeningApiResponse<ScreeningCheckResult[]>>;
    private makeRequest;
    private validateScreeningRequest;
    private parseApiError;
    private handleError;
    private handleListError;
    private getErrorCodeFromStatus;
    private getDefaultErrorMessage;
    static analyzeScreeningResult(result: ScreeningCheckResult): {
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        recommendations: string[];
        summary: string;
    };
}
//# sourceMappingURL=aml-screening.d.ts.map