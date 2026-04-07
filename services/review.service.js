import reviewRepository from '../repositories/reviews.repository.js';
import Review from '../models/review.js';
import albumRepository from '../repositories/album.repository.js'; 

function getTodayDate() {
    const now = new Date();
    return `${now.getDate().toString().padStart(2,'0')}.` +
           `${(now.getMonth()+1).toString().padStart(2,'0')}.` +
           `${now.getFullYear()}`;
}

function addReview(albumId, rating, review) {
    const album = albumRepository.findById(albumId);

    if(!album) {
        throw new Error ("Album not found");
    } else {
        if (rating > 10 || rating < 0) {
            throw new Error ("Rating has to be between 0 and 10");
        } else {
            const reviews = reviewRepository.findAll();
                const maxId = reviews.length === 0
                ? 0
                : Math.max(...reviews.map(a => a.id));

            const newId = maxId + 1; 
            const date = getTodayDate();
            const newReview = new Review(newId, Number(albumId), rating, review, date);

            reviewRepository.saveReview(newReview);
            return newReview;
        }
    }
}

function updateReview(id, newRating, newText) {
    const review = getReviewById(id);

    if (!review) {
        throw new Error("The review is non existent");
    } else {
        if (newRating > 10 || newRating < 0) {
            throw new Error("The Rating has to be between 0 and 10");
        } else {
            review.rating = newRating;
            review.review = newText;
            review.date = getTodayDate();

            reviewRepository.updateReview(review);
            return review;
        }
    }
}

function getReviewsByAlbumId(albumId) {
    const allReviews = reviewRepository.findAll();
    const id = Number(albumId); 
    const reviews = allReviews.filter(r => Number(r.albumId) === id);
    return reviews; 
};

function getReviewById(id) {
    return reviewRepository.findById(id);
};

function deleteByReviewId(id) {
    const review = reviewRepository.findById(id);

    if (!review) {
        throw new Error('The Review is non-existent');
    } else {
        return reviewRepository.deleteByReviewId(id);
    }
};

export default {
    addReview,
    getReviewsByAlbumId,
    updateReview,
    deleteByReviewId
};