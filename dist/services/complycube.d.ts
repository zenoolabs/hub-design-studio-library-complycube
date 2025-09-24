import { ComplyCubeCompany, ComplyCubeApiResponse, ComplyCubeConfig } from '../types/complycube';
export declare class ComplyCubeService {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeout;
    constructor(config: ComplyCubeConfig);
    getCompanyDetails(companyId: string): Promise<ComplyCubeApiResponse<ComplyCubeCompany>>;
    private makeRequest;
    private parseApiError;
    private handleError;
    private getErrorCodeFromStatus;
    private getDefaultErrorMessage;
    static validateCompanyData(company: ComplyCubeCompany): {
        isValid: boolean;
        missingFields: string[];
        warnings: string[];
    };
}
//# sourceMappingURL=complycube.d.ts.map