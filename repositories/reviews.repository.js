import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/reviews.json")

function findAll() {
    const data = fs.readFileSync(filePath, "utf-8");

    if (!data) return [];

    return JSON.parse(data);
}

function findById(id){
    const allReviews = findAll();

    return allReviews.find(a => a.id === id) || null;
}

function findByAlbumId(albumId){
    const allReviews = findAll();

    return allReviews.filter(r => r.albumId === albumId);
}

function saveReview(newReview) {
    const allReviews = findAll();

    allReviews.push(newReview);

    fs.writeFileSync(filePath, JSON.stringify(allReviews, null, 2), 'utf-8');
}

function updateReview(updatedReview) {
    const allReviews = findAll();

    const index = allReviews.findIndex(r => r.id === updatedReview.id);

    if (index === -1) {
        return false; 
    }

    allReviews[index] = updatedReview;

    fs.writeFileSync(filePath, JSON.stringify(allReviews, null, 2), "utf-8");

    return true;
}

function deleteByReviewId(id) {
    const allReviews = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');

    const index = allReviews.findIndex(r => r.id === id);

    if (index === -1) {
        return false;
    }

    allReviews.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(allReviews, null, 2), 'utf-8');

    return true;
}

export default {
  findAll,
  findById,
  findByAlbumId,
  saveReview,
  updateReview,
  deleteByReviewId
};
