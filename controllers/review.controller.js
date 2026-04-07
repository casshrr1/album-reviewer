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
function getReviewsByAlbum(req, res) {
    try {
        const albumId = parseInt(req.params.albumId);
        const reviews = reviewService.getReviewsByAlbumId(albumId);

        if (!reviews) return res.status(404).json({ error: "No reviews found" });

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /reviews
function addReview(req, res) {
    try {
        const { albumId, rating, review } = req.body;
        const newReview = reviewService.addReview(albumId, rating, review);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// PUT /reviews/:id
function updateReview(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { rating, review } = req.body;
        const updatedReview = reviewService.updateReview(id, rating, review);

        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETE /reviews/:id - delete a review
function deleteReview(req, res) {
    try {
        const reviewId = parseInt(req.params.id);
        const deleted = reviewService.deleteByReviewId(reviewId);

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
