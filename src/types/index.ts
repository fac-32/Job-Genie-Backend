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
	salary?: {
		// "?" means optional (might not exist)
		min: number; // If it exists, min is a number
		max: number; // If it exists, max is a number
	};
	matchScore?: number; // Optional: 0-100 how well it matches user
}

// This defines what Company Info looks like
export interface CompanyInfo {
	name: string;
	description: string;
	industry: string;
	size: string;
	website: string;
	logo: string;
}

// This defines what we send back to frontend
export interface CompanyOverviewResponse {
	success: boolean; // true or false
	data: {
		company: CompanyInfo;
		jobs: Job[];
	};
}
