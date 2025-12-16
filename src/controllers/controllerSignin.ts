import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(
	token: string
): Promise<TokenPayload | undefined> {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return payload; // Contains user info: email, name, picture, sub (unique ID)
}

export const googleAuth = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { token } = req.body;
		const payload = await verifyGoogleToken(token);
		if (!payload) {
			res.status(401).json({ ok: false, message: 'Invalid token payload' });
			return;
		}
		const { data, error } = await supabase.auth.signInWithIdToken({
			provider: 'google',
			token: token,
		});

		if (error || !data.session) {
			console.error(error);
			res.status(401).json({
				ok: false,
				error: error?.message || 'Supabase sign-in failed',
			});
			return;
		}

		res.cookie('sb_token', data.session.access_token, {
			httpOnly: true,
			secure: false, // true in production over HTTPS
			sameSite: 'lax',
			path: '/',
		});

		res.json({
			ok: true,
			email: payload.email,
			given_name: payload.given_name,
			name: payload.name,
			phone: 7424863107,
		});
	} catch (error) {
		console.error('Token verification failed:', error);
		res.status(401).json({ ok: false, message: 'Invalid token' });
	}
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password, firstName, lastName, phone } = req.body;
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					phoneNumber: phone,
				},
			},
		});
		if (error) {
			res.status(400).json({ success: false, message: error.message });
			return;
		}
		res.json({ success: true, user: data.user, session: data.session });
	} catch (error) {
		console.error('Sign-up failed:', error);
		res.status(500).json({ success: false, message: 'Sign-up failed' });
	}
};

async function authenticateUser(
	email: string,
	password: string
): Promise<{ session: any; user: any }> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {
		throw new Error(error.message);
	}
	return { session: data.session, user: data.user };
}

export const logIn = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;
		const { session, user } = await authenticateUser(email, password);

		res.cookie('sb_token', session.access_token, {
			httpOnly: true,
			secure: false, // true in production
			sameSite: 'lax',
			path: '/',
		});
		res.json({
			success: true,
			email: user.email,
			given_name:
				user.user_metadata?.given_name || user.user_metadata?.first_name,
			name: user.user_metadata?.name,
			phone: user.user_metadata?.phoneNumber,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) {
			res.status(400).json({ success: false, message: error.message });
			return;
		}
		res.clearCookie('sb_token', { path: '/' });
		res.json({ success: true, message: 'Logged out successfully' });
	} catch (error) {
		console.error('Logout failed:', error);
		res.status(500).json({ success: false, message: 'Logout failed' });
	}
};

export const authMe = async (req: Request, res: Response): Promise<void> => {
	try {
		// Get Supabase token from cookie
		const sbToken = req.cookies['sb_token'];

		if (!sbToken) {
			res.status(401).json({
				success: false,
				error: 'No session token',
			});
			return;
		}

		// Verify token with Supabase
		const { data, error } = await supabase.auth.getUser(sbToken);
		if (error || !data.user) {
			res.clearCookie('sb_token', { path: '/' });
			res.status(401).json({
				success: false,
				error: 'Invalid/expired token',
			});
			return;
		}

		// Return user data matching frontend expectation
		res.json({
			success: true,
			email: data.user.email,
			given_name:
				data.user.user_metadata?.given_name ||
				data.user.user_metadata?.first_name,
			name: data.user.user_metadata?.name,
			phone: data.user.user_metadata?.phoneNumber,
		});
	} catch (error) {
		console.error('Auth/me error:', error);
		res.status(500).json({
			success: false,
			error: 'Server error',
		});
	}
};
