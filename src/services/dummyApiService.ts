// backend/src/services/dummyApiService.ts

// Import the types we defined
import { Job, Company } from '../types/index.js';

// "export class" means other files can use this
export class DummyApiService {
	// Mock company database
	private companies: { [key: string]: Company } = {
		google: {
			name: 'Google',
			description:
				'Google is a multinational technology company that specializes in Internet-related services and products, including search, cloud computing, software, and hardware.',
			industry: 'Technology',
			size: '10,000+ employees',
			website: 'https://www.google.com',
			logo: 'https://logo.clearbit.com/google.com',
		},
		amazon: {
			name: 'Amazon',
			description:
				'Amazon is a leading technology company focused on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
			industry: 'Technology',
			size: '10,000+ employees',
			website: 'https://www.amazon.com',
			logo: 'https://logo.clearbit.com/amazon.com',
		},
		meta: {
			name: 'Meta',
			description:
				'Meta builds technologies that help people connect, find communities, and grow businesses through social media platforms and virtual reality.',
			industry: 'Technology',
			size: '10,000+ employees',
			website: 'https://www.meta.com',
			logo: 'https://logo.clearbit.com/meta.com',
		},
		microsoft: {
			name: 'Microsoft',
			description:
				'Microsoft is a technology company that develops, licenses, and supports software, services, devices, and solutions worldwide.',
			industry: 'Technology',
			size: '10,000+ employees',
			website: 'https://www.microsoft.com',
			logo: 'https://logo.clearbit.com/microsoft.com',
		},
		linux: {
			name: 'Linux Foundation',
			description:
				'The Linux Foundation is dedicated to building sustainable ecosystems around open source projects to accelerate technology development and industry adoption.',
			industry: 'Technology',
			size: '1,000+ employees',
			website: 'https://www.linuxfoundation.org',
			logo: 'https://logo.clearbit.com/linuxfoundation.org',
		},
	};

