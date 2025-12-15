// backend/src/types/index.ts

// This defines what a Job object looks like
// "interface" is like a blueprint for an object
export interface Job {
	id: string; // Must be a string
	title: string; // Must be a string
	company: string; // Must be a string
	location: string; // Must be a string
	description: string; // Must be a string
	requirements: string[]; // Must be an array of strings
	experienceLevel: string; // Experience level (intern, entry-level, etc.)
	jobUrl: string; // Direct link to job posting
	salary?: {
		// "?" means optional (might not exist)
		min: number; // If it exists, min is a number
		max: number; // If it exists, max is a number
	};
	matchScore?: number; // Optional: 0-100 how well it matches user
}

// This defines what Company Info looks like
export interface Company {
	name: string;
	description: string;
	industry: string;
	size: string;
	website?: string; // Optional: for backward compatibility
	websiteUrl?: string; // Optional: alternative field name
	logo?: string; // Optional logo URL
	logoUrl?: string; // Optional: alternative field name
	city?: string; // Optional: company location city
	country?: string; // Optional: company location country
	jobs?: Job[]; // Optional: jobs for this company
}

// Keep alias for backward compatibility
export type CompanyInfo = Company;

// This defines what we send back to frontend
export interface CompanyOverviewResponse {
	success: boolean; // true or false
	data: {
		company: Company;
		jobs: Job[];
	};
}

// Job details response
export interface JobDetailsResponse {
	success: boolean;
	data: Job;
}
