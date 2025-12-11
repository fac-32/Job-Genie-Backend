import { Router } from 'express';
import { googleAuth } from '../controllers/controllerSignin.js';

const router = Router();

router.post('/google', googleAuth);
// router.post('/signup', signUp);
// router.post('/login', logIn);

export default router;
