"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complyCubeService = void 0;
exports.lookupCompany = lookupCompany;
exports.lookupMultipleCompanies = lookupMultipleCompanies;
exports.integrateWithDesignStudio = integrateWithDesignStudio;
const complycube_1 = require("../services/complycube");
const config = {
    apiKey: (typeof process !== 'undefined' ? process.env.COMPLYCUBE_API_KEY : undefined) || 'your-api-key-here',
    baseUrl: 'https://api.complycube.com/v1',
    timeout: 15000
};
const complyCubeService = new complycube_1.ComplyCubeService(config);
exports.complyCubeService = complyCubeService;
async function lookupCompany(companyId) {
    console.log(`Looking up company: ${companyId}`);
    const result = await complyCubeService.getCompanyDetails(companyId);
    if (result.error) {
        console.error('Error occurred:', {
            code: result.error.code,
            message: result.error.message,
            status: result.status
        });
        return null;
    }
    if (result.data) {
        console.log('Company found:', {
            name: result.data.name,
            registrationNumber: result.data.registrationNumber,
            country: result.data.incorporationCountry,
            active: result.data.active
        });
        const validation = complycube_1.ComplyCubeService.validateCompanyData(result.data);
        if (!validation.isValid) {
            console.warn('Missing required fields:', validation.missingFields);
        }
        if (validation.warnings.length > 0) {
            console.warn('Missing optional fields:', validation.warnings);
        }
        return result.data;
    }
    return null;
}
async function lookupMultipleCompanies(companyIds) {
    console.log(`Looking up ${companyIds.length} companies...`);
    const results = await Promise.allSettled(companyIds.map(id => complyCubeService.getCompanyDetails(id)));
    const successful = [];
    const failed = [];
    results.forEach((result, index) => {
        const companyId = companyIds[index];
        if (result.status === 'fulfilled' && !result.value.error) {
            successful.push({
                companyId,
                data: result.value.data
            });
        }
        else {
            const error = result.status === 'fulfilled'
                ? result.value.error
                : { code: 'REQUEST_FAILED', message: result.reason?.message };
            failed.push({
                companyId,
                error
            });
        }
    });
    console.log(`Successfully retrieved: ${successful.length}`);
    console.log(`Failed to retrieve: ${failed.length}`);
    return { successful, failed };
}
async function integrateWithDesignStudio(companyId) {
    try {
        const result = await complyCubeService.getCompanyDetails(companyId);
        if (result.error) {
            switch (result.error.code) {
                case 'COMPANY_NOT_FOUND':
                    return { status: 'not_found', message: 'Company not found in database' };
                case 'UNAUTHORIZED':
                    return { status: 'auth_error', message: 'Please check your API credentials' };
                case 'RATE_LIMITED':
                    return { status: 'rate_limited', message: 'Please retry after some time' };
                default:
                    return { status: 'error', message: result.error.message };
            }
        }
        if (!result.data) {
            return { status: 'error', message: 'No data returned' };
        }
        const designStudioFormat = {
            companyInfo: {
                id: result.data.id,
                name: result.data.name,
                registrationNumber: result.data.registrationNumber,
                country: result.data.incorporationCountry,
                incorporationDate: result.data.incorporationDate,
                isActive: result.data.active ?? true,
                type: result.data.incorporationType
            },
            address: result.data.address ? {
                street: result.data.address.street,
                city: result.data.address.city,
                state: result.data.address.state,
                postalCode: result.data.address.postalCode,
                country: result.data.address.country
            } : null,
            stakeholders: {
                owners: result.data.owners?.map(owner => ({
                    name: owner.name,
                    shareholding: owner.shareholding,
                    appointmentDate: owner.appointmentDate
                })) || [],
                officers: result.data.officers?.map(officer => ({
                    name: officer.name,
                    role: officer.role,
                    appointmentDate: officer.appointmentDate
                })) || []
            },
            compliance: {
                sourceUrl: result.data.sourceUrl,
                lastUpdated: result.data.updatedAt,
                dataQuality: complycube_1.ComplyCubeService.validateCompanyData(result.data)
            }
        };
        return {
            status: 'success',
            data: designStudioFormat,
            rawData: result.data
        };
    }
    catch (error) {
        console.error('Integration error:', error);
        return {
            status: 'error',
            message: 'Unexpected error during integration',
            details: error
        };
    }
}
//# sourceMappingURL=complycube-usage.js.map