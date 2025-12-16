import { Router } from 'express';
import {
	googleAuth,
	logOut,
	signUp,
	logIn,
	authMe,
} from '../controllers/controllerSignin.js';

const router = Router();

router.post('/google', googleAuth);
router.post('/signup', signUp);
router.post('/logout', logOut);
router.post('/login', logIn);
router.post('/me', authMe);

export default router;
