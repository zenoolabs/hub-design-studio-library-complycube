import { ComplyCubeService } from '../services/complycube';
declare const complyCubeService: ComplyCubeService;
declare function lookupCompany(companyId: string): Promise<import("../types/complycube").ComplyCubeCompany | null>;
declare function lookupMultipleCompanies(companyIds: string[]): Promise<{
    successful: any[];
    failed: any[];
}>;
declare function integrateWithDesignStudio(companyId: string): Promise<{
    status: string;
    message: string;
    data?: undefined;
    rawData?: undefined;
    details?: undefined;
} | {
    status: string;
    data: {
        companyInfo: {
            id: string;
            name: string;
            registrationNumber: string | undefined;
            country: string | undefined;
            incorporationDate: string | undefined;
            isActive: boolean;
            type: string | undefined;
        };
        address: {
            street: string | undefined;
            city: string | undefined;
            state: string | undefined;
            postalCode: string | undefined;
            country: string | undefined;
        } | null;
        stakeholders: {
            owners: {
                name: string | undefined;
                shareholding: number | undefined;
                appointmentDate: string | undefined;
            }[];
            officers: {
                name: string | undefined;
                role: string | undefined;
                appointmentDate: string | undefined;
            }[];
        };
        compliance: {
            sourceUrl: string | undefined;
            lastUpdated: string | undefined;
            dataQuality: {
                isValid: boolean;
                missingFields: string[];
                warnings: string[];
            };
        };
    };
    rawData: import("../types/complycube").ComplyCubeCompany;
    message?: undefined;
    details?: undefined;
} | {
    status: string;
    message: string;
    details: unknown;
    data?: undefined;
    rawData?: undefined;
}>;
export { lookupCompany, lookupMultipleCompanies, integrateWithDesignStudio, complyCubeService };
//# sourceMappingURL=complycube-usage.d.ts.map