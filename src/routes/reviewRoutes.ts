import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';
import { summarizeReviews } from '../controllers/aiController';

const router = express.Router();

router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', createReview);
router.put('/:productId/reviews/:id', updateReview);
router.delete('/:productId/reviews/:id', deleteReview);
router.get('/:id/reviews/summary', summarizeReviews);

export default router;