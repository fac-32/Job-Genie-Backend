import { companies, Company } from '../data/companies.js';

interface FilterInput {
	// ? means that the object may or may not have the value set
	industry?: string;
	size?: string;
	location?: string;
}

// returns Company[]
export const generateWishlist = (filters: FilterInput): Company[] => {
	let results = companies;

	// The ! in TypeScript is the non-null assertion operator. i promise it isnt null

	if (filters.industry) {
		results = results.filter((c) =>
			c.industry.toLowerCase().includes(filters.industry!.toLowerCase())
		);
	}

	if (filters.size) {
		results = results.filter((c) => c.size === filters.size);
	}

	if (filters.location) {
		results = results.filter((c) =>
			c.locations.some((loc) =>
				loc.toLowerCase().includes(filters.location!.toLowerCase())
			)
		);
	}

	return results;
};
