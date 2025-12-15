// Service to manage jobs in Supabase Wishlist table
import { supabase } from '../config/supabase.js';
import { Job } from '../types/index.js';

export class JobDatabaseService {
	/**
	 * Get jobs for a company from Supabase
	 * @param companyName - Name of the company
	 * @returns Array of jobs or empty array
	 */
	async getJobsByCompany(companyName: string): Promise<Job[]> {
		try {
			if (!supabase) {
				console.log('⚠️  Supabase not available');
				return [];
			}

			console.log(`📊 Fetching jobs from database for: ${companyName}`);

			const { data, error } = await supabase
				.from('Wishlist')
				.select('jobs')
				.ilike('name', companyName) // Case-insensitive match
				.single();

			if (error) {
				console.log(`ℹ️  Company not in database: ${error.message}`);
				return [];
			}

			if (!data || !data.jobs) {
				console.log('ℹ️  No jobs found in database for this company');
				return [];
			}

			console.log(`✅ Found ${data.jobs.length} jobs in database`);
			return data.jobs as Job[];
		} catch (error) {
			console.error('❌ Error fetching jobs from database:', error);
			return [];
		}
	}

	/**
	 * Save jobs to Supabase for a company
	 * @param companyName - Name of the company
	 * @param jobs - Array of jobs to save
	 * @returns Success boolean
	 */
	async saveJobsForCompany(companyName: string, jobs: Job[]): Promise<boolean> {
		try {
			if (!supabase) {
				console.log('⚠️  Supabase not available, cannot save jobs');
				return false;
			}

			console.log(
				`💾 Saving ${jobs.length} jobs to database for: ${companyName}`
			);

			// First, check if company exists in Wishlist
			const { data: existingCompany, error: fetchError } = await supabase
				.from('Wishlist')
				.select('id, name')
				.ilike('name', companyName)
				.single();

			if (fetchError || !existingCompany) {
				console.log('ℹ️  Company not in Wishlist table yet, jobs not saved');
				return false;
			}

			// Update the jobs column
			const { error: updateError } = await supabase
				.from('Wishlist')
				.update({ jobs: jobs })
				.eq('id', existingCompany.id);

			if (updateError) {
				console.error('❌ Error saving jobs:', updateError);
				return false;
			}

			console.log('✅ Jobs saved successfully to database');
			return true;
		} catch (error) {
			console.error('❌ Error in saveJobsForCompany:', error);
			return false;
		}
	}

	/**
	 * Check if a company has jobs in the database
	 * @param companyName - Name of the company
	 * @returns True if company has jobs
	 */
	async hasJobs(companyName: string): Promise<boolean> {
		try {
			if (!supabase) {
				return false;
			}

			const { data, error } = await supabase
				.from('Wishlist')
				.select('jobs')
				.ilike('name', companyName)
				.single();

			if (error || !data || !data.jobs) {
				return false;
			}

			return data.jobs.length > 0;
		} catch (error) {
			return false;
		}
	}
}
