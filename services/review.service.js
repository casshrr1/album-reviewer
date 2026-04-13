import reviewRepository from '../repositories/reviews.repositoryDb.js';
import albumRepository from '../repositories/album.repositoryDb.js'; 

function getTodayDate() {
    const now = new Date();
    return `${now.getDate().toString().padStart(2,'0')}.` +
           `${(now.getMonth()+1).toString().padStart(2,'0')}.` +
           `${now.getFullYear()}`;
}

function formatReviewResponse(reviewRow) {
    if (!reviewRow) return null;

    return {
        id: Number(reviewRow.id),
        albumId: Number(reviewRow.albumId),
        rating: Number(reviewRow.rating),
        review: reviewRow.comment,
        date: reviewRow.date
    };
}

async function addReview(albumId, rating, review) {
    const album = await albumRepository.findById(albumId);

    if (!album) {
        throw new Error("Album not found");
    }

    if (rating > 10 || rating < 0) {
        throw new Error("Rating has to be between 0 and 10");
    }

    const newReview = {
        albumId: Number(albumId),
        rating: Number(rating),
        comment: review,
        date: getTodayDate()
    };

    const savedReview = await reviewRepository.saveReview(newReview);
    return formatReviewResponse(savedReview);
}

async function updateReview(id, newRating, newText) {
    const review = await getReviewById(id);

    if (!review) {
        throw new Error("The review is non existent");
    }

    if (newRating > 10 || newRating < 0) {
        throw new Error("The Rating has to be between 0 and 10");
    }

    const updatedReview = {
        rating: Number(newRating),
        comment: newText,
        date: getTodayDate()
    };

    const saved = await reviewRepository.updateReview(id, updatedReview);
    return formatReviewResponse(saved);
}

async function getReviewsByAlbumId(albumId) {
    const reviews = await reviewRepository.findByAlbumId(Number(albumId));
    return reviews.map(formatReviewResponse);
}

async function getReviewById(id) {
    const review = await reviewRepository.findById(id);
    return formatReviewResponse(review);
}

async function deleteByReviewId(id) {
    const review = await reviewRepository.findById(id);

    if (!review) {
        throw new Error('The Review is non-existent');
    }

    return await reviewRepository.deleteByReviewId(id);
}

export default {
    addReview,
    getReviewsByAlbumId,
    updateReview,
    deleteByReviewId
};