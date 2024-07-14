const express = require('express');
const { findAllSongs, createSong, findSongById, updateSong, deleteSong } = require('../controllers/song.controller');

const router = express.Router();

router.get('/', findAllSongs);
router.post('/', createSong);
router.get('/:songId', findSongById);
router.put('/:songId', updateSong);
router.delete('/:songId', deleteSong);

module.exports = router;