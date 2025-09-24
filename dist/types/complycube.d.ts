export interface CompanyAddress {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}
export interface CompanyOwner {
    id?: string;
    name?: string;
    shareholding?: number;
    appointmentDate?: string;
}
export interface CompanyOfficer {
    id?: string;
    name?: string;
    role?: string;
    appointmentDate?: string;
}
export interface CompanyFiling {
    id?: string;
    type?: string;
    date?: string;
    description?: string;
}
export interface IndustryCode {
    code?: string;
    description?: string;
    system?: string;
}
export interface ComplyCubeCompany {
    id: string;
    name: string;
    registrationNumber?: string;
    incorporationCountry?: string;
    incorporationDate?: string;
    incorporationType?: string;
    address?: CompanyAddress;
    active?: boolean;
    sourceUrl?: string;
    owners?: CompanyOwner[];
    officers?: CompanyOfficer[];
    filings?: CompanyFiling[];
    industryCodes?: IndustryCode[];
    createdAt?: string;
    updatedAt?: string;
}
export interface ComplyCubeApiError {
    error: {
        code: string;
        message: string;
        details?: Record<string, any>;
    };
}
export interface ComplyCubeApiResponse<T = any> {
    data?: T;
    error?: ComplyCubeApiError['error'];
    status: number;
}
export interface ComplyCubeConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
}
export type ScreeningCheckType = 'standard_screening_check' | 'extensive_screening_check';
export type ScreeningOutcome = 'clear' | 'attention' | 'not_processed';
export type ScreeningNameSearchMode = 'fuzzy' | 'precise';
export interface ScreeningClassification {
    watchlists?: string[];
    pepLevels?: string[];
    adverseMedia?: string[];
}
export interface ScreeningListsScope {
    include?: string[];
    exclude?: string[];
}
export interface ScreeningOptions {
    screeningListsScope?: ScreeningListsScope;
    screeningNameSearchMode?: ScreeningNameSearchMode;
    screeningClassification?: ScreeningClassification;
}
export interface ScreeningCheckRequest {
    clientId: string;
    type: ScreeningCheckType;
    enableMonitoring?: boolean;
    options?: ScreeningOptions;
}
export interface ScreeningMatch {
    id: string;
    name: string;
    confidence: number;
    category: string;
    listName?: string;
    pepLevel?: string;
    sources?: string[];
    dateOfBirth?: string;
    placeOfBirth?: string;
    nationality?: string;
    description?: string;
}
export interface ScreeningSummary {
    watchlistMatches: number;
    pepMatches: number;
    adverseMediaMatches: number;
    totalMatches: number;
}
export interface ScreeningBreakdown {
    summary: ScreeningSummary;
    matches: ScreeningMatch[];
}
export interface ScreeningCheckResult {
    id: string;
    clientId: string;
    type: ScreeningCheckType;
    outcome: ScreeningOutcome;
    breakdown: ScreeningBreakdown;
    enableMonitoring: boolean;
    createdAt: string;
    updatedAt?: string;
}
export interface AMLScreeningApiResponse<T = any> {
    data?: T;
    error?: ComplyCubeApiError['error'];
    status: number;
}
//# sourceMappingURL=complycube.d.ts.map