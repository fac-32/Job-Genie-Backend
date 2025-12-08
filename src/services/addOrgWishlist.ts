import { supabase } from '../config/supabase';

export async function addOrg(
	name: string,
	city: string,
	country: string,
	industry: string,
	description: string,
	size: string
) {
	const { data, error } = await supabase
		.from('Wishlist')
		.insert({
			name: name,
			city: city,
			country: country,
			industry: industry,
			description: description,
			size: size,
		})
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
