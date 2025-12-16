import { request } from 'undici';

export interface TheirStackJob {
	id: string;
	job_title: string;
	company_name: string;
	job_location?: string;
	url: string;
	date_posted?: string;
	//   discovered_at?: string;
	//   remote?: boolean | null;
	//   seniority?: string;
	source_url?: string;
}

export async function fetchTheirStackJobs(
	page: number,
	limit: number,
	postedAt: number,
	companyName: string,
	jobTitle: string[],
	jobLocation: string[]
): Promise<TheirStackJob[]> {
	const body = {
		page: page || 0,
		limit: limit || 5,
		posted_at_max_age_days: postedAt || 7,
		company_name_case_insensitive_or: [companyName || 'google'],
		job_title_pattern_or:
			jobTitle.length > 0 ? jobTitle : ['developer', 'software engineer'],
		// "discovered_at_max_age_days": discoveredAt || 0,
		// "remote": remote || null,
		// "job_seniority_or": jobSeniority.length > 0 ? jobSeniority : ["junior"],
		job_country_code_or: jobLocation.length > 0 ? jobLocation : ['GB'],
	};
	const { statusCode, body: responseBody } = await request(
		'https://api.theirstack.com/v1/jobs/search',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.THEIRSTACK_TOKEN}`,
			},
			body: JSON.stringify(body),
		}
	);
	if (statusCode !== 200) {
		const text = await responseBody.text();
		console.error('TheirStack error', statusCode, text);
		throw new Error(`TheirStack error ${statusCode}: ${text}`);
	}
	const jsonBody: any = await responseBody.json();
	const data = jsonBody.data;
	const jobs: TheirStackJob[] = Array.isArray(data)
		? data
		: Array.isArray(data.results)
			? data.results
			: [];
	return jobs;
}
