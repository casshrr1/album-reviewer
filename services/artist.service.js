import Artist from '../models/artist.js';
import artistRepository from '../repositories/artist.repositoryDb.js';

const artistExists = async (name) => {
    const artists = await artistRepository.findAll();

    return artists.some(
        artist => artist.name.toLowerCase() === name.toLowerCase()
    );
};

async function getAllArtists() {
    return await artistRepository.findAll();
}

async function getArtistById(id) {
    return await artistRepository.findById(id) || null;
}

async function addArtist(name, genre, debut_year) {
    if(await artistExists(name)) {
        throw new Error("Artist already exists");
    } else {
        const newArtist = {
            name,
            genre,
            debut_year
        };

        const savedArtist = await artistRepository.saveArtist(newArtist); // 🔴 CHANGED
        return savedArtist;
    }
}

async function deleteByArtistId(id) {
    const artist = await artistRepository.findById(id);

    if(!artist) {
        return false;
    } else {
        return await artistRepository.deleteByArtistId(id);
    }
}

export default {
    getAllArtists,
    getArtistById,
    addArtist,
    deleteByArtistId
};