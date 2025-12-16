import { Router } from 'express';
import { getJobsForWishlist } from '../controllers/jobsController.js';

const router = Router();

router.post('/', getJobsForWishlist);

export default router;
