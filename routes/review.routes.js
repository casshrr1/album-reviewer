import express from 'express';
import reviewController from '../controllers/review.controller.js';

const router = express.Router();

// GET /reviews/album/:albumId - get all reviews for a specific album
router.get('/album/:albumId', reviewController.getReviewsByAlbum);

// POST /reviews - add a new review
router.post('/', reviewController.addReview);

// PUT /reviews/:id - update a review
router.put('/:id', reviewController.updateReview);

// DELETE /reviews/:id - delete a review
router.delete('/:id', reviewController.deleteReview);

export default router;