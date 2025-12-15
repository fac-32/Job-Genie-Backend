// Service to generate jobs using Claude AI as fallback
import Anthropic from '@anthropic-ai/sdk';
import { Job, Company } from '../types/index.js';

interface ClaudeGeneratedJob {
	title: string;
	location: string;
	description: string;
	requirements: string[];
	experienceLevel: string;
	salary?: {
		min: number;
		max: number;
	};
}

export class JobGeneratorService {
	private anthropic: Anthropic;

	constructor() {
		this.anthropic = new Anthropic({
			apiKey: process.env.ANTHROPIC_API_KEY,
		});
	}

	/**
	 * Generate realistic jobs for a company using Claude AI
	 * @param company - Company information
	 * @param jobCount - Number of jobs to generate (default 5)
	 * @returns Array of AI-generated jobs
	 */
	async generateJobsForCompany(
		company: Company,
		jobCount: number = 5
	): Promise<Job[]> {
		if (!process.env.ANTHROPIC_API_KEY) {
			console.log('⚠️  Claude API key not found, cannot generate jobs');
			return [];
		}

		try {
			console.log(
				`🤖 Generating ${jobCount} AI jobs for ${company.name} with Claude...`
			);

			const prompt = this.buildPrompt(company, jobCount);

			const message = await this.anthropic.messages.create({
				model: 'claude-sonnet-4-20250514',
				max_tokens: 3000,
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
			});

			// Extract text content
			const textContent = message.content.find(
				(block) => block.type === 'text'
			);
			if (!textContent || textContent.type !== 'text') {
				throw new Error('No text content in Claude response');
			}

			// Parse JSON response
			const generatedJobs: ClaudeGeneratedJob[] = JSON.parse(textContent.text);

			// Convert to our Job format
			const jobs: Job[] = generatedJobs.map((job, index) => ({
				id: `${company.name.toLowerCase()}-ai-${index + 1}`,
				title: job.title,
				company: company.name,
				location: job.location,
				description: job.description,
				requirements: job.requirements,
				experienceLevel: job.experienceLevel,
				jobUrl: `${company.websiteUrl || company.website || 'https://example.com'}/careers`, // Generic careers link
				salary: job.salary,
			}));

			console.log(`✅ Generated ${jobs.length} AI jobs successfully`);
			return jobs;
		} catch (error) {
			console.error('❌ Error generating jobs with Claude:', error);
			return [];
		}
	}

	/**
	 * Build the prompt for Claude to generate jobs
	 */
	private buildPrompt(company: Company, jobCount: number): string {
		return `Generate ${jobCount} realistic job listings for ${company.name}.

Company Information:
- Name: ${company.name}
- Industry: ${company.industry}
- Size: ${company.size}
- Description: ${company.description}

Generate jobs that match the company's industry and size. Include a mix of experience levels.

Return ONLY a valid JSON array with this EXACT structure (no markdown, no explanation):
[
  {
    "title": "Job Title Here",
    "location": "City, Country",
    "description": "A detailed 2-3 sentence description of the role and responsibilities.",
    "requirements": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "experienceLevel": "entry-level | mid-level | senior | intern | graduate",
    "salary": {
      "min": 40000,
      "max": 60000
    }
  }
]

Important:
- Make titles specific and realistic (e.g., "Senior Frontend Engineer" not just "Developer")
- Include diverse roles appropriate for ${company.industry}
- Use realistic UK salaries for the experience level
- Make descriptions professional and specific to the company
- Include 4-6 relevant technical skills per job
- Mix of experience levels: some junior, some senior`;
	}
}
