/**
 * Album Controller
 * ----------------
 * Handles all HTTP requests related to albums.
 * Responsible for:
 *  - Parsing route parameters (id, artistId)
 *  - Validating input where necessary
 *  - Delegating logic to the album service
 *  - Returning JSON responses and correct HTTP status codes
 */


import albumService from '../services/album.service.js';

async function getAllAlbums(req, res) {
    try {
        const albums = await albumService.getAllAlbums();
        res.status(200).json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAlbumById(req, res) {
    try {
        const albumId = parseInt(req.params.id);
        const album = await albumService.getAlbumById(albumId);

        if (!album) return res.status(404).json({ error: "Album not found" });

        res.status(200).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAlbumsByArtist(req, res) {
    try {
        const artistId = parseInt(req.params.artistId);
        const albums = await albumService.getAlbumsByArtistId(artistId);

        res.status(200).json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function addAlbum(req, res) {
    try {
        const { name, genre, release_year, artistId } = req.body;
        const newAlbum = await albumService.addAlbum(name, genre, release_year, artistId);

        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteAlbum(req, res) {
    try {
        const albumId = parseInt(req.params.id);
        const success = await albumService.deleteByAlbumId(albumId);

        if (!success) return res.status(404).json({ error: "Album not found" });

        res.status(200).json({ message: "Album deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export default {
    getAllAlbums,
    getAlbumById,
    getAlbumsByArtist,
    addAlbum,
    deleteAlbum
};
