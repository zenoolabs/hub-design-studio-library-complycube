/**
 * ComplyCube API Types for Company Lookup Service
 */

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