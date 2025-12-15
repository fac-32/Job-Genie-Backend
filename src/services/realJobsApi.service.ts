// Service to fetch REAL jobs from Adzuna API
import { Job } from '../types/index.js';

interface AdzunaJob {
	id: string;
	title: string;
	location: {
		display_name: string;
	};
	description: string;
	category: {
		label: string;
	};
	salary_min?: number;
	salary_max?: number;
	redirect_url: string;
	company: {
		display_name: string;
	};
}

export class RealJobsApiService {
	private appId: string;
	private appKey: string;
	private baseUrl = 'https://api.adzuna.com/v1/api/jobs/gb/search/1';

	constructor() {
		this.appId = process.env.ADZUNA_APP_ID || '';
		this.appKey = process.env.ADZUNA_APP_KEY || '';
	}

	/**
	 * Fetch real jobs from Adzuna API
	 * @param companyName - Company to search jobs for
	 * @returns Array of real job listings
	 */
	async fetchRealJobs(companyName: string): Promise<Job[]> {
		// Check if API credentials are available
		if (!this.appId || !this.appKey) {
			console.log('⚠️  Adzuna API credentials not found, skipping real jobs');
			return [];
		}

		try {
			console.log(`🌐 Fetching real jobs from Adzuna for: ${companyName}`);

			const url = new URL(this.baseUrl);
			url.searchParams.append('app_id', this.appId);
			url.searchParams.append('app_key', this.appKey);
			url.searchParams.append('what', companyName); // Search for company
			url.searchParams.append('results_per_page', '10');
			url.searchParams.append('content-type', 'application/json');

			const response = await fetch(url.toString());

			if (!response.ok) {
				console.error('❌ Adzuna API error:', response.statusText);
				return [];
			}

			const data: any = await response.json();
			const adzunaJobs: AdzunaJob[] = data.results || [];

			console.log(`✅ Found ${adzunaJobs.length} real jobs from Adzuna`);

			// Convert Adzuna format to our Job format
			const jobs: Job[] = adzunaJobs.map((adzunaJob, index) =>
				this.convertAdzunaToJob(adzunaJob, companyName, index)
			);

			return jobs;
		} catch (error) {
			console.error('❌ Error fetching real jobs from Adzuna:', error);
			return [];
		}
	}

	/**
	 * Convert Adzuna job format to our Job interface
	 */
	private convertAdzunaToJob(
		adzunaJob: AdzunaJob,
		companyName: string,
		index: number
	): Job {
		// Extract skills/requirements from description (simple approach)
		const requirements = this.extractRequirements(adzunaJob.description);

		// Determine experience level from title
		const experienceLevel = this.determineExperienceLevel(adzunaJob.title);

		return {
			id: `${companyName.toLowerCase()}-real-${index + 1}`,
			title: adzunaJob.title,
			company: adzunaJob.company?.display_name || companyName,
			location: adzunaJob.location.display_name,
			description: this.cleanDescription(adzunaJob.description),
			requirements: requirements,
			experienceLevel: experienceLevel,
			jobUrl: adzunaJob.redirect_url,
			salary: adzunaJob.salary_min
				? {
						min: Math.round(adzunaJob.salary_min),
						max: Math.round(adzunaJob.salary_max || adzunaJob.salary_min * 1.2),
					}
				: undefined,
		};
	}

	/**
	 * Extract requirements/skills from job description
	 */
	private extractRequirements(description: string): string[] {
		const commonSkills = [
			'JavaScript',
			'TypeScript',
			'React',
			'Node.js',
			'Python',
			'Java',
			'C#',
			'AWS',
			'Docker',
			'Kubernetes',
			'SQL',
			'Git',
			'API',
			'REST',
			'GraphQL',
			'Agile',
			'Scrum',
		];

		const found: string[] = [];
		const descLower = description.toLowerCase();

		commonSkills.forEach((skill) => {
			if (descLower.includes(skill.toLowerCase())) {
				found.push(skill);
			}
		});

		return found.length > 0 ? found : ['General skills required'];
	}

	/**
	 * Determine experience level from job title
	 */
	private determineExperienceLevel(title: string): string {
		const titleLower = title.toLowerCase();

		if (
			titleLower.includes('intern') ||
			titleLower.includes('apprentice') ||
			titleLower.includes('trainee')
		) {
			return 'intern';
		}
		if (
			titleLower.includes('junior') ||
			titleLower.includes('graduate') ||
			titleLower.includes('entry')
		) {
			return 'entry-level';
		}
		if (titleLower.includes('senior') || titleLower.includes('lead')) {
			return 'senior';
		}
		if (titleLower.includes('principal') || titleLower.includes('staff')) {
			return 'principal';
		}

		return 'mid-level';
	}

	/**
	 * Clean up HTML and excessive text from description
	 */
	private cleanDescription(description: string): string {
		// Remove HTML tags
		let cleaned = description.replace(/<[^>]*>/g, '');

		// Decode HTML entities
		cleaned = cleaned
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");

		// Limit to first 300 characters for preview
		if (cleaned.length > 300) {
			cleaned = cleaned.substring(0, 300) + '...';
		}

		return cleaned.trim();
	}
}
