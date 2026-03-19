import { Company } from '../data/companies.js';
import Anthropic from '@anthropic-ai/sdk';
import { anthropicApiKey } from '../config/environment.js';

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
	websiteUrl: string;
}

const GENERATE_COMPANIES_TOOL: Anthropic.Tool = {
	name: 'generate_companies',
	description: 'Generate a list of companies for a job search wishlist',
	input_schema: {
		type: 'object',
		properties: {
			generatedCompanies: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						industry: { type: 'string' },
						size: {
							type: 'string',
							enum: ['1-50', '51-200', '201-500', '500+'],
						},
						city: { type: 'string' },
						country: { type: 'string' },
						description: { type: 'string' },
						websiteUrl: { type: 'string' },
					},
					required: [
						'name',
						'industry',
						'size',
						'city',
						'country',
						'description',
						'websiteUrl',
					],
				},
			},
		},
		required: ['generatedCompanies'],
	},
};

export const generateWishlist = async (
	filters: FilterInput
): Promise<Company[]> => {
	const anthropic = new Anthropic({
		apiKey: anthropicApiKey,
	});

	const prompt = buildPrompt(filters);

	try {
		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 2000,
			tools: [GENERATE_COMPANIES_TOOL],
			tool_choice: { type: 'tool', name: 'generate_companies' },
			messages: [{ role: 'user', content: prompt }],
		});

		const toolUse = message.content.find((block) => block.type === 'tool_use');
		if (!toolUse || toolUse.type !== 'tool_use') {
			throw new Error('Claude did not return a tool_use block');
		}
		const { generatedCompanies } = toolUse.input as {
			generatedCompanies: ClaudeGeneratedCompany[];
		};
		if (!Array.isArray(generatedCompanies)) {
			throw new Error('Claude tool response missing generatedCompanies array');
		}

		// Convert to our Company format with IDs and logos
		const companies: Company[] = generatedCompanies.map((company) => ({
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
	let prompt = `Generate a list of 4 realistic companies for a job search wishlist.

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

	prompt += `- Include only real companies (e.g., OpenAI, Stripe, Figma)
- Descriptions should be 1-2 sentences highlighting what makes each company interesting`;

	return prompt;
}
