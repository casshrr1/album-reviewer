import albumRepository from '../repositories/album.repository.js';
import reviewService from './review.service.js';
import artistRepository from '../repositories/artist.repository.js';
import Album from '../models/album.js';

const now = new Date();
const current_year = now.getFullYear();

function getAverageRating(albumId) {
    const reviews = reviewService.getReviewsByAlbumId(albumId);
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
}

function getAlbumById(albumId) {
    return albumRepository.findById(albumId) || null;
}

function getAlbumsByArtistId(artistId) {
    const id = Number(artistId);
    return albumRepository.findAll().map(a => ({ ...a, id: Number(a.id), artistId: Number(a.artistId) })).filter(a => a.artistId === id);
}


function getAllAlbums() {
    return albumRepository.findAll();
}

function addAlbum(name, genre, release_year, artistId) {
    if (!name || !artistId) {
        throw new Error('Album must have a name and artistId');
    }

    if (release_year && release_year > current_year) {
        throw new Error("Release year can't be in the future");
    }
    const albums = albumRepository.findAll();
    const maxId = albums.length === 0
    ? 0
    : Math.max(...albums.map(a => Number(a.id)));
        
    const newId = maxId + 1;
    const newAlbum = new Album(newId, name, genre, release_year, artistId);
    albumRepository.saveAlbum(newAlbum);

    return newAlbum;
    
}

function deleteByAlbumId(id) {
    const album = albumRepository.findById(id);

    if (!album) {
        throw new Error('The Album is non-existent');
    } else {
        return albumRepository.deleteByAlbumId(id);
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