import { Company } from '../data/companies.js';
import Anthropic from '@anthropic-ai/sdk';

interface FilterInput {
	industry?: string;
	size?: string;
	city?: string;
	country?: string;
}

interface ClaudeGeneratedCompany {
	name: string;
	industry: string;
	size: '1-50' | '51-200' | '201-500' | '500+';
	city: string;
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}

export const generateWishlist = async (
	filters: FilterInput
): Promise<Company[]> => {
	const anthropic = new Anthropic({
		apiKey: process.env.ANTHROPIC_API_KEY,
	});

	// Build the prompt based on filters
	const prompt = buildPrompt(filters);

	try {
		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 2000,
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
		});

		// Extract the text content from Claude's response
		const textContent = message.content.find((block) => block.type === 'text');
		if (!textContent || textContent.type !== 'text') {
			throw new Error('No text content in Claude response');
		}

		// Parse the JSON response from Claude
		const generatedCompanies: ClaudeGeneratedCompany[] = JSON.parse(
			textContent.text
		);

		// Convert to our Company format with IDs and logos
		const companies: Company[] = generatedCompanies.map((company, index) => ({
			name: company.name,
			industry: company.industry,
			size: company.size,
			city: company.city,
			country: company.country,
			description: company.description,
			logoUrl: `https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
			websiteUrl: company.websiteUrl,
		}));

		return companies;
	} catch (error) {
		console.error('Error generating wishlist with Claude:', error);
		throw new Error('Failed to generate wishlist');
	}
};

function buildPrompt(filters: FilterInput): string {
	let prompt = `Generate a list of 4 realistic companies for a job search wishlist. Return ONLY a valid JSON array with no preamble, explanation, or markdown formatting.

Each company should have this exact structure:
{
  "name": "Company Name",
  "industry": "Industry Type",
  "size": "1-50" | "51-200" | "201-500" | "500+",
  "city": "city name",
  "country": "country name",
  "description": "Brief description",
  "websiteUrl": "link to official company website"
}

Requirements:
`;

	if (filters.industry) {
		prompt += `- Industry: Focus on companies in the ${filters.industry} industry\n`;
	} else {
		prompt += `- Industry: Mix of tech companies across various sectors (AI, Fintech, SaaS, Gaming, etc.)\n`;
	}

	if (filters.size) {
		prompt += `- Size: Only include companies with size "${filters.size}"\n`;
	} else {
		prompt += `- Size: Mix of company sizes from startups to large enterprises\n`;
	}

	if (filters.country) {
		if (filters.city) {
			prompt += `- Location: Companies that have offices in ${filters.country} and specificaly in ${filters.city}, or offer remote work\n`;
		} else {
			prompt += `- Location: Companies that have offices in ${filters.country}\n`;
		}
	} else {
		prompt += `- Location: Include a mix of locations, with some remote-friendly companies\n`;
	}

	prompt += `
- Include only real companies(e.g., OpenAI, Stripe, Figma)
- Descriptions should be 1-2 sentences highlighting what makes each company interesting

Return ONLY the JSON array, nothing else.`;

	return prompt;
}
