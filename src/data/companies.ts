export interface Company {
	id: string;
	name: string;
	industry: string;
	size: '1-50' | '51-200' | '201-500' | '500+';
	locations: string[];
	description: string;
	logoUrl?: string;
}

export const companies: Company[] = [
	{
		id: '1',
		name: 'OpenAI',
		industry: 'Artificial Intelligence',
		size: '500+',
		locations: ['San Francisco', 'Remote'],
		description: 'AI research and deployment company.',
		logoUrl: 'https://logo.clearbit.com/openai.com',
	},
	{
		id: '2',
		name: 'Stripe',
		industry: 'Fintech',
		size: '500+',
		locations: ['San Francisco', 'Dublin', 'Remote'],
		description: 'Payments infrastructure for the internet.',
		logoUrl: 'https://logo.clearbit.com/stripe.com',
	},
	{
		id: '3',
		name: 'Figma',
		industry: 'Design',
		size: '201-500',
		locations: ['San Francisco', 'New York', 'Remote'],
		description: 'Collaborative interface design tool.',
		logoUrl: 'https://logo.clearbit.com/figma.com',
	},
	{
		id: '4',
		name: 'Notion',
		industry: 'Productivity',
		size: '201-500',
		locations: ['San Francisco', 'Remote'],
		description: 'Connected workspace for docs, notes, and tasks.',
		logoUrl: 'https://logo.clearbit.com/notion.so',
	},
	{
		id: '5',
		name: 'Canva',
		industry: 'Design',
		size: '500+',
		locations: ['Sydney', 'Remote'],
		description: 'Online visual design platform.',
		logoUrl: 'https://logo.clearbit.com/canva.com',
	},
	{
		id: '6',
		name: 'Datadog',
		industry: 'Cloud Monitoring',
		size: '500+',
		locations: ['New York', 'Boston', 'Remote'],
		description: 'Cloud-scale monitoring and analytics.',
		logoUrl: 'https://logo.clearbit.com/datadoghq.com',
	},
	{
		id: '7',
		name: 'FAC',
		industry: 'Software Training',
		size: '1-50',
		locations: ['London'],
		description: 'Software Engineering Course.',
		logoUrl: 'https://www.foundersandcoders.com/',
	},
	{
		id: '8',
		name: 'Byte Forge',
		industry: 'Game Studio',
		size: '51-200',
		locations: ['London'],
		description: 'A leading AAA game studio.',
		logoUrl: 'https://www.ByteForgeStudio.com/',
	},
];
