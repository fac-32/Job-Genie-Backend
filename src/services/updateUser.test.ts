import { describe, it, expect } from 'vitest';
import { updateUser } from './updateUser';

const updateUserData1 = {
	email: 'sharon@sharon.com',
	first_name: 'Sharon',
	last_name: 'McMansion',
	phone: '077934942023',
	loc_postcode: 'SE5 8RL',
	loc_country: 'France',
	search_radius: 10,
};

const updateUserData2 = {
	search_radius: 50,
};

const updateUserData3 = {
	email: 'notsharon@notsharon.com',
	loc_country: 'Belgium',
};

describe('updateUser', () => {
	it('should update a users details in the database, but only the properties provided in the object', async () => {
		const resultOne = await updateUser('SampleSally', updateUserData1);

		expect(resultOne).toBeDefined();
		expect(Array.isArray(resultOne)).toBe(true);
		expect(resultOne.length).toBeGreaterThan(0);

		const amendedUserDataOne = resultOne[0];
		expect(amendedUserDataOne.username).toBe('SampleSally');
		expect(amendedUserDataOne.email).toBe(updateUserData1.email);
		expect(amendedUserDataOne.first_name).toBe(updateUserData1.first_name);
		expect(amendedUserDataOne.last_name).toBe(updateUserData1.last_name);
		expect(amendedUserDataOne.phone).toBe(updateUserData1.phone);
		expect(amendedUserDataOne.loc_country).toBe(updateUserData1.loc_country);
		expect(amendedUserDataOne.loc_postcode).toBe(updateUserData1.loc_postcode);
	});

	it('should update a users details in the database, but only the properties provided in the object', async () => {
		const resultTwo = await updateUser('SampleSally', updateUserData2);

		expect(resultTwo).toBeDefined();
		expect(Array.isArray(resultTwo)).toBe(true);
		expect(resultTwo.length).toBeGreaterThan(0);

		const amendedUserDataTwo = resultTwo[0];
		expect(amendedUserDataTwo.username).toBe('SampleSally');
		expect(amendedUserDataTwo.email).toBe(updateUserData1.email);
		expect(amendedUserDataTwo.first_name).toBe(updateUserData1.first_name);
		expect(amendedUserDataTwo.last_name).toBe(updateUserData1.last_name);
		expect(amendedUserDataTwo.phone).toBe(updateUserData1.phone);
		expect(amendedUserDataTwo.loc_country).toBe(updateUserData1.loc_country);
		expect(amendedUserDataTwo.loc_postcode).toBe(updateUserData1.loc_postcode);
		expect(amendedUserDataTwo.search_radius).toBe(
			amendedUserDataTwo.search_radius
		);
	});
});
