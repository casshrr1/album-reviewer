import express from 'express';
import artistController from '../controllers/artist.controller.js';

const router = express.Router();

router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.addArtist);
router.delete('/:id', artistController.deleteArtist);

export default router;
