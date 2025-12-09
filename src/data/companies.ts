export interface Company {
	id: string;
	name: string;
	industry: string;
	size: '1-50' | '51-200' | '201-500' | '500+';
	city: string[];
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}
