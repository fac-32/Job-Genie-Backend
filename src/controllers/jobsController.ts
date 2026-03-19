import { Request, Response } from 'express';
import { fetchTheirStackJobs, TheirStackJob } from '../services/theirStack.js';
import { Company } from '../data/companies.js';
import { supabase } from '../config/supabase.js';
import { getOrgsByUser } from '../services/getOrgsByUser.js';

interface JobsByWishlistRequestBody {
	postedAt: number;
	companies: Company[];
	jobTitles: string[];
	remote: boolean | null;
}

interface JobsByWishlistResult {
	company: string;
	jobs: TheirStackJob[];
}

async function getCompaniesFromDB(authUuid: string): Promise<Company[]> {
	const { data: userRow, error: userError } = await supabase
		.from('Users')
		.select('id')
		.eq('auth_user_id', authUuid)
		.single();

	if (userError || !userRow) return [];

	const relationships = await getOrgsByUser(userRow.id as number);
	if (!relationships || relationships.length === 0) return [];

	const orgIds = relationships.map((r) => r.wishlist_fk);
	const { data: orgs, error: orgsError } = await supabase
		.from('Wishlist')
		.select('*')
		.in('id', orgIds);

	if (orgsError || !orgs) return [];

	return orgs as Company[];
}

export const getJobsForWishlist = async (req: Request, res: Response) => {
	try {
		const {
			postedAt,
			companies,
			jobTitles = ['software engineer', 'developer'],
			remote,
		} = req.body as JobsByWishlistRequestBody;

		// Use explicit companies if provided, otherwise fall back to user's DB wishlist
		const sourceCompanies: Company[] =
			companies && companies.length > 0
				? companies
				: await getCompaniesFromDB((req as any).user.id);

		if (!sourceCompanies || sourceCompanies.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'No companies available in wishlist',
			});
		}

		const results: JobsByWishlistResult[] = await Promise.all(
			sourceCompanies.map(async (company) => {
				const jobs = await fetchTheirStackJobs(
					0,
					5,
					postedAt || 7,
					company.name,
					jobTitles,
					['GB']
				);
				return {
					company: company.name,
					jobs,
				};
			})
		);

		return res.status(200).json({
			success: true,
			results,
		});
	} catch (error) {
		console.error('Error fetching jobs for wishlist:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch jobs for wishlist',
			error: error instanceof Error ? error.message : String(error),
		});
	}
};
