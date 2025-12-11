import { describe, it, expect } from 'vitest';
import { deleteRelationshipUserOrg } from './deleteRelationshipUserOrg';

describe('deleteRelationshipUserOrg', () => {
	it('should delete relationships between specific user and specific organisations', async () => {
		const result = await deleteRelationshipUserOrg(8, [1, 2]);

		expect(result).toBeDefined();
		expect(result.success).toBe(true);
		expect(result.deletedCount).toBe(2);
	});
});
