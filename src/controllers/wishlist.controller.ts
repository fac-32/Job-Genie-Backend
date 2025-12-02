import { Request, Response } from 'express';
import { generateWishlist } from '../services/wishlistGenerator.service.js';
import { companies, Company } from '../data/companies.js';

// Temporary in-memory wishlist for testing
let userWishlist: Company[] = [];

export const getAllWishlist = async (req: Request, res: Response) => {
	if (userWishlist.length > 0) {
		return res
			.status(200)
			.json({
				success: true,
				message: 'Success here is your wishlist',
				companies: userWishlist,
			});
	}

	return res.status(200).json({ success: false, message: 'empty wishlist' });
};

export const addToWishlist = async (req: Request, res: Response) => {
	const { id } = req.body;
	const company = companies.find((c) => c.id === id);

	if (!company) {
		return res
			.status(404)
			.json({ success: false, message: "couldn't find the company" });
	}

	if (!userWishlist.some((c) => c.id === id)) {
		userWishlist.push(company);

		return res
			.status(200)
			.json({
				success: true,
				message: 'company added',
				total: userWishlist.length,
				companies: userWishlist,
			});
	}

	return res
		.status(409)
		.json({
			success: false,
			message: 'company already exists',
			total: userWishlist.length,
			companies: userWishlist,
		});
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
	const { id } = req.query;

	if (!id) {
		return res
			.status(400)
			.json({ success: false, message: 'Company ID is required' });
	}

	const companyToDelete = userWishlist.find((c) => c.id === id);
	const prevLength = userWishlist.length;

	userWishlist = userWishlist.filter((c) => c.id !== id);

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
		const { industry, size, location } = req.query;

		const wishlist = generateWishlist({
			industry: industry as string,
			size: size as string,
			location: location as string,
		});

		userWishlist = wishlist;

		return res.status(200).json({
			success: true,
			total: wishlist.length,
			companies: wishlist,
		});
	} catch (error) {
		console.error('error generating wishlist: ', error);
		return res.status(500).json({ success: false, message: 'Server error' });
	}
};
