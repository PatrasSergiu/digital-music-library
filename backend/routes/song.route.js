const express = require('express');
const { findAllSongs, createSong, findSongById, updateSong, deleteSong } = require('../controllers/song.controller');

const router = express.Router();

router.get('/', findAllSongs);
router.post('/', createSong);
router.get('/:id', findSongById);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;