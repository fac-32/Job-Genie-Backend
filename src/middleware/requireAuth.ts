import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const sbToken = req.cookies['sb_token'];

	if (!sbToken) {
		res.status(401).json({ success: false, error: 'No session token' });
		return;
	}

	const { data, error } = await supabase.auth.getUser(sbToken);

	if (error || !data.user) {
		res.clearCookie('sb_token', { path: '/' });
		res.status(401).json({ success: false, error: 'Invalid or expired token' });
		return;
	}

	const { data: userRow, error: userError } = await supabase
		.from('Users')
		.select('email, username, first_name, last_name, phone')
		.eq('auth_user_id', data.user.id)
		.single();

	if (userError || !userRow) {
		res.status(401).json({ success: false, error: 'User profile not found' });
		return;
	}

	(req as any).user = {
		id: data.user.id,
		email: userRow.email,
		given_name: userRow.first_name,
		name: `${userRow.first_name ?? ''} ${userRow.last_name ?? ''}`.trim(),
		phone: userRow.phone,
		username: userRow.username,
	};
	next();
};
