import { OAuth2Client, TokenPayload } from 'google-auth-library';
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
			res
				.status(401)
				.json({ success: false, message: 'Invalid token payload' });
			return;
		}
		res.json({ success: true, user: payload });
	} catch (error) {
		console.error('Token verification failed:', error);
		res.status(401).json({ success: false, message: 'Invalid token' });
	}
};
