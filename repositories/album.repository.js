import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/albums.json")

function findAll() {
    const data = fs.readFileSync(filePath, "utf-8");

    if (!data) return [];

    return JSON.parse(data);
}

function findById(id){
    const allAlbums = findAll();

    return allAlbums.find(a => a.id === id) || null;
}

function saveAlbum(album) {
    if (!album.id || !album.artistId || !album.name) {
        throw new Error('Invalid album object');
    }

    const albums = findAll();

    albums.push(album);

    fs.writeFileSync(filePath, JSON.stringify(albums, null, 2), 'utf-8');
}

function deleteByAlbumId(id) {
    const allAlbums = findAll();

    const index = allAlbums.findIndex(r => r.id === id);

    if (index === -1) {
        return false;
    }

    allAlbums.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(allAlbums, null, 2), 'utf-8');

    return true;
}

export default {
  findAll,
  findById,
  saveAlbum,
  deleteByAlbumId
};
