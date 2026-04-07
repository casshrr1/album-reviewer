import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/artists.json")

function findAll() {
    const data = fs.readFileSync(filePath, "utf-8");

    if (!data) return [];

    return JSON.parse(data);
}

function findById(id){
    const allArtists = findAll();

    return allArtists.find(a => a.id === Number(id)) || null;
}

function saveArtist(newArtist) {
    const artists = findAll();

    artists.push(newArtist);

    fs.writeFileSync(filePath, JSON.stringify(artists, null, 2), 'utf-8');
}

function deleteByArtistId(id) {
    const allArtists = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
    
    const index = allArtists.findIndex(r => r.id === id);
        
    if (index === -1) {
        return false;
    }
    
    allArtists.splice(index, 1);
    
    fs.writeFileSync(filePath, JSON.stringify(allArtists, null, 2), 'utf-8');
    
    return true;
}

export default {
  findAll,
  findById,
  saveArtist,
  deleteByArtistId
};
