import { Request, Response } from 'express';
import { generateWishlist } from '../services/wishlistGenerator.service.js';
import { Company } from '../data/companies.js';

// Temporary in-memory wishlist for testing
export let userWishlist: Company[] = [];

export const getAllWishlist = async (req: Request, res: Response) => {
	if (userWishlist.length > 0) {
		return res.status(200).json({
			success: true,
			message: 'Success here is your wishlist',
			companies: userWishlist,
		});
	}

	return res.status(200).json({ success: false, message: 'empty wishlist' });
};

export const addToWishlist = async (req: Request, res: Response) => {
	const {
		name,
		industry,
		size,
		city,
		country,
		description,
		logoUrl,
		websiteUrl,
	} = req.body;

	// Validate required fields
	if (
		!name ||
		!industry ||
		!size ||
		!city ||
		!country ||
		!description ||
		!websiteUrl
	) {
		return res.status(400).json({
			success: false,
			message: 'Missing required company fields',
		});
	}

	// Check if company already exists in wishlist
	if (userWishlist.some((c) => c.name === name)) {
		return res.status(409).json({
			success: false,
			message: 'Company already exists in wishlist',
			total: userWishlist.length,
			companies: userWishlist,
		});
	}

	// Add the company to wishlist
	const newCompany: Company = {
		name,
		industry,
		size,
		city,
		country,
		description,
		logoUrl:
			logoUrl || `https://logo.clearbit.com/${extractDomain(websiteUrl)}`,
		websiteUrl,
	};

	userWishlist.push(newCompany);

	return res.status(200).json({
		success: true,
		message: 'Company added to wishlist',
		total: userWishlist.length,
		companies: userWishlist,
	});
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
	const { name } = req.query;

	if (!name) {
		return res
			.status(400)
			.json({ success: false, message: 'Company ID is required' });
	}

	const companyToDelete = userWishlist.find((c) => c.name === name);
	const prevLength = userWishlist.length;

	userWishlist = userWishlist.filter((c) => c.name !== name);

	if (userWishlist.length === prevLength) {
		return res
			.status(404)
			.json({ success: false, message: 'Company not in wishlist' });
	}

	return res.status(200).json({
		success: true,
		total: userWishlist.length,
		deleted: companyToDelete,
		companies: userWishlist,
	});
};

export const generateWishlistFromFilters = async (
	req: Request,
	res: Response
) => {
	try {
		const { industry, size, city, country } = req.query;

		console.log('🤖 Generating wishlist with Claude AI...');
		console.log('Filters:', { industry, size, city, country });

		// Call the AI-powered service - now returns a Promise
		const wishlist = await generateWishlist({
			industry: industry as string,
			size: size as string,
			city: city as string,
			country: country as string,
		});

		console.log(`✅ Generated ${wishlist.length} companies`);

		// Store the AI-generated wishlist
		userWishlist = wishlist;

		return res.status(200).json({
			success: true,
			total: wishlist.length,
			companies: wishlist,
		});
	} catch (error) {
		console.error('❌ Error generating wishlist:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to generate wishlist with AI',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

// Helper function to extract domain from URL
function extractDomain(websiteUrl: string): string {
	try {
		const url = new URL(websiteUrl);
		return url.hostname.replace('www.', '');
	} catch {
		return websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
	}
}
