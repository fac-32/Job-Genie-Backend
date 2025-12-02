// backend/src/services/dummyApiService.ts

// Import the types we defined
import { Job, CompanyInfo } from '../types/index.js';

// "export class" means other files can use this
export class DummyApiService {
	/**
	 * Simulates fetching company information
	 * @param companyName - The company to look up
	 * @returns Promise<CompanyInfo> - Returns company data
	 */
	// "async" means this function takes time (like calling an API)
	async getCompanyInfo(companyName: string): Promise<CompanyInfo> {
		// In real code, you'd call an actual API here
		// For now, we return fake data

		// Simulate API delay (wait 500ms)
		await this.delay(500);

		// Create fake company data based on name
		const companyData: CompanyInfo = {
			name: companyName,
			description: `${companyName} is a leading technology company focused on innovation and excellence.`,
			industry: 'Technology',
			size: '10,000+ employees',
			website: `https://www.${companyName.toLowerCase()}.com`,
			logo: `https://logo.clearbit.com/${companyName.toLowerCase()}.com`,
		};

		// "return" sends this data back to whoever called this function
		return companyData;
	}

	/**
	 * Simulates fetching jobs for a company
	 * @param companyName - The company to search jobs for
	 * @returns Promise<Job[]> - Returns array of jobs
	 */
	async getCompanyJobs(companyName: string): Promise<Job[]> {
		// Simulate API delay
		await this.delay(800);

		// Create array of fake jobs
		// In real code, you'd fetch this from an actual API
		const jobs: Job[] = [
			{
				id: '1',
				title: 'Senior Frontend Developer',
				company: companyName,
				location: 'London, UK',
				description:
					'We are looking for an experienced Frontend Developer to join our team. You will work with React and TypeScript to build amazing user interfaces.',
				requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
				salary: {
					min: 50000,
					max: 70000,
				},
			},
			{
				id: '2',
				title: 'Full Stack Engineer',
				company: companyName,
				location: 'Remote',
				description:
					'Join our engineering team to build scalable web applications. Experience with Node.js and React required.',
				requirements: [
					'Node.js',
					'React',
					'TypeScript',
					'PostgreSQL',
					'Docker',
				],
				salary: {
					min: 60000,
					max: 85000,
				},
			},
			{
				id: '3',
				title: 'Backend Developer',
				company: companyName,
				location: 'Manchester, UK',
				description:
					'Build robust APIs and microservices. Strong knowledge of Node.js and databases required.',
				requirements: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'AWS'],
				salary: {
					min: 45000,
					max: 65000,
				},
			},
		];

		return jobs;
	}

	/**
	 * Helper function to simulate delay (like waiting for API)
	 * @param ms - Milliseconds to wait
	 */
	private delay(ms: number): Promise<void> {
		// "new Promise" creates something that completes in the future
		// "setTimeout" waits for specified time then runs the function
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Calculate how well a job matches user's skills
	 * @param job - The job to score
	 * @param userSkills - User's skills from their CV
	 * @returns number - Score from 0-100
	 */
	calculateMatchScore(job: Job, userSkills: string[]): number {
		// If user has no skills, return 0
		if (userSkills.length === 0) return 0;

		// Count how many job requirements the user has
		// "filter" keeps only items that pass the test
		// "some" checks if at least one item matches
		const matchedSkills = job.requirements.filter((requirement) =>
			userSkills.some(
				(skill) =>
					// "toLowerCase()" makes it case-insensitive
					// "includes()" checks if string contains another string
					skill.toLowerCase() === requirement.toLowerCase()
			)
		);

		// Calculate percentage: (matched / total) * 100
		const score = (matchedSkills.length / job.requirements.length) * 100;

		// "Math.round" removes decimals: 67.8 becomes 68
		return Math.round(score);
	}
}
