/**
 * Review Controller
 * -----------------
 * Handles all HTTP requests related to album reviews.
 * Responsible for:
 *  - Creating, updating, and deleting reviews
 *  - Reading route parameters (albumId, id) and request bodies
 *  - Delegating business logic to the review service layer
 *  - Returning appropriate HTTP status codes and JSON responses
 */


import reviewService from '../services/review.service.js';

// GET /reviews/:albumId
async function getReviewsByAlbum(req, res) {
    try {
        const albumId = parseInt(req.params.albumId);
        const reviews = await reviewService.getReviewsByAlbumId(albumId);

        if (!reviews || reviews.length === 0) {
        return res.status(200).json([]);
        }

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /reviews
async function addReview(req, res) {
    try {
        const { albumId, rating, review } = req.body;
        const newReview = await reviewService.addReview(albumId, rating, review);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// PUT /reviews/:id
async function updateReview(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { rating, review } = req.body;
        const updatedReview = await reviewService.updateReview(id, rating, review);

        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETE /reviews/:id - delete a review
async function deleteReview(req, res) {
    try {
        const reviewId = parseInt(req.params.id);
        const deleted = await reviewService.deleteByReviewId(reviewId);

        if (!deleted) return res.status(404).json({ error: "Review not found" });
        
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export default {
    getReviewsByAlbum,
    addReview,
    updateReview,
    deleteReview
};
