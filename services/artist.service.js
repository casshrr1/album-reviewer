import Artist from '../models/artist.js';
import artistRepository from '../repositories/artist.repository.js';

const artistExists = (name) => {
    const artists = artistRepository.findAll();

    return artists.some(
        artist => artist.name.toLowerCase() === name.toLowerCase()
    );
};

function getAllArtists() {
    return artistRepository.findAll();
}

function getArtistById(id) {
    return artistRepository.findById(id) || null;
}

function addArtist(name, genre, debut_year) {
    if(artistExists(name)) {
        throw new Error("Artist already exists");
    } else {
        const artists = artistRepository.findAll();
        const maxId = artists.length === 0
        ? 0
        : Math.max(...artists.map(a => a.id));

        const newId = maxId + 1;
        const newArtist = new Artist(newId, name, genre, debut_year);

        artistRepository.saveArtist(newArtist);
        return newArtist;
    }
}

function deleteByArtistId(id) {
    const artist = artistRepository.findById(id);

    if(!artist) {
        return false;
    } else {
        return artistRepository.deleteByArtistId(id);
    }
}

export default {
    getAllArtists,
    getArtistById,
    addArtist,
    deleteByArtistId
};