import albumRepository from '../repositories/album.repositoryDb.js';
import reviewService from './review.service.js';


const now = new Date();
const current_year = now.getFullYear();

async function getAverageRating(albumId) {
    const reviews = await reviewService.getReviewsByAlbumId(albumId);
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
}

async function getAlbumById(albumId) {
    return await albumRepository.findById(albumId) || null;
}

async function getAlbumsByArtistId(artistId) {
    const id = Number(artistId);
    const albums = await albumRepository.findAll();

    return albums
        .map(a => ({ ...a, id: Number(a.id), artistId: Number(a.artistId) }))
        .filter(a => a.artistId === id);
}


async function getAllAlbums() {
    return await albumRepository.findAll();
}

async function addAlbum(name, genre, release_year, artistId) {
    if (!name || !artistId) {
        throw new Error('Album must have a name and artistId');
    }

    if (release_year && release_year > current_year) {
        throw new Error("Release year can't be in the future");
    }
    
    const newAlbum = {
        name,
        genre,
        release_year,
        artistId
    };

    const savedAlbum = await albumRepository.saveAlbum(newAlbum);

    return savedAlbum;
    
}

async function deleteByAlbumId(id) {
    const album = await albumRepository.findById(id);

    if (!album) {
        throw new Error('The Album is non-existent');
    } else {
        return await albumRepository.deleteByAlbumId(id);
    }
}

export default {
    getAverageRating,
    getAlbumById,
    getAlbumsByArtistId,
    getAllAlbums,
    addAlbum,
    deleteByAlbumId
};