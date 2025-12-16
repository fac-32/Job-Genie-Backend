import { Request, Response } from 'express';
import { fetchTheirStackJobs, TheirStackJob } from '../services/theirStack.js';
import { Company } from '../data/companies.js';
import { userWishlist } from './wishlist.controller.js';

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

export const getJobsForWishlist = async (req: Request, res: Response) => {
	try {
		const {
			postedAt,
			companies,
			jobTitles = ['software engineer', 'developer'],
			remote,
		} = req.body as JobsByWishlistRequestBody;

		// Use explicit companies if provided, otherwise fall back to in‑memory wishlist
		const sourceCompanies: Company[] =
			companies && companies.length > 0 ? companies : userWishlist;

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
