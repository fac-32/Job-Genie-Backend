// backend/src/controllers/companyController.ts

// Import types from Express (the web framework)
import { Request, Response } from 'express';
// Import our services
import { DummyApiService } from '../services/dummyApiService.js';
import { RealJobsApiService } from '../services/realJobsApi.service.js';
import { JobGeneratorService } from '../services/jobGenerator.service.js';
import { JobDatabaseService } from '../services/jobDatabase.service.js';
// Import our types
import {
	CompanyOverviewResponse,
	JobDetailsResponse,
	Job,
} from '../types/index.js';

// "export class" so we can use this in other files
export class CompanyController {
	// "private" means only this class can access it
	private apiService: DummyApiService;
	private realJobsApi: RealJobsApiService;
	private jobGenerator: JobGeneratorService;
	private jobDatabase: JobDatabaseService;

	// "constructor" runs when you create a new CompanyController
	constructor() {
		// Create instances of all our services
		this.apiService = new DummyApiService();
		this.realJobsApi = new RealJobsApiService();
		this.jobGenerator = new JobGeneratorService();
		this.jobDatabase = new JobDatabaseService();
	}

	/**
	 * Handles GET /api/companies/:companyName/overview
	 * OPTION C: Try Real API → Then AI → Then Mock Data
	 */
	getCompanyOverview = async (req: Request, res: Response) => {
		try {
			const { companyName } = req.params;
			console.log('\n' + '='.repeat(50));
			console.log('📞 REQUEST: Company Overview for', companyName);
			console.log('='.repeat(50));

			// Get user's skills (hardcoded for now)
			const userSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript'];

			// STEP 1: Get company info (from mock data for now)
			console.log('🔍 Fetching company info...');
			const companyInfo = await this.apiService.getCompanyInfo(companyName);
			console.log('✅ Company info received');

			// STEP 2: Try to get jobs (OPTION C: Multi-source strategy)
			let jobs: Job[] = [];

			// Try 1: Check Supabase database first
			console.log('\n📊 ATTEMPT 1: Checking Supabase database...');
			const dbJobs = await this.jobDatabase.getJobsByCompany(companyName);
			if (dbJobs.length > 0) {
				console.log(`✅ SUCCESS: Found ${dbJobs.length} jobs in database`);
				jobs = dbJobs;
			} else {
				// Try 2: Fetch from real job API (Adzuna)
				console.log('📊 ATTEMPT 2: Fetching from Adzuna API...');
				const realJobs = await this.realJobsApi.fetchRealJobs(companyName);

				if (realJobs.length > 0) {
					console.log(
						`✅ SUCCESS: Found ${realJobs.length} real jobs from Adzuna`
					);
					jobs = realJobs;

					// Save to database for future requests
					console.log('💾 Saving real jobs to database...');
					await this.jobDatabase.saveJobsForCompany(companyName, jobs);
				} else {
					// Try 3: Generate with AI (Claude)
					console.log('📊 ATTEMPT 3: Generating jobs with AI...');
					const aiJobs = await this.jobGenerator.generateJobsForCompany(
						companyInfo,
						5
					);

					if (aiJobs.length > 0) {
						console.log(`✅ SUCCESS: Generated ${aiJobs.length} AI jobs`);
						jobs = aiJobs;

						// Save to database
						console.log('💾 Saving AI jobs to database...');
						await this.jobDatabase.saveJobsForCompany(companyName, jobs);
					} else {
						// Try 4: Fallback to mock data
						console.log('📊 ATTEMPT 4: Using mock data fallback...');
						jobs = await this.apiService.getCompanyJobs(companyName);
						console.log(`✅ Using ${jobs.length} mock jobs`);
					}
				}
			}

			// STEP 3: Calculate match scores
			console.log('\n🎯 Calculating match scores...');
			const jobsWithScores = jobs.map((job) => {
				const matchScore = this.apiService.calculateMatchScore(job, userSkills);
				return { ...job, matchScore };
			});

			// STEP 4: Sort by match score
			const sortedJobs = jobsWithScores.sort(
				(a, b) => (b.matchScore || 0) - (a.matchScore || 0)
			);

			// STEP 5: Send response
			const response: CompanyOverviewResponse = {
				success: true,
				data: {
					company: companyInfo,
					jobs: sortedJobs,
				},
			};

			console.log('✉️  Sending response with', sortedJobs.length, 'jobs');
			console.log('='.repeat(50) + '\n');
			res.status(200).json(response);
		} catch (error) {
			console.error('❌ Error in getCompanyOverview:', error);
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
