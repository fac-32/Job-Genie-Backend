import { Request, Response } from 'express';
import { generateWishlist } from '../services/wishlistGenerator.service.js';
import { supabase } from '../config/supabase.js';
import { addOrg } from '../services/addOrgWishlist.js';
import { addRelationshipUserOrg } from '../services/addRelationshipUserOrg.js';
import { deleteRelationshipUserOrg } from '../services/deleteRelationshipUserOrg.js';
import { getOrgsByUser } from '../services/getOrgsByUser.js';

// Look up the numeric PK for a user by their Supabase auth UUID
async function getUserNumericId(authUuid: string): Promise<number> {
	const { data, error } = await supabase
		.from('Users')
		.select('id')
		.eq('auth_user_id', authUuid)
		.single();

	if (error || !data) {
		throw new Error('User not found');
	}

	return data.id as number;
}

export const getAllWishlist = async (req: Request, res: Response) => {
	try {
		const authUuid = (req as any).user.id;
		const numericId = await getUserNumericId(authUuid);

		const relationships = await getOrgsByUser(numericId);

		if (!relationships || relationships.length === 0) {
			return res
				.status(200)
				.json({ success: false, message: 'empty wishlist' });
		}

		const orgIds = relationships.map((r) => r.wishlist_fk);

		const { data: companies, error } = await supabase
			.from('Wishlist')
			.select('*')
			.in('id', orgIds);

		if (error) throw new Error(error.message);

		return res.status(200).json({
			success: true,
			message: 'Success here is your wishlist',
			companies,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
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

	try {
		const authUuid = (req as any).user.id;
		const numericId = await getUserNumericId(authUuid);

		const resolvedLogoUrl =
			logoUrl || `https://logo.clearbit.com/${extractDomain(websiteUrl)}`;

		const orgData = await addOrg(
			name,
			city,
			country,
			industry,
			description,
			size,
			resolvedLogoUrl
		);
		const orgId = orgData[0].id as number;

		await addRelationshipUserOrg(numericId, [orgId], ['wishlisted']);

		return res.status(200).json({
			success: true,
			message: 'Company added to wishlist',
			company: orgData[0],
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		const status = message.includes('already exists') ? 409 : 500;
		return res.status(status).json({ success: false, message });
	}
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
	const { name } = req.query;

	if (!name) {
		return res
			.status(400)
			.json({ success: false, message: 'Company name is required' });
	}

	try {
		const authUuid = (req as any).user.id;
		const numericId = await getUserNumericId(authUuid);

		const { data: orgData, error: orgError } = await supabase
			.from('Wishlist')
			.select('id')
			.eq('name', name)
			.single();

		if (orgError || !orgData) {
			return res
				.status(404)
				.json({ success: false, message: 'Company not in wishlist' });
		}

		await deleteRelationshipUserOrg(numericId, [orgData.id]);

		return res.status(200).json({
			success: true,
			deleted: { name },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const generateWishlistFromFilters = async (
	req: Request,
	res: Response
) => {
	try {
		const { industry, size, city, country } = req.query;
		const authUuid = (req as any).user.id;
		const numericId = await getUserNumericId(authUuid);

		console.log('🤖 Generating wishlist with Claude AI...');
		console.log('Filters:', { industry, size, city, country });

		const wishlist = await generateWishlist({
			industry: industry as string,
			size: size as string,
			city: city as string,
			country: country as string,
		});

		console.log(`✅ Generated ${wishlist.length} companies`);

		const savedCompanies = await Promise.all(
			wishlist.map(async (company) => {
				try {
					const orgData = await addOrg(
						company.name,
						company.city,
						company.country,
						company.industry,
						company.description,
						company.size,
						company.logoUrl
					);
					const orgId = orgData[0].id as number;
					await addRelationshipUserOrg(numericId, [orgId], ['wishlisted']);
					return orgData[0];
				} catch {
					// Skip duplicates — org with same name/city already exists
					return null;
				}
			})
		);

		const companies = savedCompanies.filter(Boolean);

		return res.status(200).json({
			success: true,
			total: companies.length,
			companies,
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
