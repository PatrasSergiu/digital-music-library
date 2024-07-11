const express = require('express');
const { findAllArtists, createArtist, findArtistById, updateArtist, deleteArtist } = require('../controllers/artist.controller');

const router = express.Router();

router.get('/', findAllArtists);
router.post('/', createArtist);
router.get('/:id', findArtistById);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist)

module.exports = router;