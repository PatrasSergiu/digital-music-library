const express = require('express');
const { findAllArtists, findAllAlbumsByArtist, createArtist, findArtistById, updateArtist, deleteArtist } = require('../controllers/artist.controller');

const router = express.Router();

router.get('/', findAllArtists);
router.post('/', createArtist);
router.get('/:artistId', findArtistById);
router.get('/:artistId/albums', findAllAlbumsByArtist);
router.put('/:artistId', updateArtist);
router.delete('/:artistId', deleteArtist)

module.exports = router;