/**
 * Artist Controller
 * -----------------
 * Handles all HTTP requests related to artists.
 * Responsible for:
 *  - Parsing request parameters and body data
 *  - Calling the artist service layer
 *  - Returning appropriate HTTP status codes and JSON responses
 */


import artistService from '../services/artist.service.js';

// GET /artists
function getAllArtists(req, res) {
    try {
        const artists = artistService.getAllArtists();
        res.status(200).json(artists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /artists/:id - get a single artist
function getArtistById(req, res) {
    try {
        const artistId = parseInt(req.params.id);
        const artist = artistService.getArtistById(artistId);

        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        res.status(200).json(artist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /artists
function addArtist(req, res) {
    try {
        const { name, genre, debut_year } = req.body;
        const newArtist = artistService.addArtist(name, genre, debut_year);
        res.status(201).json(newArtist);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETE /artists/:id
function deleteArtist(req, res) {
    try {
        const artistId = parseInt(req.params.id);
        const success = artistService.deleteByArtistId(artistId);

        if (!success) return res.status(404).json({ error: "Artist not found" });

        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export default {
    getAllArtists,
    getArtistById,
    addArtist,
    deleteArtist
};
