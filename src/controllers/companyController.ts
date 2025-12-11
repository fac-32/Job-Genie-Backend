// backend/src/controllers/companyController.ts

// Import types from Express (the web framework)
import { Request, Response } from 'express';
// Import our service
import { DummyApiService } from '../services/dummyApiService.js';
// Import our types
import { CompanyOverviewResponse, JobDetailsResponse } from '../types/index.js';

// "export class" so we can use this in other files
export class CompanyController {
	// "private" means only this class can access it
	private apiService: DummyApiService;

	// "constructor" runs when you create a new CompanyController
	constructor() {
		// Create an instance of our API service
		this.apiService = new DummyApiService();
	}

	/**
	 * Handles GET /api/companies/:companyName/overview
	 * This is what runs when frontend calls this endpoint
	 */
	// "= async" makes this an arrow function (different syntax, same result)
	getCompanyOverview = async (req: Request, res: Response) => {
		// "try/catch" handles errors gracefully
		try {
			// STEP 1: Get company name from URL
			// If URL is /api/companies/Google/overview
			// then req.params.companyName = "Google"
			const { companyName } = req.params;

			// STEP 2: Log to console (for debugging)
			console.log('📞 Received request for company:', companyName);

			// STEP 3: Get user's skills (in real app, from database)
			// For now, we'll use hardcoded skills
			const userSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript'];
			console.log('👤 User skills:', userSkills);

			// STEP 4: Fetch company info and jobs
			// "await" waits for the function to finish
			console.log('🔍 Fetching company info...');
			const companyInfo = await this.apiService.getCompanyInfo(companyName);
			console.log('✅ Company info received:', companyInfo);

			console.log('🔍 Fetching jobs...');
			const jobs = await this.apiService.getCompanyJobs(companyName);
			console.log('✅ Jobs received:', jobs.length, 'jobs');

			// STEP 5: Calculate match scores for each job
			console.log('🎯 Calculating match scores...');
			const jobsWithScores = jobs.map((job) => {
				const matchScore = this.apiService.calculateMatchScore(job, userSkills);

				// "..." is the spread operator - copies all properties
				// Then we add matchScore
				return {
					...job,
					matchScore,
				};
			});

			// STEP 6: Sort jobs by match score (highest first)
			// "sort" rearranges the array
			// "(a, b) => b.score - a.score" means descending order
			const sortedJobs = jobsWithScores.sort(
				(a, b) => (b.matchScore || 0) - (a.matchScore || 0)
			);

			console.log('📊 Jobs sorted by match score');

			// STEP 7: Prepare response
			const response: CompanyOverviewResponse = {
				success: true,
				data: {
					company: companyInfo,
					jobs: sortedJobs,
				},
			};

			// STEP 8: Send response back to frontend
			// "res.json()" sends JSON data
			// Status 200 means "OK, success"
			console.log('✉️  Sending response to frontend');
			res.status(200).json(response);
		} catch (error) {
			// If anything goes wrong, this runs
			console.error('❌ Error in getCompanyOverview:', error);

			// Send error response to frontend
			// Status 500 means "Internal Server Error"
			res.status(500).json({
				success: false,
				error: 'Failed to fetch company overview',
			});
		}
	};

	/**
	 * Handles GET /api/companies/:companyName/jobs
	 * Get just the jobs (no company info)
	 */
	getCompanyJobs = async (req: Request, res: Response) => {
		try {
			const { companyName } = req.params;
			console.log('Received request for jobs at:', companyName);

			const jobs = await this.apiService.getCompanyJobs(companyName);

			res.status(200).json({
				success: true,
				data: jobs,
			});
		} catch (error) {
			console.error('Error in getCompanyJobs:', error);
			res.status(500).json({
				success: false,
				error: 'Failed to fetch jobs',
			});
		}
	};

	/**
	 * Handles GET /api/companies/:companyName/jobs/:jobId
	 * Get specific job details by ID
	 */
	getJobDetails = async (req: Request, res: Response) => {
		try {
			const { jobId } = req.params;
			console.log('📞 Received request for job details:', jobId);

			// Fetch job by ID
			const job = await this.apiService.getJobById(jobId);

			// Get user's skills (hardcoded for now)
			const userSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript'];

			// Calculate match score
			const matchScore = this.apiService.calculateMatchScore(job, userSkills);

			// Prepare response
			const response: JobDetailsResponse = {
				success: true,
				data: {
					...job,
					matchScore,
				},
			};

			console.log('✉️  Sending job details to frontend');
			res.status(200).json(response);
		} catch (error) {
			console.error('❌ Error in getJobDetails:', error);
			res.status(500).json({
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to fetch job details',
			});
		}
	};
}