	// Mock jobs database
	private jobs: Job[] = [
		// Google Jobs
		{
			id: 'google-1',
			title: 'Senior Frontend Developer',
			company: 'Google',
			location: 'London, UK',
			description:
				'We are looking for an experienced Frontend Developer to join our team. You will work with React and TypeScript to build amazing user interfaces for millions of users worldwide.',
			requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
			experienceLevel: 'entry-level',
			jobUrl: 'https://careers.google.com/jobs/frontend-developer',
			salary: {
				min: 50000,
				max: 70000,
			},
		},
		{
			id: 'google-2',
			title: 'Full Stack Engineer',
			company: 'Google',
			location: 'Remote',
			description:
				'Join our engineering team to build scalable web applications. Experience with Node.js and React required. Work on products used by billions.',
			requirements: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
			experienceLevel: 'graduate',
			jobUrl: 'https://careers.google.com/jobs/full-stack-engineer',
			salary: {
				min: 60000,
				max: 85000,
			},
		},
		{
			id: 'google-3',
			title: 'Cloud Solutions Architect',
			company: 'Google',
			location: 'Manchester, UK',
			description:
				'Design and implement cloud infrastructure solutions using Google Cloud Platform. Help enterprises migrate to the cloud.',
			requirements: ['Google Cloud', 'Kubernetes', 'Terraform', 'Python', 'Go'],
			experienceLevel: 'unspecified',
			jobUrl: 'https://careers.google.com/jobs/cloud-architect',
		},

		// Amazon Jobs
		{
			id: 'amazon-1',
			title: 'Software Development Engineer',
			company: 'Amazon',
			location: 'London, UK',
			description:
				'Build highly scalable systems that power Amazon retail and AWS services. Work with cutting-edge technologies in a fast-paced environment.',
			requirements: ['Java', 'Python', 'AWS', 'Microservices', 'REST APIs'],
			experienceLevel: 'entry-level',
			jobUrl: 'https://amazon.jobs/en/jobs/software-engineer',
			salary: {
				min: 55000,
				max: 75000,
			},
		},
		{
			id: 'amazon-2',
			title: 'AWS DevOps Engineer',
			company: 'Amazon',
			location: 'Edinburgh, UK',
			description:
				'Manage and optimize AWS infrastructure. Implement CI/CD pipelines and ensure high availability of services.',
			requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
			experienceLevel: 'graduate',
			jobUrl: 'https://amazon.jobs/en/jobs/devops-engineer',
		},
		{
			id: 'amazon-3',
			title: 'Frontend Developer Intern',
			company: 'Amazon',
			location: 'Remote',
			description:
				'Summer internship opportunity to work on customer-facing features. Learn from experienced engineers and contribute to real products.',
			requirements: ['JavaScript', 'React', 'HTML', 'CSS'],
			experienceLevel: 'intern',
			jobUrl: 'https://amazon.jobs/en/jobs/frontend-intern',
			salary: {
				min: 25000,
				max: 30000,
			},
		},

		// Meta Jobs
		{
			id: 'meta-1',
			title: 'React Developer',
			company: 'Meta',
			location: 'London, UK',
			description:
				'Build the next generation of social experiences. Work with React (we created it!) and help shape the future of connection.',
			requirements: ['React', 'JavaScript', 'GraphQL', 'Relay', 'TypeScript'],
			experienceLevel: 'entry-level',
			jobUrl: 'https://metacareers.com/jobs/react-developer',
			salary: {
				min: 60000,
				max: 80000,
			},
		},
		{
			id: 'meta-2',
			title: 'Backend Engineer - Infrastructure',
			company: 'Meta',
			location: 'Remote',
			description:
				'Build infrastructure that supports billions of users. Work on distributed systems, databases, and backend services at massive scale.',
			requirements: ['Python', 'C++', 'Distributed Systems', 'MySQL', 'Linux'],
			experienceLevel: 'graduate',
			jobUrl: 'https://metacareers.com/jobs/backend-infrastructure',
		},
		{
			id: 'meta-3',
			title: 'Software Engineer Apprentice',
			company: 'Meta',
			location: 'London, UK',
			description:
				'12-month apprenticeship program for aspiring software engineers. Learn on the job while building real features for Meta products.',
			requirements: ['JavaScript', 'Python', 'Git', 'Problem Solving'],
			experienceLevel: 'apprentice',
			jobUrl: 'https://metacareers.com/jobs/apprentice',
			salary: {
				min: 28000,
				max: 35000,
			},
		},

		// Microsoft Jobs
		{
			id: 'microsoft-1',
			title: 'Full Stack Developer - Azure',
			company: 'Microsoft',
			location: 'Reading, UK',
			description:
				'Develop cloud-based applications on Azure platform. Work with modern frameworks and cloud-native technologies.',
			requirements: ['C#', '.NET', 'Azure', 'React', 'SQL Server'],
			experienceLevel: 'entry-level',
			jobUrl: 'https://careers.microsoft.com/jobs/full-stack-azure',
			salary: {
				min: 50000,
				max: 70000,
			},
		},
		{
			id: 'microsoft-2',
			title: 'Software Engineer - VS Code',
			company: 'Microsoft',
			location: 'Remote',
			description:
				"Join the Visual Studio Code team to build the world's most popular code editor. Work with TypeScript and Electron.",
			requirements: ['TypeScript', 'Node.js', 'Electron', 'VS Code API', 'Git'],
			experienceLevel: 'graduate',
			jobUrl: 'https://careers.microsoft.com/jobs/vscode-engineer',
			salary: {
				min: 55000,
				max: 75000,
			},
		},
		{
			id: 'microsoft-3',
			title: 'Graduate Software Engineer',
			company: 'Microsoft',
			location: 'Cambridge, UK',
			description:
				'Graduate program for recent university graduates. Rotate through different teams and technologies while building your career at Microsoft.',
			requirements: [
				'Computer Science Degree',
				'C#',
				'JavaScript',
				'Problem Solving',
			],
			experienceLevel: 'graduate',
			jobUrl: 'https://careers.microsoft.com/jobs/graduate-program',
		},

		// Linux Foundation Jobs
		{
			id: 'linux-1',
			title: 'Open Source Developer',
			company: 'Linux Foundation',
			location: 'Remote',
			description:
				'Contribute to open source projects and help maintain critical infrastructure used by millions. Work with the global open source community.',
			requirements: ['Linux', 'C', 'Python', 'Git', 'Open Source'],
			experienceLevel: 'entry-level',
			jobUrl: 'https://linuxfoundation.org/jobs/open-source-developer',
			salary: {
				min: 45000,
				max: 60000,
			},
		},
		{
			id: 'linux-2',
			title: 'DevOps Engineer - Kubernetes',
			company: 'Linux Foundation',
			location: 'Remote',
			description:
				'Work on Kubernetes and cloud-native technologies. Help organizations adopt and scale container orchestration.',
			requirements: ['Kubernetes', 'Docker', 'Linux', 'Go', 'Cloud Platforms'],
			experienceLevel: 'unspecified',
			jobUrl: 'https://linuxfoundation.org/jobs/kubernetes-engineer',
		},
		{
			id: 'linux-3',
			title: 'Community Manager - Open Source',
			company: 'Linux Foundation',
			location: 'London, UK',
			description:
				'Build and engage with open source communities. Organize events, manage communications, and grow project adoption.',
			requirements: [
				'Community Management',
				'Open Source',
				'Communication',
				'Events',
			],
			experienceLevel: 'entry-level',
			jobUrl: 'https://linuxfoundation.org/jobs/community-manager',
			salary: {
				min: 40000,
				max: 55000,
			},
		},
	];

	/**
	 * Simulates fetching company information
	 * @param companyName - The company to look up
	 * @returns Promise<Company> - Returns company data
	 */
	async getCompanyInfo(companyName: string): Promise<Company> {
		await this.delay(300);

		const key = companyName.toLowerCase();
		const company = this.companies[key];

		if (!company) {
			throw new Error(`Company ${companyName} not found`);
		}

		return company;
	}

	/**
	 * Simulates fetching jobs for a company
	 * @param companyName - The company to search jobs for
	 * @returns Promise<Job[]> - Returns array of jobs
	 */
	async getCompanyJobs(companyName: string): Promise<Job[]> {
		await this.delay(300);

		const companyJobs = this.jobs.filter(
			(job) => job.company.toLowerCase() === companyName.toLowerCase()
		);

		if (companyJobs.length === 0) {
			throw new Error(`No jobs found for ${companyName}`);
		}

		return companyJobs;
	}

	/**
	 * Get a specific job by ID
	 * @param jobId - The job ID to look up
	 * @returns Promise<Job> - Returns job details
	 */
	async getJobById(jobId: string): Promise<Job> {
		await this.delay(200);

		const job = this.jobs.find((j) => j.id === jobId);

		if (!job) {
			throw new Error(`Job ${jobId} not found`);
		}

		return job;
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
