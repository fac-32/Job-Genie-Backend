import express from 'express';

import {
	addToWishlist,
	deleteFromWishlist,
	getAllWishlist,
	generateWishlistFromFilters,
} from '../controllers/wishlist.controller.js';

const router = express.Router();

router.get('/', getAllWishlist);
router.post('/', addToWishlist);
router.delete('/', deleteFromWishlist);
router.post('/generate', generateWishlistFromFilters);

export default router;
