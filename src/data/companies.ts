import { Job } from '../types/index.js';

export interface Company {
	name: string;
	industry: string;
	size: '1-50' | '51-200' | '201-500' | '500+';
	city: string;
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
	jobs?: Job[]; // Optional: Jobs for this company
}
