import { Router } from 'express';
import {
	googleAuth,
	logOut,
	signUp,
	logIn,
} from '../controllers/controllerSignin.js';

const router = Router();

router.post('/google', googleAuth);
router.post('/signup', signUp);
router.post('/logout', logOut);
router.post('/login', logIn);

export default router;
