import express from 'express';
import albumController from '../controllers/album.controller.js';

const router = express.Router();

router.get('/', albumController.getAllAlbums);
router.get('/artist/:artistId', albumController.getAlbumsByArtist);
router.get('/:id', albumController.getAlbumById);
router.post('/', albumController.addAlbum);
router.delete('/:id', albumController.deleteAlbum);

export default router;
